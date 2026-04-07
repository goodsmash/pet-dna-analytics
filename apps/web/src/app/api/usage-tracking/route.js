import sql from "@/app/api/utils/sql";

// Track feature usage for analytics
export async function POST(request) {
  try {
    const {
      userId,
      eventType,
      eventData = {},
      tier = "FREE",
    } = await request.json();

    if (!eventType) {
      return Response.json({ error: "Missing eventType" }, { status: 400 });
    }

    // Store usage event
    await sql`
      INSERT INTO usage_analytics (user_id, event_type, event_data, tier)
      VALUES (${userId || "anonymous"}, ${eventType}, ${JSON.stringify(eventData)}, ${tier})
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Usage Tracking Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Get usage analytics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate =
      searchParams.get("startDate") ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = searchParams.get("endDate") || new Date().toISOString();

    let analytics;

    if (userId) {
      // User-specific analytics
      analytics = await sql`
        SELECT event_type, COUNT(*) as count, MAX(created_at) as last_used
        FROM usage_analytics
        WHERE user_id = ${userId}
        AND created_at >= ${startDate}
        AND created_at <= ${endDate}
        GROUP BY event_type
        ORDER BY count DESC
      `;
    } else {
      // Platform-wide analytics
      analytics = await sql`
        SELECT 
          event_type,
          tier,
          COUNT(*) as count,
          COUNT(DISTINCT user_id) as unique_users
        FROM usage_analytics
        WHERE created_at >= ${startDate}
        AND created_at <= ${endDate}
        GROUP BY event_type, tier
        ORDER BY count DESC
      `;
    }

    return Response.json({ analytics });
  } catch (error) {
    console.error("Analytics Fetch Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
