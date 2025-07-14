import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json()

    if (!credential) {
      return NextResponse.json({ error: "Missing Google credential" }, { status: 400 })
    }

    // Decode Google JWT token (in production, verify the token signature)
    const payload = JSON.parse(atob(credential.split(".")[1]))

    if (!payload.email || !payload.name) {
      return NextResponse.json({ error: "Invalid Google credential" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${payload.email}
    `

    let user
    let isNewUser = false

    if (existingUser.length > 0) {
      user = existingUser[0]

      // Update user info if it's a Google user
      if (user.provider === "google") {
        await sql`
          UPDATE users 
          SET name = ${payload.name}, avatar = ${payload.picture}, updated_at = NOW()
          WHERE id = ${user.id}
        `
      }
    } else {
      // Create new user
      const newUsers = await sql`
        INSERT INTO users (
          email, name, avatar, provider, provider_id, email_verified, created_at, updated_at
        ) VALUES (
          ${payload.email}, ${payload.name}, ${payload.picture}, 
          'google', ${payload.sub}, true, NOW(), NOW()
        ) RETURNING *
      `
      user = newUsers[0]
      isNewUser = true
    }

    // Create session token
    const sessionToken = crypto.randomUUID()

    // Store session in database
    await sql`
      INSERT INTO user_sessions (user_id, session_token, expires_at, created_at)
      VALUES (${user.id}, ${sessionToken}, NOW() + INTERVAL '7 days', NOW())
    `

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      isNewUser,
      message: isNewUser ? "Account created successfully!" : "Signed in successfully!",
    })

    response.cookies.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
