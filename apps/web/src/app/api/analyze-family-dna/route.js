// Family DNA Vault API Route
// Unified endpoint for Pet Health + Human Ancestry/Traits
// Compliant with FDA wellness app guidelines

import { analyzeFamilyDNA, generateFamilyDashboard } from '../unified-family-vault.js';
import { processGeneticResearch } from '../unified-research-hub.js';

export async function POST({ request }) {
  try {
    const body = await request.json();
    const { dnaData, subjectType, species, metadata } = body;
    
    // Validate required fields
    if (!dnaData || !subjectType) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: dnaData, subjectType'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Validate subject type
    if (!['pet', 'human'].includes(subjectType)) {
      return new Response(JSON.stringify({
        error: 'subjectType must be "pet" or "human"'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    
    // Special validation for human submissions
    if (subjectType === 'human') {
      const consent = metadata?.consent || {};
      if (!consent.understandsWellnessOnly || !consent.notForMedicalUse) {
        return new Response(JSON.stringify({
          error: 'Human DNA analysis requires explicit consent acknowledgments',
          required_consent: [
            'I understand this is for ancestry and traits only',
            'I acknowledge this is not for medical or diagnostic use'
          ]
        }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
    }
    
    // Process analysis
    const analysis = await analyzeFamilyDNA(dnaData, subjectType, {
      species: species || 'cat',
      ...metadata
    });
    
    return new Response(JSON.stringify({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error('Family DNA analysis error:', error);
    return new Response(JSON.stringify({
      error: 'Analysis failed',
      message: error.message
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

// Get family dashboard
export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const householdId = url.searchParams.get('household_id');
    
    // In production, this would query database for household members
    // For now, return sample dashboard structure
    const dashboard = generateFamilyDashboard([
      {
        id: 'pet_001',
        type: 'pet',
        name: 'Whiskers',
        species: 'cat',
        breed: 'Maine Coon',
        age: 3,
        healthStatus: 'good',
        lastAnalysisDate: new Date().toISOString(),
        health_risks: [],
        carriers: [{ variant: 'HCM', status: 'carrier' }],
        diversity_score: 0.28
      },
      {
        id: 'human_001',
        type: 'human',
        name: 'Mom',
        age: 45,
        primaryAncestry: 'European',
        ancestryScores: { european: 85, east_asian: 5, african: 5, native_american: 5 },
        traits: ['lactose_tolerant', 'bitter_taster', 'morning_person'],
        lastAnalysisDate: new Date().toISOString()
      }
    ]);
    
    return new Response(JSON.stringify({
      success: true,
      dashboard
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    return new Response(JSON.stringify({
      error: 'Dashboard generation failed'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
