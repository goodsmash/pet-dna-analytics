import sql from "@/app/api/utils/sql";
import crypto from "crypto";

// Anonymize and store DNA data for research (with user consent)
export async function POST(request) {
  try {
    const { reportId, userId } = await request.json();

    if (!reportId || !userId) {
      return Response.json(
        { error: "Missing reportId or userId" },
        { status: 400 },
      );
    }

    // Check user consent
    const [consent] = await sql`
      SELECT * FROM user_consents
      WHERE user_id = ${userId}
      AND consent_type = 'research'
      AND consent_given = true
    `;

    if (!consent) {
      return Response.json(
        { error: "User has not consented to data sharing" },
        { status: 403 },
      );
    }

    // Fetch the DNA report
    const [report] = await sql`
      SELECT dr.*, p.species, p.breed_hint
      FROM dna_reports dr
      JOIN pets p ON dr.pet_id = p.id
      WHERE dr.id = ${reportId}
    `;

    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    // Create anonymized hash of DNA sample
    const dnaHash = crypto
      .createHash("sha256")
      .update(report.file_url + Date.now())
      .digest("hex");

    // Remove all identifying information and store anonymized data
    await sql`
      INSERT INTO anonymized_dna_data (species, breed_hint, dna_sample_hash, analysis_results)
      VALUES (
        ${report.species},
        ${report.breed_hint || "Unknown"},
        ${dnaHash},
        ${JSON.stringify(report.analysis_json)}
      )
      ON CONFLICT (dna_sample_hash) DO NOTHING
    `;

    // Track the contribution
    await sql`
      INSERT INTO usage_analytics (user_id, event_type, event_data, tier)
      VALUES (
        ${userId},
        'data_contribution',
        ${JSON.stringify({ reportId, species: report.species })},
        'research'
      )
    `;

    return Response.json({
      success: true,
      message: "Thank you for contributing to pet health research!",
    });
  } catch (error) {
    console.error("Data Anonymization Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Export anonymized research data (for approved researchers)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const species = searchParams.get("species");
    const limit = parseInt(searchParams.get("limit") || "100");

    let data;

    if (species) {
      data = await sql`
        SELECT species, breed_hint, analysis_results, contributed_at
        FROM anonymized_dna_data
        WHERE species = ${species}
        ORDER BY contributed_at DESC
        LIMIT ${limit}
      `;
    } else {
      data = await sql`
        SELECT species, breed_hint, analysis_results, contributed_at
        FROM anonymized_dna_data
        ORDER BY contributed_at DESC
        LIMIT ${limit}
      `;
    }

    // Aggregate statistics
    const stats = await sql`
      SELECT 
        species,
        COUNT(*) as sample_count,
        COUNT(DISTINCT breed_hint) as unique_breeds
      FROM anonymized_dna_data
      GROUP BY species
    `;

    return Response.json({
      data,
      stats,
      total_samples: data.length,
    });
  } catch (error) {
    console.error("Research Data Export Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
