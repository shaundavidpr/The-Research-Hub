import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${request.nextUrl.origin}/api/auth/google/callback`,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokens.access_token) {
      throw new Error("No access token received")
    }

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const googleUser = await userResponse.json()

    // Check if user exists in our database
    const existingUser = await sql`
      SELECT * FROM neon_auth.users_sync WHERE email = ${googleUser.email}
    `

    let user
    if (existingUser.length > 0) {
      // Update existing user
      user = existingUser[0]
      await sql`
        UPDATE neon_auth.users_sync 
        SET updated_at = NOW(), raw_json = ${JSON.stringify(googleUser)}
        WHERE email = ${googleUser.email}
      `
    } else {
      // Create new user
      const newUsers = await sql`
        INSERT INTO neon_auth.users_sync (id, email, name, raw_json, created_at, updated_at)
        VALUES (${googleUser.id}, ${googleUser.email}, ${googleUser.name}, ${JSON.stringify(googleUser)}, NOW(), NOW())
        RETURNING *
      `
      user = newUsers[0]
    }

    // Create session (you might want to use a proper session management library)
    const response = NextResponse.redirect(new URL(state === "signup" ? "/profile/create" : "/dashboard", request.url))

    // Set session cookie
    response.cookies.set("user_session", JSON.stringify({ userId: user.id, email: user.email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url))
  }
}
