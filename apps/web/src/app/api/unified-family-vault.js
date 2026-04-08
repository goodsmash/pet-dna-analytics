// Unified Family DNA Vault - Pet Health + Human Ancestry
// Compliant design: Pet health reports + Human ancestry/traits only
// No human medical claims without FDA approval

import { processGeneticResearch } from './unified-research-hub.js';
import { analyzeHumanAncestry, generateHumanReport } from './utils/human-ancestry-markers.js';

/**
 * Unified DNA Analysis Router
 * Routes pet DNA to health analysis
 * Routes human DNA to ancestry/traits analysis
 */
export async function analyzeFamilyDNA(dnaData, subjectType, metadata = {}) {
  const analysisId = generateAnalysisId();
  
  if (subjectType === 'pet') {
    return await analyzePetDNA(dnaData, metadata);
  } else if (subjectType === 'human') {
    return await analyzeHumanDNA(dnaData, metadata);
  } else {
    throw new Error('Subject type must be "pet" or "human"');
  }
}

/**
 * Pet DNA Analysis - Full Health Reports (Unregulated Space)
 */
async function analyzePetDNA(dnaData, metadata) {
  const species = metadata.species || 'cat';
  
  // Use existing research-grade analysis
  const healthAnalysis = await processGeneticResearch(dnaData, species, metadata);
  
  return {
    subject: 'pet',
    species: species,
    analysis_type: 'comprehensive_health',
    report_sections: {
      health_summary: healthAnalysis.health_risks,
      genetic_diversity: healthAnalysis.research_metadata?.genomic_diversity_score,
      breed_analysis: healthAnalysis.breed_markers,
      carrier_status: healthAnalysis.carriers,
      recommendations: generatePetRecommendations(healthAnalysis),
      veterinary_actions: healthAnalysis.health_risks?.filter(r => r.action) || []
    },
    visualization_data: healthAnalysis.visualization_data,
    confidence: healthAnalysis.confidence,
    timestamp: new Date().toISOString()
  };
}

/**
 * Human DNA Analysis - Ancestry & Traits Only (FDA Compliant)
 * NO disease risk, NO drug response, NO medical recommendations
 */
async function analyzeHumanDNA(dnaData, metadata) {
  const ancestryAnalysis = analyzeHumanAncestry(dnaData);
  const report = generateHumanReport(ancestryAnalysis);
  
  return {
    subject: 'human',
    analysis_type: 'ancestry_traits',
    disclaimers: [
      'For ancestry and trait exploration only',
      'Not for medical, diagnostic, or health purposes',
      'Results are estimates based on population genetics',
      'Consult healthcare providers for medical concerns'
    ],
    report_sections: {
      ancestry_estimate: {
        breakdown: ancestryAnalysis.ancestryScores,
        visualization: 'ancestry_pie_chart',
        confidence: 'moderate',
        note: 'Ancestry estimates based on reference populations'
      },
      traits: {
        physical: filterTraitsByCategory(ancestryAnalysis.traits, 'physical'),
        metabolic: filterTraitsByCategory(ancestryAnalysis.traits, 'metabolic'),
        sleep: filterTraitsByCategory(ancestryAnalysis.traits, 'sleep')
      },
      family_comparison: null, // Future: compare to uploaded relatives
      raw_data_access: {
        available: true,
        format: '23andMe compatible',
        export_options: ['CSV', 'JSON', 'VCF']
      }
    },
    visualization_data: generateHumanVizData(ancestryAnalysis),
    timestamp: new Date().toISOString()
  };
}

/**
 * Family Dashboard - Unified View of All Subjects
 */
export function generateFamilyDashboard(familyMembers) {
  const dashboard = {
    household_id: generateHouseholdId(),
    members: [],
    insights: {
      shared_traits: [],
      ancestry_comparison: null,
      health_alerts: []
    }
  };
  
  for (const member of familyMembers) {
    const memberCard = {
      id: member.id,
      name: member.name,
      type: member.type, // 'pet' or 'human'
      avatar: member.avatar,
      last_analysis: member.lastAnalysisDate,
      quick_stats: getQuickStats(member)
    };
    
    if (member.type === 'pet') {
      memberCard.health_status = member.healthStatus;
      memberCard.breed = member.breed;
      memberCard.age = member.age;
    } else {
      memberCard.ancestry_primary = member.primaryAncestry;
      memberCard.traits_count = member.traits?.length || 0;
    }
    
    dashboard.members.push(memberCard);
  }
  
  // Cross-member insights
  dashboard.insights = generateCrossInsights(familyMembers);
  
  return dashboard;
}

