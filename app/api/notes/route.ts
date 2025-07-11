import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type")
    const projectId = searchParams.get("projectId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    let query = `SELECT * FROM notes WHERE user_id = $1`
    const params = [userId]

    if (type) {
      query += ` AND type = $${params.length + 1}`
      params.push(type)
    }

    if (projectId) {
      query += ` AND project_id = $${params.length + 1}`
      params.push(projectId)
    }

    query += ` ORDER BY updated_at DESC`

    const notes = await sql(query, params)
    return NextResponse.json(notes)
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title, content, type, tags, projectId, isPublic } = await request.json()

    const result = await sql`
      INSERT INTO notes (user_id, title, content, type, tags, project_id, is_public, created_at, updated_at)
      VALUES (${userId}, ${title}, ${content}, ${type || "research"}, ${JSON.stringify(tags || [])}, 
              ${projectId}, ${isPublic || false}, NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
