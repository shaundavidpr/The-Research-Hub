import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()

    // Decode Google JWT token (in production, verify the token)
    const payload = JSON.parse(atob(credential.split(".")[1]))

    // Check if user exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${payload.email}
    `

    if (existingUser.length > 0) {
      // User exists, return user data
      return NextResponse.json({
        user: existingUser[0],
        isNewUser: false,
      })
    } else {
      // Create new user
      const newUser = await sql`
        INSERT INTO users (
          email, name, avatar, provider, provider_id, created_at, updated_at
        ) VALUES (
          ${payload.email}, ${payload.name}, ${payload.picture}, 
          'google', ${payload.sub}, NOW(), NOW()
        ) RETURNING *
      `

      return NextResponse.json({
        user: newUser[0],
        isNewUser: true,
      })
    }
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
