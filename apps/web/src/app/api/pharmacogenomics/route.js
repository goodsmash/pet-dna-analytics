// Pharmacogenomics - Drug Safety Analysis
// Analyzes genetic markers to predict medication responses and safety

import sql from "@/app/api/utils/sql";
import { callOpenRouter } from "@/app/api/utils/openrouter-models";
import {
  CAT_GENETIC_MARKERS,
  DOG_GENETIC_MARKERS,
} from "../dna-reference-data/route.js";

// Known pharmacogenomic markers for pets
const PET_PHARMACOGENOMICS = {
  cat: {
    CYP450: {
      marker: "CYP1A2",
      drugs_affected: ["Propofol", "Benzodiazepines", "NSAIDs"],
      risk_level: "moderate",
      recommendation: "Dose adjustment may be needed",
    },
    MDR1: {
      marker: "ABCB1_mutation",
      drugs_affected: [
        "Ivermectin",
        "Loperamide",
        "Vincristine",
        "Doxorubicin",
      ],
      risk_level: "high",
      recommendation: "Avoid or use extreme caution",
    },
    COMT: {
      marker: "COMT_variant",
      drugs_affected: ["Opioids", "Sedatives"],
      risk_level: "moderate",
      recommendation: "May require dosage modification",
    },
  },
  dog: {
    MDR1: {
      marker: "ABCB1_mutation",
      drugs_affected: [
        "Ivermectin",
        "Loperamide",
        "Acepromazine",
        "Butorphanol",
        "Doxorubicin",
        "Vincristine",
        "Vinblastine",
        "Cyclosporine",
        "Digoxin",
        "Ondansetron",
      ],
      risk_level: "critical",
      recommendation: "AVOID these drugs - potentially fatal",
      affected_breeds: [
        "Collie",
        "Australian Shepherd",
        "Shetland Sheepdog",
        "German Shepherd",
      ],
    },
    CYP450: {
      marker: "CYP2D15",
      drugs_affected: ["Codeine", "Tramadol", "Dextromethorphan"],
      risk_level: "moderate",
      recommendation: "Pain medication may be less effective",
    },
    NAT2: {
      marker: "NAT2_slow",
      drugs_affected: ["Sulfonamides", "Hydralazine", "Procainamide"],
      risk_level: "moderate",
      recommendation: "Increased risk of adverse reactions",
    },
    VKORC1: {
      marker: "VKORC1_variant",
      drugs_affected: ["Warfarin", "Other anticoagulants"],
      risk_level: "high",
      recommendation: "Requires careful monitoring and dose adjustment",
    },
  },
};

export async function POST(request) {
  try {
    const { reportId, medicationName } = await request.json();

    if (!reportId) {
      return Response.json({ error: "Missing reportId" }, { status: 400 });
    }

    // 1. Get the DNA report
    const [report] = await sql`
      SELECT dr.*, p.species, p.name, p.breed_hint
      FROM dna_reports dr
      JOIN pets p ON dr.pet_id = p.id
      WHERE dr.id = ${reportId}
    `;

    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    const analysis = report.analysis_json;
    const species = report.species.toLowerCase();
    const pharmacoMarkers = PET_PHARMACOGENOMICS[species] || {};

    // 2. Extract pharmacogenomic markers from analysis
    const detectedMarkers = [];
    if (analysis.pharmacogenomics) {
      detectedMarkers.push(
        ...(analysis.pharmacogenomics.drug_sensitivities || []),
      );
    }

    // 3. Build drug safety report
    const prompt = `
      Analyze drug safety for a ${report.species} (${report.breed_hint || "unknown breed"}) based on genetic markers.
      
      ${medicationName ? `Specific Medication Requested: ${medicationName}` : "General drug safety analysis"}
      
      DETECTED PHARMACOGENOMIC MARKERS:
      ${JSON.stringify(detectedMarkers, null, 2)}
      
      KNOWN PHARMACOGENOMIC MARKERS FOR ${report.species.toUpperCase()}:
      ${JSON.stringify(pharmacoMarkers, null, 2)}
      
      Provide a comprehensive drug safety report in JSON format:
      {
        "overall_safety_score": 0-100,
        "critical_warnings": [
          {
            "drug_class": "string",
            "specific_drugs": ["array"],
            "genetic_marker": "string",
            "risk_level": "critical|high|moderate|low",
            "recommendation": "string",
            "rationale": "string"
          }
        ],
        "moderate_sensitivities": [],
        "safe_alternatives": [
          {
            "instead_of": "string",
            "use": "string",
            "rationale": "string"
          }
        ],
        ${
          medicationName
            ? `
        "specific_medication_analysis": {
          "medication": "${medicationName}",
          "safety_rating": "safe|caution|avoid",
          "genetic_factors": ["array"],
          "dosing_recommendations": "string",
          "monitoring_required": "string"
        },
        `
            : ""
        }
        "anesthesia_considerations": {
          "pre_op_testing": ["array"],
          "safe_protocols": ["array"],
          "drugs_to_avoid": ["array"]
        },
        "pain_management": {
          "preferred_options": ["array"],
          "avoid": ["array"],
          "effectiveness_notes": "string"
        },
        "emergency_medications": {
          "safe": ["array"],
          "use_with_caution": ["array"],
          "contraindicated": ["array"]
        },
        "preventive_care": {
          "flea_tick_safe": ["array"],
          "flea_tick_avoid": ["array"],
          "heartworm_safe": ["array"],
          "heartworm_avoid": ["array"]
        }
      }
      
      CRITICAL: Base all recommendations on the genetic markers detected. If MDR1 mutation is present, list all contraindicated drugs. Provide veterinarian-actionable guidance.
    `;

    const drugSafetyReport = await callOpenRouter(prompt, "ULTRA", true);
    const parsedReport = JSON.parse(drugSafetyReport);

    // 4. Store medication safety analysis
    await sql`
      INSERT INTO usage_tracking (event_type, user_id, metadata)
      VALUES ('pharmacogenomics_check', 'system', ${JSON.stringify({
        report_id: reportId,
        species: species,
        medication: medicationName,
        timestamp: new Date().toISOString(),
      })})
    `;

    return Response.json({
      success: true,
      drug_safety_report: parsedReport,
      species: report.species,
      breed: report.breed_hint,
      analysis_date: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Pharmacogenomics error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// GET: Retrieve pharmacogenomics reference data
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const species = searchParams.get("species") || "both";

  if (species === "both") {
    return Response.json({
      cat: PET_PHARMACOGENOMICS.cat,
      dog: PET_PHARMACOGENOMICS.dog,
      note: "Always consult with a veterinarian before administering medications",
    });
  }

  return Response.json({
    species,
    markers: PET_PHARMACOGENOMICS[species.toLowerCase()] || {},
    note: "Always consult with a veterinarian before administering medications",
  });
}
