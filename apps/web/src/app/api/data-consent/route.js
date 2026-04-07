import sql from "@/app/api/utils/sql";

// Store user consent for data sharing
export async function POST(request) {
  try {
    const {
      userId,
      consentGiven,
      consentType = "research",
    } = await request.json();

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    // Store consent in database
    const [consent] = await sql`
      INSERT INTO user_consents (user_id, consent_type, consent_given, consent_date)
      VALUES (${userId}, ${consentType}, ${consentGiven}, NOW())
      ON CONFLICT (user_id, consent_type) 
      DO UPDATE SET consent_given = ${consentGiven}, consent_date = NOW()
      RETURNING *
    `;

    return Response.json({ success: true, consent });
  } catch (error) {
    console.error("Consent Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Get user's current consent status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    const consents = await sql`
      SELECT * FROM user_consents 
      WHERE user_id = ${userId}
    `;

    return Response.json({ consents });
  } catch (error) {
    console.error("Consent Fetch Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
