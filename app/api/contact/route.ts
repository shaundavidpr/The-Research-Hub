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

    // Insert contact form submission into database
    await sql`
      INSERT INTO contact_submissions (name, email, subject, message, type, created_at)
      VALUES (${name}, ${email}, ${subject}, ${message}, ${type}, NOW())
    `

    // Here you could also send an email notification to your team
    // await sendEmailNotification({ name, email, subject, message, type })

    return NextResponse.json({ success: true, message: "Contact form submitted successfully" })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
