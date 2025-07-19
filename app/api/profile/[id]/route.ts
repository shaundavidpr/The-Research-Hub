import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const profile = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId}
    `

    if (profile.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile[0])
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const updates = await request.json()

    if (!userId || !updates) {
      return NextResponse.json({ error: "User ID and updates required" }, { status: 400 })
    }

    // Construct dynamic update query
    const updateFields = Object.keys(updates)
      .map((key, index) => {
        // Handle JSONB fields like research_topics, methodologies, specializations
        if (["research_topics", "methodologies", "specializations"].includes(key)) {
          return `${key} = $${index + 2}::jsonb`
        }
        return `${key} = $${index + 2}`
      })
      .join(", ")

    const updateValues = Object.values(updates)

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No update fields provided" }, { status: 400 })
    }

    const result = await sql`
      UPDATE user_profiles
      SET ${sql.unsafe(updateFields)}, updated_at = NOW()
      WHERE user_id = ${userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Profile not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
