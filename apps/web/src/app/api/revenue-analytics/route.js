import sql from "@/app/api/utils/sql";

// Track revenue and usage analytics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate =
      searchParams.get("startDate") ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = searchParams.get("endDate") || new Date().toISOString();

    // Analysis counts by tier
    const analysisByTier = await sql`
      SELECT tier, COUNT(*) as count, COUNT(DISTINCT pet_id) as unique_pets
      FROM dna_reports
      WHERE created_at >= ${startDate} AND created_at <= ${endDate}
      GROUP BY tier
    `;

    // Export events
    const exports = await sql`
      SELECT COUNT(*) as total_exports, tier
      FROM export_events
      WHERE created_at >= ${startDate} AND created_at <= ${endDate}
      GROUP BY tier
    `;

    // Data consent stats
    const consentStats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE consent_given = true) as consented,
        COUNT(*) FILTER (WHERE consent_given = false) as declined
      FROM user_consents
      WHERE consent_type = 'research'
    `;

    // Calculate estimated revenue (based on tier pricing)
    const tierPricing = {
      FREE: 0,
      PRO: 9.99,
      ULTRA: 24.99,
    };

    let estimatedRevenue = 0;
    analysisByTier.forEach((row) => {
      estimatedRevenue += (tierPricing[row.tier] || 0) * parseInt(row.count);
    });

    return Response.json({
      dateRange: { startDate, endDate },
      analysisByTier,
      exports,
      consentStats: consentStats[0] || { consented: 0, declined: 0 },
      estimatedRevenue: estimatedRevenue.toFixed(2),
      metrics: {
        totalAnalyses: analysisByTier.reduce(
          (sum, row) => sum + parseInt(row.count),
          0,
        ),
        uniquePets: analysisByTier.reduce(
          (sum, row) => sum + parseInt(row.unique_pets),
          0,
        ),
        totalExports: exports.reduce(
          (sum, row) => sum + parseInt(row.total_exports),
          0,
        ),
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
