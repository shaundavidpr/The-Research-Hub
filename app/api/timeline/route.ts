import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const projectId = searchParams.get("projectId")
    const type = searchParams.get("type")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    let query = `SELECT * FROM timeline_events WHERE user_id = $1`
    const params = [userId]

    if (projectId) {
      query += ` AND project_id = $${params.length + 1}`
      params.push(projectId)
    }

    if (type) {
      query += ` AND type = $${params.length + 1}`
      params.push(type)
    }

    query += ` ORDER BY event_date ASC`

    const timelineEvents = await sql(query, params)
    return NextResponse.json(timelineEvents)
  } catch (error) {
    console.error("Error fetching timeline events:", error)
    return NextResponse.json({ error: "Failed to fetch timeline events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, projectId, title, description, type, eventDate, completed, priority } = await request.json()

    if (!userId || !title || !eventDate || !type) {
      return NextResponse.json({ error: "Missing required fields for timeline event creation" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO timeline_events (
        user_id, project_id, title, description, type, event_date, completed, priority, created_at, updated_at
      ) VALUES (
        ${userId}, ${projectId}, ${title}, ${description}, ${type}, ${eventDate}, ${completed || false}, ${priority || "medium"}, NOW(), NOW()
      ) RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating timeline event:", error)
    return NextResponse.json({ error: "Failed to create timeline event" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, userId, updates } = await request.json()

    if (!id || !userId || !updates) {
      return NextResponse.json({ error: "Missing required fields for timeline event update" }, { status: 400 })
    }

    const updateFields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 3}`)
      .join(", ")

    const updateValues = Object.values(updates)

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No update fields provided" }, { status: 400 })
    }

    const result = await sql`
      UPDATE timeline_events
      SET ${sql.unsafe(updateFields)}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Timeline event not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating timeline event:", error)
    return NextResponse.json({ error: "Failed to update timeline event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get("id")
    const userId = searchParams.get("userId")

    if (!eventId || !userId) {
      return NextResponse.json({ error: "Event ID and User ID required for deletion" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM timeline_events WHERE id = ${eventId} AND user_id = ${userId} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Timeline event not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ message: "Timeline event deleted successfully", id: eventId })
  } catch (error) {
    console.error("Error deleting timeline event:", error)
    return NextResponse.json({ error: "Failed to delete timeline event" }, { status: 500 })
  }
}
