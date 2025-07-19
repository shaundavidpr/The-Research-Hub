import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type")
    const tags = searchParams.get("tags") ? JSON.parse(searchParams.get("tags") as string) : []

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    let query = `SELECT * FROM citations WHERE user_id = $1`
    const params = [userId]

    if (type) {
      query += ` AND type = $${params.length + 1}`
      params.push(type)
    }

    if (tags.length > 0) {
      query += ` AND tags @> $${params.length + 1}::jsonb`
      params.push(JSON.stringify(tags))
    }

    query += ` ORDER BY year DESC, created_at DESC`

    const citations = await sql(query, params)
    return NextResponse.json(citations)
  } catch (error) {
    console.error("Error fetching citations:", error)
    return NextResponse.json({ error: "Failed to fetch citations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, title, authors, journal, year, doi, url, pages, volume, issue, publisher, tags, isFavorite } =
      await request.json()

    if (!userId || !type || !title || !authors || !year) {
      return NextResponse.json({ error: "Missing required fields for citation creation" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO citations (
        user_id, type, title, authors, journal, year, doi, url, pages, volume, issue, publisher, tags, is_favorite, created_at, updated_at
      ) VALUES (
        ${userId}, ${type}, ${title}, ${JSON.stringify(authors)}, ${journal}, ${year}, ${doi}, ${url}, ${pages}, ${volume}, ${issue}, ${publisher}, ${JSON.stringify(tags || [])}, ${isFavorite || false}, NOW(), NOW()
      ) RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating citation:", error)
    return NextResponse.json({ error: "Failed to create citation" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, userId, updates } = await request.json()

    if (!id || !userId || !updates) {
      return NextResponse.json({ error: "Missing required fields for citation update" }, { status: 400 })
    }

    const updateFields = Object.keys(updates)
      .map((key, index) => {
        if (key === "authors" || key === "tags") {
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
      UPDATE citations
      SET ${sql.unsafe(updateFields)}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Citation not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating citation:", error)
    return NextResponse.json({ error: "Failed to update citation" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const citationId = searchParams.get("id")
    const userId = searchParams.get("userId")

    if (!citationId || !userId) {
      return NextResponse.json({ error: "Citation ID and User ID required for deletion" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM citations WHERE id = ${citationId} AND user_id = ${userId} RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Citation not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ message: "Citation deleted successfully", id: citationId })
  } catch (error) {
    console.error("Error deleting citation:", error)
    return NextResponse.json({ error: "Failed to delete citation" }, { status: 500 })
  }
}
