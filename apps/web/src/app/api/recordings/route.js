import sql from "@/app/api/utils/sql";
import { callOpenRouter } from "@/app/api/utils/openrouter-models";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const petId = searchParams.get("petId");

  if (!petId) {
    return Response.json({ error: "Missing petId" }, { status: 400 });
  }

  const recordings = await sql`
    SELECT * FROM recordings 
    WHERE pet_id = ${petId} 
    ORDER BY created_at DESC
  `;

  return Response.json({ recordings });
}

export async function POST(request) {
  try {
    const { petId, recordingUrl, transcript } = await request.json();

    if (!petId || !recordingUrl) {
      return Response.json(
        { error: "Missing petId or recordingUrl" },
        { status: 400 },
      );
    }

    // 1. Fetch pet and latest DNA report for context
    const [pet] = await sql`SELECT * FROM pets WHERE id = ${petId}`;
    const [latestReport] = await sql`
      SELECT * FROM dna_reports 
      WHERE pet_id = ${petId} 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    // 2. Perform vocal analysis using AI
    const prompt = `
      Analyze this vocal recording for a ${pet.species} named ${pet.name}.
      Transcript: ${transcript || "No transcript available"}
      
      Genetic Context:
      ${latestReport ? JSON.stringify(latestReport.analysis_json.vocal_genetics) : "No genetic data available"}

      Analyze the correlation between the animal's genetics and this specific vocalization.
      Return a JSON object with:
      - mood: (string)
      - intent: (string)
      - genetic_correlation: (string describing if this vocalization matches their genetic predisposition)
      - recommendation: (string)
    `;

    const vocalAnalysis = await callOpenRouter(prompt, "FREE", true);
    const parsedAnalysis = JSON.parse(vocalAnalysis);

    // 3. Store recording and analysis
    const [recording] = await sql`
      INSERT INTO recordings (pet_id, recording_url, transcript, vocal_analysis)
      VALUES (${petId}, ${recordingUrl}, ${transcript || null}, ${JSON.stringify(parsedAnalysis)})
      RETURNING *
    `;

    return Response.json({ recording });
  } catch (error) {
    console.error("Recording Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
