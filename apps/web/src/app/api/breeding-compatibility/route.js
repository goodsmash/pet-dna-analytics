// Breeding Compatibility Analysis
// Analyzes genetic compatibility between two pets for breeding purposes
// Predicts offspring traits and identifies genetic health risks

import sql from "@/app/api/utils/sql";
import { callOpenRouter } from "@/app/api/utils/openrouter-models";

export async function POST(request) {
  try {
    const { petId1, petId2, breedingGoals } = await request.json();

    if (!petId1 || !petId2) {
      return Response.json(
        { error: "Missing petId1 or petId2" },
        { status: 400 },
      );
    }

    // 1. Get DNA reports for both pets
    const [report1] = await sql`
      SELECT dr.*, p.name, p.species, p.breed_hint
      FROM dna_reports dr
      JOIN pets p ON dr.pet_id = p.id
      WHERE dr.pet_id = ${petId1}
      ORDER BY dr.created_at DESC
      LIMIT 1
    `;

    const [report2] = await sql`
      SELECT dr.*, p.name, p.species, p.breed_hint
      FROM dna_reports dr
      JOIN pets p ON dr.pet_id = p.id
      WHERE dr.pet_id = ${petId2}
      ORDER BY dr.created_at DESC
      LIMIT 1
    `;

    if (!report1 || !report2) {
      return Response.json(
        { error: "DNA reports not found for one or both pets" },
        { status: 404 },
      );
    }

    // 2. Verify same species
    if (report1.species !== report2.species) {
      return Response.json(
        {
          error:
            "Cannot analyze breeding compatibility between different species",
        },
        { status: 400 },
      );
    }

    // 3. Extract genetic data
    const parent1Genetics = {
      name: report1.name,
      breed_composition: report1.analysis_json.breed_composition,
      health_risks: report1.analysis_json.health_predispositions,
      coat_genetics: report1.analysis_json.coat_genetics,
      size_predictions: report1.analysis_json.size_predictions,
      temperament: report1.analysis_json.temperament_profile,
      behavioral_traits: report1.analysis_json.behavioral_traits,
    };

    const parent2Genetics = {
      name: report2.name,
      breed_composition: report2.analysis_json.breed_composition,
      health_risks: report2.analysis_json.health_predispositions,
      coat_genetics: report2.analysis_json.coat_genetics,
      size_predictions: report2.analysis_json.size_predictions,
      temperament: report2.analysis_json.temperament_profile,
      behavioral_traits: report2.analysis_json.behavioral_traits,
    };

    // 4. Generate comprehensive breeding analysis
    const prompt = `
      Analyze breeding compatibility and predict offspring characteristics for ${report1.species} breeding pair.
      
      PARENT 1: ${report1.name} (${report1.breed_hint || "mixed"})
      ${JSON.stringify(parent1Genetics, null, 2)}
      
      PARENT 2: ${report2.name} (${report2.breed_hint || "mixed"})
      ${JSON.stringify(parent2Genetics, null, 2)}
      
      ${breedingGoals ? `BREEDING GOALS: ${breedingGoals}` : ""}
      
      Generate comprehensive breeding compatibility analysis in JSON format:
      {
        "compatibility_score": {
          "overall": 0-100,
          "genetic_diversity": 0-100,
          "health_outlook": 0-100,
          "temperament_match": 0-100,
          "recommendation": "highly_recommended|recommended|acceptable|not_recommended|strongly_discouraged"
        },
        "offspring_predictions": {
          "breed_composition": {
            "most_likely": {
              "Primary_Breed": "percentage",
              "Secondary_Breed": "percentage"
            },
            "range_of_possibilities": ["array of possible combinations"],
            "hybrid_vigor_likelihood": "high|moderate|low"
          },
          "physical_traits": {
            "size": {
              "predicted_weight_range": "kg",
              "predicted_height_range": "cm",
              "confidence": "high|moderate|low"
            },
            "coat": {
              "color_possibilities": ["array"],
              "pattern_possibilities": ["array"],
              "texture_prediction": "string",
              "shedding_level": "heavy|moderate|light"
            },
            "features": {
              "ear_type": "string",
              "tail_type": "string",
              "body_type": "string"
            }
          },
          "temperament": {
            "predicted_traits": ["array"],
            "energy_level": "high|moderate|low",
            "trainability": "excellent|good|moderate|challenging",
            "social_tendencies": "string",
            "confidence": "high|moderate|low"
          },
          "behavioral_tendencies": {
            "prey_drive": "high|moderate|low",
            "vocalization": "high|moderate|low",
            "independence": "high|moderate|low",
            "protective_instinct": "high|moderate|low"
          }
        },
        "genetic_health_analysis": {
          "coefficient_of_inbreeding": "estimated percentage",
          "genetic_diversity_score": 0-100,
          "inherited_health_risks": [
            {
              "condition": "string",
              "probability": "high|moderate|low",
              "parent1_status": "carrier|clear|affected",
              "parent2_status": "carrier|clear|affected",
              "mendelian_inheritance": "dominant|recessive|x-linked|polygenic",
              "preventive_measures": ["array"]
            }
          ],
          "protective_genetic_factors": [
            {
              "trait": "string",
              "benefit": "string",
              "inheritance_likelihood": "percentage"
            }
          ],
          "recommended_health_screenings": [
            {
              "test": "string",
              "timing": "pre-breeding|during_pregnancy|for_puppies",
              "importance": "critical|recommended|optional"
            }
          ]
        },
        "breeding_recommendations": {
          "optimal_breeding_age": {
            "parent1": "age range",
            "parent2": "age range",
            "rationale": "string"
          },
          "pre_breeding_health_checks": ["array"],
          "genetic_counseling_notes": ["array"],
          "expected_litter_size": "range based on breed genetics",
          "special_considerations": ["array"]
        },
        "risk_assessment": {
          "genetic_risks": [
            {
              "risk": "string",
              "severity": "high|moderate|low",
              "mitigation": "string"
            }
          ],
          "breeding_complications": {
            "whelping_difficulties": "high|moderate|low risk",
            "c_section_likelihood": "percentage",
            "factors": ["array"]
          },
          "ethical_considerations": ["array"]
        },
        "puppy_care_predictions": {
          "anticipated_care_needs": ["array"],
          "early_socialization_priorities": ["array"],
          "health_monitoring_schedule": ["array"],
          "genetic_test_recommendations": ["array"]
        },
        "market_considerations": {
          "breed_demand": "high|moderate|low",
          "unique_selling_points": ["array"],
          "potential_challenges": ["array"]
        },
        "genetic_testing_recommendations": {
          "before_breeding": ["array"],
          "during_pregnancy": ["array"],
          "for_offspring": ["array"]
        },
        "alternative_pairings": [
          {
            "suggestion": "string",
            "rationale": "would improve genetic diversity / reduce health risks",
            "expected_benefits": ["array"]
          }
        ],
        "veterinary_consultation_notes": {
          "discuss_with_vet": ["array"],
          "specialist_referrals": ["reproductive specialist", "genetic counselor"],
          "timeline": "string"
        }
      }
      
      CRITICAL: Provide HONEST, ETHICAL breeding guidance. If the pairing has significant health risks, clearly state this. Prioritize offspring welfare. Include genetic diversity considerations. Base all predictions on Mendelian genetics and breed characteristics.
    `;

    const breedingAnalysis = await callOpenRouter(prompt, "ULTRA", true);
    const parsedAnalysis = JSON.parse(breedingAnalysis);

    // 5. Store breeding compatibility analysis
    await sql`
      INSERT INTO usage_tracking (event_type, user_id, metadata)
      VALUES ('breeding_compatibility', 'system', ${JSON.stringify({
        pet_id_1: petId1,
        pet_id_2: petId2,
        species: report1.species,
        compatibility_score: parsedAnalysis.compatibility_score?.overall,
        timestamp: new Date().toISOString(),
      })})
    `;

    return Response.json({
      success: true,
      breeding_analysis: parsedAnalysis,
      parent_info: {
        parent1: {
          name: report1.name,
          breed: report1.breed_hint,
          species: report1.species,
        },
        parent2: {
          name: report2.name,
          breed: report2.breed_hint,
          species: report2.species,
        },
      },
      generated_at: new Date().toISOString(),
      disclaimer:
        "This analysis is for informational purposes only. Always consult with a veterinarian and consider ethical breeding practices. Prioritize the health and welfare of both parents and potential offspring.",
    });
  } catch (error) {
    console.error("Breeding compatibility error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
