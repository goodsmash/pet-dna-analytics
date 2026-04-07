import sql from "@/app/api/utils/sql";

// Generate PDF export of DNA report (ULTRA tier feature)
export async function POST(request) {
  try {
    const { reportId, userId, tier } = await request.json();

    if (!reportId) {
      return Response.json({ error: "Missing reportId" }, { status: 400 });
    }

    // Check tier permission
    if (tier !== "ULTRA" && tier !== "PRO") {
      return Response.json(
        { error: "Export feature requires PRO or ULTRA subscription" },
        { status: 403 },
      );
    }

    // Fetch report
    const [report] = await sql`
      SELECT dr.*, p.name as pet_name, p.species 
      FROM dna_reports dr
      JOIN pets p ON dr.pet_id = p.id
      WHERE dr.id = ${reportId}
    `;

    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    // Generate PDF content (simplified - in production use a PDF library)
    const pdfContent = generatePDFContent(report);

    // Log export event for analytics
    await sql`
      INSERT INTO export_events (report_id, user_id, export_type, tier)
      VALUES (${reportId}, ${userId || "unknown"}, 'pdf', ${tier})
    `;

    return Response.json({
      success: true,
      reportId: report.id,
      petName: report.pet_name,
      exportUrl: `/api/export-report/${reportId}/download`,
      // In production, return actual PDF blob or URL
      pdfData: pdfContent,
    });
  } catch (error) {
    console.error("Export Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

function generatePDFContent(report) {
  // Simplified PDF generation - in production use libraries like PDFKit or jsPDF
  const analysis = report.analysis_json;

  return {
    title: `DNA Analysis Report - ${report.pet_name}`,
    date: new Date(report.created_at).toLocaleDateString(),
    tier: report.tier,
    sections: [
      {
        title: "Breed Composition",
        content: JSON.stringify(analysis.breed_composition, null, 2),
      },
      {
        title: "Health Predispositions",
        content: JSON.stringify(analysis.health_predispositions, null, 2),
      },
      {
        title: "Behavioral Traits",
        content: JSON.stringify(analysis.behavioral_traits, null, 2),
      },
      // Add all other categories
    ],
  };
}
