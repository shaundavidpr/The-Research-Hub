import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value

    if (sessionToken) {
      // Remove session from database
      await sql`
        DELETE FROM user_sessions WHERE session_token = ${sessionToken}
      `
    }

    // Create response and clear session cookie
    const response = NextResponse.json({
      success: true,
      message: "Signed out successfully",
    })

    response.cookies.set("session_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Failed to sign out" }, { status: 500 })
  }
}
