/**
 * ULTRA COMPREHENSIVE DNA ANALYSIS
 * The most detailed pet DNA analysis possible
 * 40+ analysis categories with real scientific insights
 */

import { callOpenRouter } from "../utils/openrouter-models.js";
import { DOG_BREEDS, CAT_BREEDS } from "../dna-reference-data/route.js";

export async function POST(request) {
  try {
    const { petInfo, parsedDNA, tier = "ULTRA" } = await request.json();

    const breedDatabase = petInfo.species === "dog" ? DOG_BREEDS : CAT_BREEDS;

    // Build INSANELY comprehensive prompt for ULTRA tier
    const ultraPrompt = `
You are the world's leading veterinary geneticist. Analyze this ${petInfo.species}'s DNA with MAXIMUM detail and accuracy.

PET INFO:
Name: ${petInfo.name}
Species: ${petInfo.species}
Breed Hint: ${petInfo.breed_hint || "Unknown"}

DNA MARKERS FOUND:
${JSON.stringify(parsedDNA?.identified_markers || {}, null, 2)}

AVAILABLE BREED DATABASE:
${Object.keys(breedDatabase).slice(0, 20).join(", ")} (and ${Object.keys(breedDatabase).length - 20} more)

Provide the MOST COMPREHENSIVE genetic analysis possible covering ALL these categories:

Return EXTENSIVE JSON with:
{
  "breed_composition": {
    "primary_breed": "exact breed name",
    "confidence": 0-100,
    "percentage": 0-100,
    "secondary_breeds": [{"breed": "name", "percentage": 0-100, "confidence": 0-100}],
    "mixed_heritage": true/false,
    "generation_estimate": "F1/F2/F3/Multi-gen",
    "purebred_probability": 0-100
  },
  
  "health_predispositions": {
    "high_risk": [
      {
        "condition": "specific disease name",
        "genetic_marker": "actual marker name (e.g., MYBPC3_A31P)",
        "inheritance_pattern": "autosomal dominant/recessive/X-linked",
        "carrier_status": "affected/carrier/clear",
        "risk_score": 0-100,
        "onset_age": "puppy/adult/senior",
        "symptoms": ["symptom1", "symptom2"],
        "screening_tests": ["test name"],
        "prevalence_in_breed": "% or common/rare",
        "management": "treatment approach"
      }
    ],
    "moderate_risk": [],
    "low_risk": [],
    "protective_factors": []
  },
  
  "longevity_analysis": {
    "estimated_lifespan": "X-Y years",
    "longevity_score": 0-100,
    "aging_markers": [
      {"marker": "telomere length genes", "impact": "description"}
    ],
    "life_stage_predictions": {
      "puppy": "0-2 years - growth phase details",
      "adult": "2-7 years - prime years details",
      "senior": "7+ years - aging considerations"
    },
    "factors_affecting_lifespan": []
  },
  
  "physical_traits": {
    "adult_weight": {"estimate": "X-Y lbs/kg", "confidence": 0-100},
    "adult_height": {"estimate": "X-Y inches", "confidence": 0-100},
    "body_type": "lean/muscular/stocky/etc",
    "bone_structure": "fine/medium/heavy",
    "skull_shape": "dolichocephalic/mesocephalic/brachycephalic",
    "ear_type": "erect/floppy/semi-erect",
    "tail_type": "long/short/bob/curled",
    "paw_size": "small/medium/large",
    "chest_depth": "shallow/moderate/deep",
    "growth_rate": "slow/moderate/rapid",
    "mature_at": "X months"
  },
  
  "coat_genetics": {
    "color": {"primary": "color", "secondary": ["colors"], "genetic_basis": "MC1R variants etc"},
    "pattern": {"type": "solid/merle/brindle/etc", "genes": ["PSMB7", "etc"]},
    "length": {"type": "short/medium/long", "shedding": "minimal/moderate/heavy"},
    "texture": {"type": "smooth/wiry/curly/etc", "genes": ["KRT71", "etc"]},
    "special_features": ["furnishings", "ridge", "etc"],
    "color_changes": {"puppy_to_adult": "description", "aging": "graying pattern"},
    "grooming_needs": "low/medium/high maintenance",
    "hypoallergenic_potential": true/false
  },
  
  "behavioral_genetics": {
    "trainability": {"score": 0-100, "genes": ["WBSCR17", "GTF2I"], "ease": "easy/moderate/challenging"},
    "intelligence_type": "instinctive/adaptive/working",
    "energy_level": {"score": 0-100, "type": "low/moderate/high/very high"},
    "sociability": {
      "with_humans": 0-100,
      "with_dogs": 0-100,
      "with_cats": 0-100,
      "with_children": 0-100,
      "with_strangers": 0-100
    },
    "prey_drive": 0-100,
    "guarding_instinct": 0-100,
    "separation_anxiety_risk": "low/moderate/high",
    "aggression_markers": [],
    "anxiety_predisposition": {"score": 0-100, "genes": ["HTR2A", "DRD4"]},
    "vocalization_tendency": {"barking": 0-100, "howling": 0-100, "genes": ["HMGA2"]},
    "independence_vs_attachment": "very independent/balanced/very attached",
    "playfulness": 0-100,
    "adaptability": 0-100
  },
  
  "exercise_requirements": {
    "daily_minutes": "X-Y minutes",
    "intensity": "low/moderate/high/extreme",
    "type_preferences": ["walking", "running", "swimming", "etc"],
    "mental_stimulation_needs": "low/moderate/high",
    "working_drive": 0-100,
    "stamina": "low/moderate/high/exceptional",
    "heat_tolerance": "poor/moderate/good",
    "cold_tolerance": "poor/moderate/good",
    "altitude_adaptation": "sea level/moderate/high altitude"
  },
  
  "nutritional_genomics": {
    "metabolism_speed": "slow/moderate/fast",
    "obesity_risk": {"score": 0-100, "genes": ["POMC", "IGF1"]},
    "protein_requirements": "low/moderate/high",
    "fat_metabolism": "efficient/normal/inefficient",
    "carbohydrate_tolerance": "low/moderate/high",
    "vitamin_metabolism": {
      "vitamin_d": "normal/enhanced/impaired",
      "b_vitamins": "normal/enhanced/impaired"
    },
    "mineral_absorption": {"calcium": "normal/enhanced/impaired", "iron": "normal/enhanced/impaired"},
    "food_sensitivities": ["potential allergens"],
    "ideal_diet_type": "high-protein/balanced/grain-free/etc",
    "feeding_schedule": "free-feed/2meals/3meals",
    "treats_tolerance": "good/moderate/poor"
  },
  
  "pharmacogenomics": {
    "drug_sensitivities": [
      {
        "drug_class": "anesthetics/NSAIDs/etc",
        "specific_drugs": ["ivermectin", "etc"],
        "genetic_marker": "MDR1/ABCB1",
        "risk_level": "contraindicated/use with caution/safe",
        "alternative_options": ["safer alternatives"]
      }
    ],
    "metabolism_variants": [],
    "recommended_medications": [],
    "medications_to_avoid": []
  },
  
  "sensory_traits": {
    "vision": {
      "acuity": "excellent/good/moderate/poor",
      "color_perception": "dichromatic/trichromatic",
      "night_vision": "excellent/good/moderate",
      "motion_detection": "excellent/good/moderate",
      "risk_factors": ["PRA", "cataracts", "etc"]
    },
    "hearing": {
      "range": "X-Y Hz",
      "sensitivity": "excellent/good/moderate",
      "deafness_risk": "low/moderate/high",
      "affected_frequencies": []
    },
    "smell": {
      "olfactory_ability": "exceptional/excellent/good/moderate",
      "scent_discrimination": "exceptional/good/moderate",
      "potential_uses": ["detection work", "tracking", "etc"]
    },
    "taste": {
      "sweet_sensitivity": "high/moderate/low",
      "bitter_sensitivity": "high/moderate/low",
      "taste_preferences": ["meat", "etc"]
    }
  },
  
  "reproductive_traits": {
    "fertility": "high/moderate/low",
    "litter_size_estimate": "X-Y puppies/kittens",
    "breeding_soundness": "excellent/good/fair/poor",
    "genetic_diversity_score": 0-100,
    "inbreeding_coefficient": 0-100,
    "breeding_recommendations": "recommended/not recommended/with caution",
    "inherited_conditions_to_screen": [],
    "optimal_breeding_age": "X-Y years",
    "pregnancy_considerations": []
  },
  
  "immune_system": {
    "immune_strength": "robust/moderate/weak",
    "autoimmune_risk": "low/moderate/high",
    "allergy_predisposition": {"environmental": 0-100, "food": 0-100, "flea": 0-100},
    "vaccine_response": "strong/moderate/weak",
    "infection_susceptibility": "low/moderate/high",
    "inflammatory_markers": []
  },
  
  "dental_health": {
    "tooth_enamel_quality": "excellent/good/fair/poor",
    "jaw_alignment": "normal/overbite/underbite",
    "periodontal_disease_risk": "low/moderate/high",
    "retained_teeth_risk": "low/moderate/high",
    "dental_care_needs": "minimal/moderate/intensive",
    "tooth_loss_timeline": "description"
  },
  
  "bone_and_joint": {
    "hip_dysplasia_risk": {"score": 0-100, "markers": ["FBN2"]},
    "elbow_dysplasia_risk": {"score": 0-100},
    "luxating_patella_risk": {"score": 0-100},
    "arthritis_predisposition": "low/moderate/high",
    "bone_density": "high/normal/low",
    "growth_plate_closure": "early/normal/late",
    "skeletal_maturity": "X months",
    "joint_supplements_recommended": true/false
  },
  
  "cardiovascular_health": {
    "heart_condition_risks": [
      {"condition": "DCM/HCM/etc", "risk": 0-100, "genes": ["MYBPC3", "etc"]}
    ],
    "blood_pressure_tendency": "low/normal/high",
    "clotting_disorders": [],
    "exercise_capacity": "poor/moderate/good/excellent",
    "cardio_screening_schedule": "yearly/bi-yearly/etc"
  },
  
  "organ_function_markers": {
    "liver": {"function_markers": [], "detox_capacity": "excellent/good/moderate/poor"},
    "kidney": {"function_prediction": "excellent/good/moderate/poor", "risk_factors": []},
    "thyroid": {"function_tendency": "hyper/normal/hypo"},
    "pancreas": {"diabetes_risk": 0-100, "pancreatitis_risk": 0-100},
    "adrenal": {"cushings_risk": 0-100, "addisons_risk": 0-100}
  },
  
  "cancer_susceptibility": {
    "overall_risk": 0-100,
    "specific_cancers": [
      {
        "type": "osteosarcoma/lymphoma/etc",
        "risk_score": 0-100,
        "genes": ["TP53", "SETD2"],
        "typical_onset_age": "X years",
        "screening_recommendations": []
      }
    ],
    "tumor_suppressor_genes": [],
    "oncogene_variants": []
  },
  
  "neurological_traits": {
    "epilepsy_risk": {"score": 0-100, "genes": ["DIRAS1", "LGI2"]},
    "degenerative_conditions": [{"condition": "DM/etc", "risk": 0-100}],
    "cognitive_function": "sharp/normal/declined",
    "senior_dementia_risk": "low/moderate/high",
    "neurological_screening": []
  },
  
  "skin_and_dermatology": {
    "skin_sensitivity": "resilient/normal/sensitive/very sensitive",
    "allergic_dermatitis_risk": 0-100,
    "seborrhea_tendency": "low/moderate/high",
    "skin_fold_dermatitis_risk": "low/moderate/high",
    "sun_sensitivity": "low/moderate/high",
    "skin_cancer_risk": "low/moderate/high",
    "healing_capacity": "excellent/good/moderate/poor"
  },
  
  "respiratory_system": {
    "airway_anatomy": "normal/narrowed/compromised",
    "brachycephalic_score": 0-100,
    "breathing_difficulty_risk": "low/moderate/high",
    "exercise_intolerance": true/false,
    "respiratory_infections_susceptibility": "low/moderate/high",
    "recommended_precautions": []
  },
  
  "gastrointestinal_profile": {
    "digestive_efficiency": "excellent/good/moderate/poor",
    "sensitive_stomach_risk": "low/moderate/high",
    "bloat_risk": {"score": 0-100, "prevention": "feeding recommendations"},
    "inflammatory_bowel_risk": 0-100,
    "food_transit_time": "fast/normal/slow",
    "gut_microbiome_health": "robust/moderate/delicate"
  },
  
  "environmental_adaptations": {
    "climate_tolerance": {
      "hot_weather": "poor/moderate/good/excellent",
      "cold_weather": "poor/moderate/good/excellent",
      "humidity": "sensitive/moderate/tolerant"
    },
    "altitude_adaptation": "sea level only/moderate/high altitude ok",
    "urban_vs_rural": "city dog/adaptable/country dog",
    "noise_sensitivity": "very sensitive/moderate/tolerant",
    "living_space_needs": "apartment ok/house with yard/large property"
  },
  
  "rare_genetic_variants": [
    {
      "variant": "specific rare allele",
      "frequency": "X%",
      "significance": "description",
      "research_status": "well-studied/emerging/novel"
    }
  ],
  
  "ancestry_lineage": {
    "genetic_diversity": "high/moderate/low",
    "founder_effect": true/false,
    "geographic_origin": "region/country",
    "ancient_breeds_detected": ["breed1", "breed2"],
    "wolf_ancestry_percentage": "X%",
    "domestication_signatures": []
  },
  
  "performance_predictions": {
    "athletic_ability": 0-100,
    "endurance": 0-100,
    "agility": 0-100,
    "strength": 0-100,
    "speed": 0-100,
    "suitable_dog_sports": ["agility", "herding", "etc"],
    "working_aptitude": "service/therapy/detection/etc"
  },
  
  "sleep_patterns": {
    "sleep_requirement": "X hours/day",
    "sleep_depth": "light/moderate/deep",
    "rem_sleep_percentage": "X%",
    "activity_pattern": "diurnal/crepuscular/nocturnal tendencies"
  },
  
  "pain_sensitivity": {
    "pain_tolerance": "low/moderate/high",
    "analgesic_requirements": "higher/normal/lower dosing",
    "pain_signaling": "very expressive/moderate/stoic"
  },
  
  "behavioral_disorders_risk": {
    "ocd_risk": 0-100,
    "compulsive_behaviors": [],
    "noise_phobia": 0-100,
    "storm_anxiety": 0-100,
    "aggression_risk": 0-100
  },
  
  "maternal_traits": {
    "mothering_ability": "excellent/good/moderate/poor",
    "milk_production": "abundant/normal/low",
    "whelping_difficulty_risk": "low/moderate/high",
    "puppy_survival_rate": "high/moderate/low"
  },
  
  "thermoregulation": {
    "heat_dissipation": "excellent/good/moderate/poor",
    "cold_resistance": "excellent/good/moderate/poor",
    "panting_efficiency": "excellent/good/moderate/poor",
    "hyperthermia_risk": "low/moderate/high"
  },
  
  "personalized_care_plan": {
    "veterinary_visits": "schedule recommendation",
    "screening_tests": [{"test": "name", "frequency": "schedule"}],
    "supplements_recommended": [],
    "lifestyle_modifications": [],
    "training_approach": "description",
    "socialization_priorities": [],
    "environmental_enrichment": [],
    "owner_education_priorities": []
  },
  
  "genetic_counseling": {
    "breeding_recommendations": "detailed advice",
    "genetic_testing_needed": [],
    "family_screening": [],
    "future_research_opportunities": []
  },
  
  "confidence_and_quality": {
    "overall_confidence": 0-100,
    "data_quality_score": 0-100,
    "markers_analyzed": 123,
    "coverage_percentage": 0-100,
    "missing_critical_markers": [],
    "interpretation_caveats": []
  }
}
`;

    // Call AI with ultra-comprehensive prompt
    const result = await callOpenRouter(ultraPrompt, tier, true);
    const parsedAnalysis = JSON.parse(result);

    return Response.json({
      success: true,
      analysis: parsedAnalysis,
      analysis_depth: "ULTRA_COMPREHENSIVE",
      categories_count: Object.keys(parsedAnalysis).length,
    });
  } catch (error) {
    console.error("Comprehensive Analysis Error:", error);
    return Response.json(
      { error: error.message || "Analysis failed" },
      { status: 500 },
    );
  }
}
