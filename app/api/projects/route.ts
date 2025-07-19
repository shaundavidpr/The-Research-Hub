import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const projectId = searchParams.get("projectId") // For fetching a single project

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    if (projectId) {
      const project = await sql`
        SELECT * FROM research_projects WHERE id = ${projectId} AND (user_id = ${userId} OR ${userId} = ANY(collaborators))
      `
      if (project.length === 0) {
        return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 })
      }
      return NextResponse.json(project[0])
    } else {
      const projects = await sql`
        SELECT * FROM research_projects WHERE user_id = ${userId} OR ${userId} = ANY(collaborators) ORDER BY updated_at DESC
      `
      return NextResponse.json(projects)
    }
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title, description, status, progress, startDate, endDate, collaborators, tags, isPrivate } =
      await request.json()

    if (!userId || !title || !description) {
      return NextResponse.json({ error: "Missing required fields for project creation" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO research_projects (
        user_id, title, description, status, progress, start_date, end_date, collaborators, tags, is_private, created_at, updated_at
      ) VALUES (
        ${userId}, ${title}, ${description}, ${status || "planning"}, ${progress || 0}, ${startDate}, ${endDate}, 
        ${JSON.stringify(collaborators || [])}, ${JSON.stringify(tags || [])}, ${isPrivate || false}, NOW(), NOW()
      ) RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, userId, updates } = await request.json()

    if (!id || !userId || !updates) {
      return NextResponse.json({ error: "Missing required fields for project update" }, { status: 400 })
    }

    // Construct dynamic update query
    const updateFields = Object.keys(updates)
      .map((key, index) => {
        // Handle JSONB fields like collaborators and tags
        if (key === "collaborators" || key === "tags") {
          return `${key} = $${index + 3}::jsonb`
        }
        return `${key} = $${index + 3}`
      })
      .join(", ")

    const updateValues = Object.values(updates)

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No update fields provided" }, { status: 400 })
    }

    const result = await sql`
      UPDATE research_projects
      SET ${sql.unsafe(updateFields)}, updated_at = NOW()
      WHERE id = ${id} AND (user_id = ${userId} OR ${userId} = ANY(collaborators))
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("id")
    const userId = searchParams.get("userId") // Ensure user owns the project

    if (!projectId || !userId) {
      return NextResponse.json({ error: "Project ID and User ID required for deletion" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM research_projects WHERE id = ${projectId} AND user_id = ${userId} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully", id: projectId })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
