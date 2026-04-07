// Longitudinal Health Tracking - Track pet health changes over time
// Compares multiple DNA analyses, health records, and behavioral changes

import sql from "@/app/api/utils/sql";
import { callOpenRouter } from "@/app/api/utils/openrouter-models";

export async function POST(request) {
  try {
    const { petId, includeVocalData, includeHealthEvents } =
      await request.json();

    if (!petId) {
      return Response.json({ error: "Missing petId" }, { status: 400 });
    }

    // 1. Get pet details
    const [pet] = await sql`SELECT * FROM pets WHERE id = ${petId}`;
    if (!pet) {
      return Response.json({ error: "Pet not found" }, { status: 404 });
    }

    // 2. Get all DNA reports over time
    const dnaReports = await sql`
      SELECT * FROM dna_reports 
      WHERE pet_id = ${petId} 
      ORDER BY created_at ASC
    `;

    // 3. Get vocal analysis data if requested
    let vocalData = [];
    if (includeVocalData) {
      vocalData = await sql`
        SELECT * FROM recordings 
        WHERE pet_id = ${petId} 
        ORDER BY created_at ASC
      `;
    }

    // 4. Build comprehensive timeline
    const timeline = [];

    dnaReports.forEach((report, index) => {
      timeline.push({
        date: report.created_at,
        type: "dna_analysis",
        tier: report.tier,
        analysis: report.analysis_json,
        report_number: index + 1,
      });
    });

    vocalData.forEach((recording) => {
      timeline.push({
        date: recording.created_at,
        type: "vocal_recording",
        analysis: recording.vocal_analysis,
      });
    });

    // Sort by date
    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

    // 5. Generate longitudinal health insights
    const prompt = `
      Analyze the longitudinal health data for ${pet.name}, a ${pet.species} (${pet.breed_hint || "unknown breed"}).
      
      TIMELINE DATA (${timeline.length} entries):
      ${JSON.stringify(timeline, null, 2)}
      
      ANALYSIS PERIOD: ${timeline[0]?.date} to ${timeline[timeline.length - 1]?.date}
      
      Generate comprehensive longitudinal health insights in JSON format:
      {
        "health_trajectory": {
          "overall_trend": "improving|stable|declining|variable",
          "confidence": "high|moderate|low",
          "key_observations": ["array"]
        },
        "genetic_risk_evolution": [
          {
            "condition": "string",
            "initial_risk": "percentage",
            "current_risk": "percentage",
            "trend": "increasing|decreasing|stable",
            "factors": ["environmental", "age-related", "lifestyle"],
            "recommendations": ["array"]
          }
        ],
        "behavioral_changes": {
          "vocal_patterns": {
            "changes_detected": ["array"],
            "potential_causes": ["array"],
            "genetic_correlation": "string"
          },
          "activity_level": {
            "trend": "string",
            "age_appropriateness": "normal|concerning"
          }
        },
        "aging_markers_progression": {
          "biological_age_estimate": "years",
          "chronological_age": "${calculateAge(pet.created_at)} years",
          "aging_rate": "faster|normal|slower than average",
          "longevity_factors": ["array"],
          "interventions": ["array"]
        },
        "preventive_care_timeline": [
          {
            "age_milestone": "string",
            "recommended_screenings": ["array"],
            "genetic_considerations": ["array"],
            "optimal_timing": "string"
          }
        ],
        "medication_response_tracking": {
          "genetic_expectations": "string",
          "monitoring_recommendations": ["array"],
          "adjustment_triggers": ["array"]
        },
        "nutrition_evolution": {
          "changing_needs": ["array"],
          "life_stage_adjustments": ["array"],
          "genetic_factors": ["array"]
        },
        "environmental_factors": {
          "identified_risks": ["array"],
          "protective_factors": ["array"],
          "recommendations": ["array"]
        },
        "comparative_analysis": {
          "vs_breed_average": {
            "health_status": "better|average|worse",
            "factors": ["array"]
          },
          "vs_previous_reports": {
            "improvements": ["array"],
            "concerns": ["array"],
            "stable_markers": ["array"]
          }
        },
        "future_projections": {
          "1_year_outlook": {
            "expected_changes": ["array"],
            "monitoring_priorities": ["array"]
          },
          "5_year_outlook": {
            "likely_conditions": ["array"],
            "preventive_strategies": ["array"]
          },
          "lifetime_considerations": {
            "major_health_milestones": ["array"],
            "genetic_destiny": "string",
            "modifiable_factors": ["array"]
          }
        },
        "veterinary_recommendations": [
          {
            "priority": "high|medium|low",
            "action": "string",
            "rationale": "based on longitudinal data",
            "timing": "immediate|3mo|6mo|annual"
          }
        ],
        "success_metrics": {
          "tracking_completeness": "percentage",
          "data_quality": "excellent|good|fair",
          "confidence_in_predictions": "high|moderate|low"
        }
      }
      
      CRITICAL: Focus on TRENDS over time, not just snapshots. Identify early warning signs. Provide actionable guidance for owners and veterinarians.
    `;

    const longitudinalAnalysis = await callOpenRouter(prompt, "ULTRA", true);
    const parsedAnalysis = JSON.parse(longitudinalAnalysis);

    // 6. Store longitudinal analysis
    await sql`
      INSERT INTO usage_tracking (event_type, user_id, metadata)
      VALUES ('longitudinal_analysis', 'system', ${JSON.stringify({
        pet_id: petId,
        reports_analyzed: dnaReports.length,
        vocal_recordings: vocalData.length,
        timestamp: new Date().toISOString(),
      })})
    `;

    return Response.json({
      success: true,
      longitudinal_health_report: parsedAnalysis,
      timeline_summary: {
        total_entries: timeline.length,
        dna_reports: dnaReports.length,
        vocal_recordings: vocalData.length,
        date_range: {
          from: timeline[0]?.date,
          to: timeline[timeline.length - 1]?.date,
        },
      },
      pet_info: {
        name: pet.name,
        species: pet.species,
        breed: pet.breed_hint,
        age: calculateAge(pet.created_at),
      },
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Longitudinal tracking error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to calculate pet age
function calculateAge(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const ageMs = now - created;
  const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
  return ageYears.toFixed(1);
}

// GET: Retrieve timeline data for visualization
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const petId = searchParams.get("petId");

  if (!petId) {
    return Response.json({ error: "Missing petId" }, { status: 400 });
  }

  const dnaReports = await sql`
    SELECT id, created_at, tier, 
           analysis_json->'health_predispositions' as health_markers,
           analysis_json->'aging_markers' as aging_data
    FROM dna_reports 
    WHERE pet_id = ${petId} 
    ORDER BY created_at ASC
  `;

  const vocalData = await sql`
    SELECT id, created_at, vocal_analysis
    FROM recordings 
    WHERE pet_id = ${petId} 
    ORDER BY created_at ASC
  `;

  return Response.json({
    timeline: {
      dna_analyses: dnaReports,
      vocal_recordings: vocalData,
    },
  });
}
