// Personalized Dietary Recommendations Based on Genetics
// Analyzes metabolic markers, allergies, and nutritional needs

import sql from "@/app/api/utils/sql";
import { callOpenRouter } from "@/app/api/utils/openrouter-models";

export async function POST(request) {
  try {
    const { reportId, currentDiet, healthGoals } = await request.json();

    if (!reportId) {
      return Response.json({ error: "Missing reportId" }, { status: 400 });
    }

    // 1. Get DNA report
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

    // 2. Extract nutrition-relevant markers
    const nutritionMarkers = {
      metabolism: analysis.nutrient_metabolism || {},
      size_genetics: analysis.size_predictions || {},
      health_risks: analysis.health_predispositions || [],
      activity_level: analysis.exercise_needs || {},
      aging_markers: analysis.aging_markers || {},
      breed_composition: analysis.breed_composition || {},
    };

    // 3. Generate personalized dietary plan
    const prompt = `
      Create a personalized nutrition plan for ${report.name}, a ${report.species} (${report.breed_hint || "mixed breed"}).
      
      GENETIC NUTRITION MARKERS:
      ${JSON.stringify(nutritionMarkers, null, 2)}
      
      ${currentDiet ? `Current Diet: ${currentDiet}` : ""}
      ${healthGoals ? `Health Goals: ${healthGoals}` : ""}
      
      Generate a comprehensive nutrition plan in JSON format:
      {
        "optimal_macros": {
          "protein_percentage": "25-35%",
          "fat_percentage": "15-25%",
          "carb_percentage": "30-50%",
          "rationale": "Based on genetic metabolism markers"
        },
        "recommended_ingredients": {
          "protein_sources": ["chicken", "turkey", "fish"],
          "healthy_fats": ["omega-3 rich fish oil", "flaxseed"],
          "carb_sources": ["sweet potato", "brown rice"],
          "supplements": ["glucosamine", "probiotics"],
          "rationale_for_each": {}
        },
        "ingredients_to_avoid": [
          {
            "ingredient": "string",
            "reason": "genetic sensitivity / breed predisposition",
            "alternatives": ["array"]
          }
        ],
        "meal_frequency": {
          "meals_per_day": 2,
          "rationale": "Based on size and metabolism"
        },
        "caloric_needs": {
          "daily_calories": "estimated range",
          "factors": ["age", "activity", "metabolism genetics"],
          "adjustment_notes": "Adjust based on body condition"
        },
        "breed_specific_needs": {
          "considerations": ["array"],
          "genetic_factors": ["array"]
        },
        "age_appropriate_nutrition": {
          "current_life_stage": "puppy/adult/senior",
          "special_needs": ["array"],
          "longevity_optimization": ["array"]
        },
        "condition_specific_nutrition": [
          {
            "condition": "from genetic health risks",
            "dietary_management": "string",
            "nutrients_to_emphasize": ["array"],
            "nutrients_to_limit": ["array"]
          }
        ],
        "weight_management": {
          "ideal_body_condition": "string",
          "genetic_factors": ["array"],
          "tips": ["array"]
        },
        "hydration_needs": {
          "daily_water": "ml per kg body weight",
          "considerations": ["array"]
        },
        "treat_guidelines": {
          "max_daily_calories_from_treats": "10%",
          "safe_treats": ["array"],
          "treats_to_avoid": ["array"]
        },
        "commercial_diet_recommendations": [
          {
            "diet_type": "dry/wet/raw/home-cooked",
            "why_suitable": "based on genetics",
            "brands_to_consider": ["array"],
            "ingredients_to_look_for": ["array"]
          }
        ],
        "monitoring_schedule": {
          "weight_checks": "weekly/monthly",
          "body_condition_score": "monthly",
          "bloodwork_recommendations": "annually/bi-annually"
        }
      }
      
      CRITICAL: Base all recommendations on the genetic markers. Consider breed-specific dietary needs, metabolic tendencies, and health risk factors. Provide actionable, science-based guidance.
    `;

    const dietaryPlan = await callOpenRouter(prompt, "PRO", true);
    const parsedPlan = JSON.parse(dietaryPlan);

    // 4. Track usage
    await sql`
      INSERT INTO usage_tracking (event_type, user_id, metadata)
      VALUES ('dietary_plan_generated', 'system', ${JSON.stringify({
        report_id: reportId,
        species: report.species,
        timestamp: new Date().toISOString(),
      })})
    `;

    return Response.json({
      success: true,
      dietary_plan: parsedPlan,
      pet_name: report.name,
      species: report.species,
      breed: report.breed_hint,
      generated_at: new Date().toISOString(),
      disclaimer:
        "Always consult with a veterinarian before making significant dietary changes",
    });
  } catch (error) {
    console.error("Dietary recommendations error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
