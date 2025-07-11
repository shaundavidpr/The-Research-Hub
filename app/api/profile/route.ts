import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json()

    // Insert user profile into database
    const result = await sql`
      INSERT INTO user_profiles (
        name, email, title, institution, department, bio, avatar,
        degree, field, advisor, year_started, orcid, google_scholar,
        research_topics, methodologies, specializations,
        profile_visibility, allow_messages, allow_collaboration,
        email_notifications, research_updates,
        created_at, updated_at
      ) VALUES (
        ${profileData.name}, ${profileData.email}, ${profileData.title}, 
        ${profileData.institution}, ${profileData.department}, ${profileData.bio}, ${profileData.avatar},
        ${profileData.degree}, ${profileData.field}, ${profileData.advisor}, 
        ${profileData.yearStarted}, ${profileData.orcid}, ${profileData.googleScholar},
        ${JSON.stringify(profileData.researchTopics)}, ${JSON.stringify(profileData.methodologies)}, 
        ${JSON.stringify(profileData.specializations)},
        ${profileData.profileVisibility}, ${profileData.allowMessages}, ${profileData.allowCollaboration},
        ${profileData.emailNotifications}, ${profileData.researchUpdates},
        NOW(), NOW()
      ) RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating profile:", error)
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 })
  }
}