function generatePetRecommendations(healthAnalysis) {
  const recommendations = [];
  
  if (healthAnalysis.health_risks?.length > 0) {
    recommendations.push('Schedule veterinary consultation for flagged conditions');
  }
  
  if (healthAnalysis.carriers?.length > 0) {
    recommendations.push('Consider genetic counseling before breeding');
  }
  
  const diversityScore = healthAnalysis.research_metadata?.genomic_diversity_score;
  if (diversityScore && diversityScore < 0.15) {
    recommendations.push('Genetic diversity is low - discuss breeding strategies with vet');
  }
  
  recommendations.push('Share results with your veterinarian');
  recommendations.push('Store raw DNA data for future research compatibility');
  
  return recommendations;
}

function filterTraitsByCategory(traits, category) {
  const categoryMap = {
    physical: ['earwax_type', 'bitter_taste', 'cilantro_preference', 'hair_curl', 'baldness'],
    metabolic: ['caffeine_metabolism', 'lactose_tolerance', 'alcohol_flush'],
    sleep: ['chronotype', 'sleep_duration']
  };
  
  const filtered = {};
  for (const [key, value] of Object.entries(traits)) {
    if (categoryMap[category]?.includes(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
}

function generateHumanVizData(ancestryAnalysis) {
  return {
    ancestry_map: {
      type: 'world_map',
      regions: ancestryAnalysis.ancestryScores,
      color_coding: 'population_gradient'
    },
    traits_wheel: {
      type: 'radar_chart',
      categories: ['Physical', 'Metabolic', 'Sleep'],
      values: calculateTraitScores(ancestryAnalysis.traits)
    },
    dna_helix: {
      type: '3d_helix',
      markers_highlighted: Object.keys(ancestryAnalysis.traits).length
    }
  };
}

function calculateTraitScores(traits) {
  // Simplified scoring for visualization
  const categories = { physical: 0, metabolic: 0, sleep: 0 };
  const counts = { physical: 0, metabolic: 0, sleep: 0 };
  
  // Count traits per category
  for (const [key] of Object.entries(traits)) {
    if (['earwax_type', 'bitter_taste', 'cilantro_preference', 'hair_curl', 'baldness'].includes(key)) {
      categories.physical++;
      counts.physical++;
    } else if (['caffeine_metabolism', 'lactose_tolerance', 'alcohol_flush'].includes(key)) {
      categories.metabolic++;
      counts.metabolic++;
    } else if (['chronotype', 'sleep_duration'].includes(key)) {
      categories.sleep++;
      counts.sleep++;
    }
  }
  
  return {
    physical: categories.physical > 0 ? Math.min(100, categories.physical * 20) : 50,
    metabolic: categories.metabolic > 0 ? Math.min(100, categories.metabolic * 33) : 50,
    sleep: categories.sleep > 0 ? Math.min(100, categories.sleep * 50) : 50
  };
}

function getQuickStats(member) {
  if (member.type === 'pet') {
    return {
      health_alerts: member.health_risks?.length || 0,
      carrier_variants: member.carriers?.length || 0,
      diversity_score: member.diversity_score || 'N/A'
    };
  } else {
    return {
      ancestry_regions: Object.values(member.ancestryScores || {}).filter(s => s > 5).length,
      traits_discovered: member.traits?.length || 0
    };
  }
}

function generateCrossInsights(members) {
  const insights = {
    shared_traits: [],
    ancestry_comparison: null,
    health_alerts: []
  };
  
  const humans = members.filter(m => m.type === 'human');
  const pets = members.filter(m => m.type === 'pet');
  
  if (humans.length > 1) {
    // Compare ancestry between family members
    insights.ancestry_comparison = 'Ancestry comparison available for family members';
  }
  
  // Health alerts for pets
  for (const pet of pets) {
    if (pet.health_risks?.length > 0) {
      insights.health_alerts.push({
        subject: pet.name,
        alert_count: pet.health_risks.length,
        severity: pet.health_risks.some(r => r.severity === 'high') ? 'high' : 'moderate'
      });
    }
  }
  
  return insights;
}

function generateAnalysisId() {
  return 'dna-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
}

function generateHouseholdId() {
  return 'family-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

export default { analyzeFamilyDNA, generateFamilyDashboard };
