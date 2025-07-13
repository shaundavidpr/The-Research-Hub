import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM neon_auth.users_sync WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUsers = await sql`
      INSERT INTO neon_auth.users_sync (id, email, name, raw_json, created_at, updated_at)
      VALUES (${crypto.randomUUID()}, ${email}, ${name}, ${JSON.stringify({
        email,
        name,
        password: hashedPassword,
        provider: "email",
      })}, NOW(), NOW())
      RETURNING *
    `

    const user = newUsers[0]

    // Create session
    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } })

    response.cookies.set("user_session", JSON.stringify({ userId: user.id, email: user.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
