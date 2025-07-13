import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    // Find user
    const users = await sql`
      SELECT * FROM neon_auth.users_sync WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]
    const userData = user.raw_json as any

    // Check if user signed up with Google
    if (userData.provider !== "email") {
      return NextResponse.json({ error: "Please sign in with Google" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

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
    console.error("Login error:", error)
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 })
  }
}
