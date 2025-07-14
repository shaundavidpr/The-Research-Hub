import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, type } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Insert contact form submission into database
    await sql`
      INSERT INTO contact_submissions (name, email, subject, message, type, status, created_at)
      VALUES (${name}, ${email}, ${subject}, ${message}, ${type || "general"}, 'new', NOW())
    `

    // Here you could also send an email notification to your team
    // await sendEmailNotification({ name, email, subject, message, type })

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you within 24 hours.",
    })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return NextResponse.json(
      {
        error: "Failed to submit contact form. Please try again.",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could be used by admin to view contact submissions
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "new"

    const submissions = await sql`
      SELECT id, name, email, subject, type, status, created_at 
      FROM contact_submissions 
      WHERE status = ${status}
      ORDER BY created_at DESC
      LIMIT 50
    `

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("Error fetching contact submissions:", error)
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 })
  }
}
