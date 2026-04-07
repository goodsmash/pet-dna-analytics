// Environmental Risk Assessment
// Analyzes how location, climate, and environment interact with pet genetics
// Identifies region-specific health risks and protective recommendations

import sql from "@/app/api/utils/sql";
import { callOpenRouter } from "@/app/api/utils/openrouter-models";

export async function POST(request) {
  try {
    const { reportId, location, climate, livingEnvironment, localHazards } =
      await request.json();

    if (!reportId) {
      return Response.json({ error: "Missing reportId" }, { status: 400 });
    }

    // 1. Get DNA report
    const [report] = await sql`
      SELECT dr.*, p.name, p.species, p.breed_hint
      FROM dna_reports dr
      JOIN pets p ON dr.pet_id = p.id
      WHERE dr.id = ${reportId}
    `;

    if (!report) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    const analysis = report.analysis_json;

    // 2. Extract environment-relevant genetic markers
    const geneticFactors = {
      health_predispositions: analysis.health_predispositions || [],
      coat_genetics: analysis.coat_genetics || {},
      size_predictions: analysis.size_predictions || {},
      temperature_tolerance:
        analysis.physical_traits?.temperature_regulation || {},
      respiratory_genetics:
        analysis.health_predispositions?.filter(
          (h) =>
            h.toLowerCase().includes("respiratory") ||
            h.toLowerCase().includes("breathing"),
        ) || [],
      skin_sensitivity:
        analysis.health_predispositions?.filter(
          (h) =>
            h.toLowerCase().includes("skin") ||
            h.toLowerCase().includes("allergy"),
        ) || [],
      breed_composition: analysis.breed_composition || {},
    };

    // 3. Generate environmental risk assessment
    const prompt = `
      Analyze environmental health risks for ${report.name}, a ${report.species} (${report.breed_hint || "mixed"}).
      
      LOCATION & ENVIRONMENT:
      Location: ${location || "Not specified"}
      Climate: ${climate || "Not specified"}
      Living Environment: ${livingEnvironment || "Not specified (urban/suburban/rural)"}
      Local Hazards: ${localHazards || "Not specified"}
      
      GENETIC FACTORS:
      ${JSON.stringify(geneticFactors, null, 2)}
      
      Generate comprehensive environmental risk assessment in JSON format:
      {
        "overall_environmental_compatibility": {
          "score": 0-100,
          "rating": "excellent|good|fair|poor",
          "summary": "string"
        },
        "climate_compatibility": {
          "heat_tolerance": {
            "genetic_predisposition": "excellent|good|moderate|poor",
            "coat_type_factor": "double_coat|single_coat|hairless",
            "breed_considerations": ["array"],
            "risk_level": "low|moderate|high",
            "recommendations": [
              "Provide AC during summer months",
              "Limit outdoor activity during peak heat",
              "Ensure constant access to fresh water"
            ]
          },
          "cold_tolerance": {
            "genetic_predisposition": "excellent|good|moderate|poor",
            "coat_insulation": "excellent|good|moderate|poor",
            "body_size_factor": "advantageous|neutral|disadvantageous",
            "risk_level": "low|moderate|high",
            "recommendations": ["array"]
          },
          "humidity_sensitivity": {
            "brachycephalic_risk": "high|moderate|low|none",
            "respiratory_concerns": ["array"],
            "recommendations": ["array"]
          },
          "altitude_considerations": {
            "respiratory_genetics": "favorable|neutral|concerning",
            "cardiovascular_health": "string",
            "acclimatization_needs": ["array"]
          }
        },
        "regional_disease_risks": {
          "vector_borne_diseases": [
            {
              "disease": "Heartworm|Lyme|Ehrlichiosis|Anaplasmosis",
              "regional_prevalence": "high|moderate|low",
              "genetic_susceptibility": "increased|normal|reduced",
              "prevention_strategy": "string",
              "testing_frequency": "monthly|seasonal|annual"
            }
          ],
          "fungal_infections": [
            {
              "type": "Valley Fever|Blastomycosis|Histoplasmosis",
              "regional_risk": "endemic|moderate|low",
              "genetic_factors": ["array"],
              "prevention": "string"
            }
          ],
          "parasites": {
            "flea_tick_pressure": "year_round|seasonal|low",
            "genetic_skin_sensitivity": "high|moderate|low",
            "prevention_protocol": "string"
          }
        },
        "environmental_allergens": {
          "pollen_allergies": {
            "genetic_predisposition": "high|moderate|low",
            "local_allergens": ["ragweed", "grass", "tree pollen"],
            "peak_seasons": ["spring", "fall"],
            "management": ["array"]
          },
          "mold_sensitivity": {
            "risk_factors": ["humid climate", "genetic predisposition"],
            "prevention": ["array"]
          },
          "contact_allergens": {
            "grass_types": ["array"],
            "plants_to_avoid": ["array"],
            "genetic_sensitivity": "high|moderate|low"
          }
        },
        "urban_vs_rural_considerations": {
          "air_quality": {
            "pollution_sensitivity": "high|moderate|low",
            "respiratory_genetics": "predisposed|normal|resilient",
            "recommendations": ["array"]
          },
          "noise_sensitivity": {
            "genetic_temperament": "sensitive|moderate|tolerant",
            "urban_stress_factors": ["array"],
            "mitigation": ["array"]
          },
          "exercise_needs": {
            "space_requirements": "large_yard|moderate|apartment_ok",
            "genetic_energy_level": "high|moderate|low",
            "breed_considerations": ["array"]
          }
        },
        "toxic_plant_risks": {
          "common_in_region": ["array"],
          "genetic_curiosity_level": "high|moderate|low",
          "prevention": ["array"]
        },
        "wildlife_interactions": {
          "predator_risks": ["coyotes", "hawks", "snakes"],
          "size_vulnerability": "high|moderate|low",
          "protective_measures": ["array"],
          "genetic_prey_drive": "high|moderate|low",
          "wildlife_conflict_prevention": ["array"]
        },
        "water_safety": {
          "swimming_ability": "natural|moderate|poor",
          "coat_water_resistance": "excellent|good|poor",
          "local_water_hazards": ["ocean", "lakes", "pools"],
          "safety_recommendations": ["array"]
        },
        "seasonal_recommendations": {
          "spring": {
            "health_concerns": ["allergy flare-ups", "parasites"],
            "activities": ["array"],
            "precautions": ["array"]
          },
          "summer": {
            "heat_management": ["array"],
            "activity_modifications": ["array"],
            "hydration_focus": "critical|important|normal"
          },
          "fall": {
            "considerations": ["array"]
          },
          "winter": {
            "cold_protection": ["array"],
            "ice_salt_paw_care": "critical|important|minimal",
            "indoor_exercise": ["array"]
          }
        },
        "emergency_preparedness": {
          "natural_disasters_in_region": ["earthquakes", "hurricanes", "wildfires"],
          "evacuation_plan_needs": ["array"],
          "genetic_stress_resilience": "high|moderate|low",
          "emergency_supplies": ["array"]
        },
        "lifestyle_optimization": {
          "best_times_for_outdoor_activity": {
            "daily": "early_morning|evening|flexible",
            "seasonal_variations": "string"
          },
          "ideal_indoor_environment": {
            "temperature_range": "degrees",
            "humidity_range": "percentage",
            "air_filtration": "recommended|optional"
          },
          "exercise_recommendations": {
            "daily_duration": "minutes",
            "intensity": "high|moderate|low",
            "environment_specific_activities": ["array"]
          }
        },
        "preventive_care_schedule": {
          "environment_specific_vaccinations": [
            {
              "vaccine": "string",
              "frequency": "annual|3year|as_needed",
              "regional_importance": "critical|recommended|optional"
            }
          ],
          "parasite_prevention": {
            "heartworm": "monthly year-round|seasonal",
            "flea_tick": "monthly year-round|seasonal",
            "products_recommended": ["array"]
          },
          "health_screenings": [
            {
              "test": "string",
              "frequency": "annual|bi-annual",
              "rationale": "environmental risk + genetic predisposition"
            }
          ]
        },
        "relocation_considerations": {
          "if_moving_to_different_climate": {
            "acclimatization_period": "weeks/months",
            "health_monitoring": ["array"],
            "environmental_modifications": ["array"]
          },
          "better_climates_for_this_genetics": ["array"],
          "climates_to_avoid": ["array"]
        }
      }
      
      CRITICAL: Combine genetic predispositions with environmental factors. Provide specific, actionable recommendations. Consider both immediate and long-term health impacts. Base advice on veterinary science and regional disease data.
    `;

    const environmentalAnalysis = await callOpenRouter(prompt, "ULTRA", true);
    const parsedAnalysis = JSON.parse(environmentalAnalysis);

    // 4. Store environmental assessment
    await sql`
      INSERT INTO usage_tracking (event_type, user_id, metadata)
      VALUES ('environmental_assessment', 'system', ${JSON.stringify({
        report_id: reportId,
        location: location,
        climate: climate,
        timestamp: new Date().toISOString(),
      })})
    `;

    return Response.json({
      success: true,
      environmental_risk_assessment: parsedAnalysis,
      pet_info: {
        name: report.name,
        species: report.species,
        breed: report.breed_hint,
      },
      location_info: {
        location,
        climate,
        environment: livingEnvironment,
      },
      generated_at: new Date().toISOString(),
      disclaimer:
        "Environmental recommendations should be combined with veterinary advice. Local conditions vary - consult local veterinarians for region-specific guidance.",
    });
  } catch (error) {
    console.error("Environmental assessment error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
