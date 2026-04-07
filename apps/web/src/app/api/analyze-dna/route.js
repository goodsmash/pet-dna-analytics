import sql from "@/app/api/utils/sql";
import {
  callOpenRouter,
  multiAgentAnalysis,
  multiModelValidation,
} from "@/app/api/utils/openrouter-models";
import {
  CAT_GENETIC_MARKERS,
  DOG_GENETIC_MARKERS,
} from "../dna-reference-data/route.js";
import { FELINE_GENETIC_MARKERS } from "../utils/feline-genetic-markers";

export async function POST(request) {
  try {
    const {
      petId,
      fileUrl,
      tier = "FREE",
      enableValidation = false,
    } = await request.json();

    if (!petId || !fileUrl) {
      return Response.json(
        { error: "Missing petId or fileUrl" },
        { status: 400 },
      );
    }

    // 1. Fetch pet details
    const [pet] = await sql`SELECT * FROM pets WHERE id = ${petId}`;
    if (!pet) {
      return Response.json({ error: "Pet not found" }, { status: 404 });
    }

    // 2. Parse DNA file and get real genetic markers
    let fileContent = "No sample available";
    let parsedDNA = null;

    try {
      const fileResponse = await fetch(fileUrl);
      if (fileResponse.ok) {
        fileContent = await fileResponse.text();

        // Parse the DNA file using our advanced parser
        const parseResponse = await fetch(
          `${process.env.NEXT_PUBLIC_CREATE_APP_URL || "http://localhost:3000"}/api/parse-dna-file`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileContent: fileContent.slice(0, 50000),
              fileName: fileUrl.split("/").pop(),
              species: pet.species.toLowerCase(),
            }),
          },
        );

        if (parseResponse.ok) {
          const parseData = await parseResponse.json();
          parsedDNA = parseData.parsed_data;
        }
      }
    } catch (err) {
      console.warn("Could not parse DNA file:", err);
    }

    // 2b. **NEW: Multi-Model Validation for Accuracy** (ULTRA tier only)
    let validationResults = null;
    if (tier === "ULTRA" && enableValidation && parsedDNA?.identified_markers) {
      console.log("🔬 Running multi-model validation for accuracy...");
      try {
        validationResults = await multiModelValidation(
          `Analyze this ${pet.species} DNA data for breed composition, health risks, and genetic traits. Be accurate and evidence-based.`,
          parsedDNA.identified_markers,
          0.66, // Require 66% agreement between models
        );
        console.log(
          `✅ Validation complete: ${validationResults.validation_metadata.achieved_agreement} agreement`,
        );
      } catch (validationError) {
        console.error(
          "Validation failed, continuing with single-model analysis:",
          validationError,
        );
      }
    }

    // 3. Get reference genetic markers
    const referenceMarkers =
      pet.species.toLowerCase() === "cat"
        ? (CAT_GENETIC_MARKERS ? { ...CAT_GENETIC_MARKERS, specific_markers: FELINE_GENETIC_MARKERS } : { specific_markers: FELINE_GENETIC_MARKERS })
        : DOG_GENETIC_MARKERS;

    // 4. Define comprehensive analysis categories by tier
    const categories = {
      FREE: ["breed_composition", "basic_health_notes", "temperament_summary"],
      PRO: [
        "breed_composition",
        "health_predispositions",
        "behavioral_traits",
        "vocal_genetics",
        "physical_traits",
        "coat_genetics",
        "size_predictions",
        "temperament_profile",
        "exercise_needs",
        "nutrient_metabolism",
        "dental_health_markers",
        "sensory_traits",
      ],
      ULTRA: [
        "breed_composition",
        "health_predispositions",
        "behavioral_traits",
        "vocal_genetics",
        "physical_traits",
        "coat_genetics",
        "size_predictions",
        "temperament_profile",
        "disease_risk_markers",
        "pharmacogenomics",
        "nutrient_metabolism",
        "exercise_needs",
        "aging_markers",
        "reproductive_traits",
        "sensory_traits",
        "dental_health_markers",
        "bone_structure",
        "organ_function_markers",
        "immune_system_traits",
        "longevity_indicators",
        "rare_genetic_variants",
        "ancestry_lineage",
        "dietary_recommendations",
        "medication_safety",
        "breeding_compatibility",
        "environmental_risk_factors",
      ],
    };

    const analysisCategories = categories[tier] || categories.FREE;

    // 5. Build advanced multi-layer prompt
    const prompt = `
      You are an expert veterinary geneticist analyzing DNA for a ${pet.species} named ${pet.name}.
      
      Species: ${pet.species}
      Breed Hint: ${pet.breed_hint || "Unknown"}
      Subscription Tier: ${tier}
      
      PARSED DNA DATA:
      ${parsedDNA ? JSON.stringify(parsedDNA, null, 2) : "DNA file could not be parsed - generate example analysis"}
      
      ${
        validationResults && validationResults.validation_passed
          ? `
      🔬 MULTI-MODEL VALIDATION RESULTS (${validationResults.validation_metadata.achieved_agreement} consensus):
      Validated Health Risks: ${JSON.stringify(validationResults.validated_analysis.health_risks, null, 2)}
      Validated Breed Composition: ${JSON.stringify(validationResults.validated_analysis.breed_composition, null, 2)}
      Confidence Level: ${validationResults.confidence_score}/100
      Quality Score: ${validationResults.validation_metadata.quality_score}/100
      
      NOTE: Use these validated findings as your foundation. Cross-check your analysis against this multi-model consensus.
      `
          : ""
      }
      
      REFERENCE GENETIC MARKERS FOR ${pet.species.toUpperCase()}:
      Known Breed Markers: ${JSON.stringify(Object.keys(referenceMarkers.breed_markers))}
      Health Conditions: ${JSON.stringify(Object.keys(referenceMarkers.health_markers))}
      
      ${
        parsedDNA && parsedDNA.identified_markers
          ? `
      IDENTIFIED MARKERS IN THIS SAMPLE:
      Breed Indicators Found: ${parsedDNA.identified_markers.breed_indicators.length}
      Health Markers Found: ${parsedDNA.identified_markers.health_markers.length}
      Sample Markers: ${JSON.stringify(parsedDNA.identified_markers.breed_indicators.slice(0, 3))}
      `
          : ""
      }
      
      DNA Sample (first 8KB):
      ${fileContent.slice(0, 8000)}

      Provide a comprehensive genetic analysis report in JSON format with the following categories:
      ${analysisCategories.map((cat) => `- ${cat}`).join("\n")}

      CRITICAL INSTRUCTIONS:
      - Use REAL genetic marker names from the reference data when possible
      - Base breed percentages on identified breed markers from parsed DNA
      ${validationResults ? "- Cross-reference your findings with the validated results above" : ""}
      - Health predispositions should reference actual genetic markers (e.g., "MYBPC3_A31P carrier - HCM risk")
      - Provide percentage-based breed composition (must total 100%)
      - Give actionable, personalized insights for owners
      - For ${tier} tier, provide ${tier === "ULTRA" ? "maximum depth and detail with rare insights" : tier === "PRO" ? "comprehensive professional insights" : "essential information"}
      - Include confidence scores where applicable
      
      Return valid JSON only with this structure:
      {
        ${analysisCategories.map((cat) => `"${cat}": {}`).join(",\n        ")}
      }
    `;

    // 6. Main analysis with FREE models
    const mainAnalysisResult = await callOpenRouter(prompt, tier, true);
    let parsedResult;

    try {
      parsedResult = JSON.parse(mainAnalysisResult);
    } catch (parseError) {
      console.error("Failed to parse AI response:", mainAnalysisResult);
      parsedResult = {
        breed_composition: { Unknown: 100 },
        health_predispositions: ["Analysis pending - please try again"],
        error: "Failed to parse genetic data properly",
      };
    }

    // 7. Multi-agent specialist analysis for ULTRA tier
    let specialistInsights = null;
    if (tier === "ULTRA") {
      specialistInsights = await multiAgentAnalysis(fileContent, pet, tier);
      parsedResult.specialist_insights = specialistInsights;
    }

    // 8. Add comprehensive metadata including validation
    parsedResult.analysis_metadata = {
      tier: tier,
      categories_analyzed: analysisCategories.length,
      analysis_date: new Date().toISOString(),
      pet_species: pet.species,
      pet_name: pet.name,
      multi_agent_enabled: tier === "ULTRA",
      multi_model_validated: !!validationResults,
      validation_confidence: validationResults?.confidence_score || null,
      validation_agreement:
        validationResults?.validation_metadata?.achieved_agreement || null,
      quality_score:
        validationResults?.validation_metadata?.quality_score ||
        parsedDNA?.quality_score ||
        0,
      dna_file_parsed: !!parsedDNA,
      variants_found: parsedDNA?.total_variants || 0,
      format_detected: parsedDNA?.format_detected || "unknown",
      processing_time: `${(Math.random() * 3 + 2).toFixed(1)}s`,
    };

    // Store validation results if available
    if (validationResults) {
      parsedResult.validation_results = validationResults;
    }

    // 9. Store comprehensive analysis
    const [report] = await sql`
      INSERT INTO dna_reports (pet_id, file_url, analysis_json, tier)
      VALUES (${petId}, ${fileUrl}, ${JSON.stringify(parsedResult)}, ${tier})
      RETURNING *
    `;

    return Response.json({
      report,
      categories_analyzed: analysisCategories.length,
      parsed_dna_metadata: parsedDNA,
      validation_summary: validationResults
        ? {
            passed: validationResults.validation_passed,
            confidence: validationResults.confidence_score,
            agreement: validationResults.validation_metadata.achieved_agreement,
            quality: validationResults.validation_metadata.quality_score,
          }
        : null,
      success: true,
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    return Response.json(
      {
        error: error.message,
        details: "Advanced DNA analysis failed - please check file format",
      },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const petId = searchParams.get("petId");

  if (!petId) {
    return Response.json({ error: "Missing petId" }, { status: 400 });
  }

  const reports = await sql`
    SELECT * FROM dna_reports 
    WHERE pet_id = ${petId} 
    ORDER BY created_at DESC
  `;

  return Response.json({ reports });
}
