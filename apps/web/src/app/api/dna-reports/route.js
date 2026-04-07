import sql from "@/app/api/utils/sql";

/**
 * GET: Fetch all DNA reports with pet information
 * Query params: petId (optional) - filter by specific pet
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const petId = searchParams.get("petId");

    let reports;

    if (petId) {
      reports = await sql`
        SELECT 
          r.*,
          p.name as pet_name,
          p.species,
          p.breed_hint
        FROM dna_reports r
        JOIN pets p ON r.pet_id = p.id
        WHERE r.pet_id = ${petId}
        ORDER BY r.created_at DESC
      `;
    } else {
      reports = await sql`
        SELECT 
          r.*,
          p.name as pet_name,
          p.species,
          p.breed_hint
        FROM dna_reports r
        JOIN pets p ON r.pet_id = p.id
        ORDER BY r.created_at DESC
      `;
    }

    return Response.json({
      success: true,
      count: reports.length,
      reports: reports,
    });
  } catch (error) {
    console.error("Error fetching DNA reports:", error);
    return Response.json(
      { error: error.message || "Failed to fetch reports" },
      { status: 500 },
    );
  }
}

/**
 * DELETE: Delete a DNA report
 */
export async function DELETE(request) {
  try {
    const { reportId } = await request.json();

    if (!reportId) {
      return Response.json({ error: "Missing reportId" }, { status: 400 });
    }

    await sql`
      DELETE FROM dna_reports
      WHERE id = ${reportId}
    `;

    return Response.json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    return Response.json(
      { error: error.message || "Failed to delete report" },
      { status: 500 },
    );
  }
}
