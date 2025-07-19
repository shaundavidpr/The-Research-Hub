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

    let query = `SELECT * FROM files WHERE user_id = $1`
    const params = [userId]

    if (type) {
      query += ` AND type ILIKE $${params.length + 1}` // Use ILIKE for case-insensitive search
      params.push(`%${type}%`)
    }

    if (projectId) {
      query += ` AND project_id = $${params.length + 1}`
      params.push(projectId)
    }

    query += ` ORDER BY created_at DESC`

    const files = await sql(query, params)
    return NextResponse.json(files)
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name, type, size, url, projectId, metadata } = await request.json()

    if (!userId || !name || !type || !size || !url) {
      return NextResponse.json({ error: "Missing required fields for file creation" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO files (user_id, name, type, size, url, project_id, metadata, created_at, updated_at)
      VALUES (${userId}, ${name}, ${type}, ${size}, ${url}, ${projectId}, ${JSON.stringify(metadata || {})}, NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating file:", error)
    return NextResponse.json({ error: "Failed to create file" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("id")
    const userId = searchParams.get("userId") // Ensure user owns the file

    if (!fileId || !userId) {
      return NextResponse.json({ error: "File ID and User ID required for deletion" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM files WHERE id = ${fileId} AND user_id = ${userId} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "File not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ message: "File deleted successfully", id: fileId })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
