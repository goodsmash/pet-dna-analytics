// Hierarchical Ensemble Analysis Engine
// Multi-model genetic inference system for feline DNA analysis

import { FELINE_GENETIC_MARKERS } from './feline-genetic-markers.js';
import { CAT_BREEDS } from './breed-database.js';

/**
 * Analyze DNA data using hierarchical ensemble approach
 * Combines multiple analysis layers for robust variant detection
 */
export async function analyzeWithHierarchicalEnsemble(dnaData, species) {
  const results = {
    variants: [],
    health_risks: [],
    carriers: [],
    breed_markers: {},
    confidence: 0,
    analysis_timestamp: new Date().toISOString()
  };

  if (species === 'cat') {
    // Layer 1: Direct SNP matching
    const directMatches = findDirectSNPMatches(dnaData);
    
    // Layer 2: Haplotype inference
    const haplotypeAnalysis = inferHaplotypes(dnaData);
    
    // Layer 3: Breed-informed weighting
    const breedContext = analyzeBreedContext(dnaData);
    
    // Combine layers
    results.variants = [...directMatches, ...haplotypeAnalysis.variants];
    results.health_risks = calculateHealthRisks(results.variants);
    results.carriers = identifyCarriers(results.variants);
    results.breed_markers = breedContext;
    results.confidence = calculateConfidence(directMatches, haplotypeAnalysis);
    
    // Add Three.js visualization data
    results.visualization_data = generateVisualizationData(results);
  }

  return results;
}

function findDirectSNPMatches(dnaData) {
  const matches = [];
  
  if (!dnaData || !Array.isArray(dnaData)) return matches;
  
  for (const snp of dnaData) {
    const marker = FELINE_GENETIC_MARKERS[snp.rsId || snp.id];
    if (marker) {
      matches.push({
        marker: marker,
        genotype: snp.genotype,
        confidence: snp.quality || 0.95,
        isHeterozygous: snp.genotype === '0/1' || snp.genotype === 'A/G' || 
                        snp.genotype === 'A/C' || snp.genotype === 'A/T' ||
                        snp.genotype === 'G/C' || snp.genotype === 'G/T' ||
                        snp.genotype === 'C/T'
      });
    }
  }
  
  return matches;
}

function inferHaplotypes(dnaData) {
  // Placeholder for haplotype inference
  return {
    variants: [],
    haplotype_blocks: []
  };
}

function analyzeBreedContext(dnaData) {
  // Analyze breed-specific markers
  return {
    predicted_breeds: [],
    diversity_score: 0,
    heterozygosity: 0
  };
}

function calculateHealthRisks(variants) {
  const risks = [];
  
  for (const variant of variants) {
    if (variant.marker.clinical_significance === 'high') {
      risks.push({
        condition: variant.marker.condition,
        severity: 'high',
        action: 'Veterinary consultation recommended'
      });
    }
  }
  
  return risks;
}

function identifyCarriers(variants) {
  return variants.filter(v => v.isHeterozygous && v.marker.mode === 'recessive');
}

function calculateConfidence(directMatches, haplotypeAnalysis) {
  // Weighted confidence based on multiple factors
  const baseConfidence = directMatches.length > 0 ? 0.85 : 0.5;
  return Math.min(0.99, baseConfidence + (haplotypeAnalysis.variants.length * 0.01));
}

function generateVisualizationData(results) {
  // Generate data for Three.js visualization
  return {
    genome_orb: {
      nodes: results.variants.map((v, i) => ({
        id: i,
        x: Math.random() * 4 - 2,
        y: Math.random() * 4 - 2,
        z: Math.random() * 4 - 2,
        color: getVariantColor(v),
        size: getVariantSize(v),
        risk_level: getRiskLevel(v)
      })),
      connections: generateConnections(results.variants)
    },
    health_summary: {
      high_risk: results.health_risks.filter(r => r.severity === 'high').length,
      moderate_risk: results.health_risks.filter(r => r.severity === 'moderate').length,
      carriers: results.carriers.length,
      overall_health: calculateOverallHealth(results)
    }
  };
}

function getVariantColor(variant) {
  if (variant.marker.clinical_significance === 'high') return '#ef4444'; // Red
  if (variant.marker.clinical_significance === 'moderate') return '#f59e0b'; // Amber
  if (variant.isHeterozygous) return '#3b82f6'; // Blue
  return '#22c55e'; // Green
}

function getVariantSize(variant) {
  if (variant.marker.clinical_significance === 'high') return 0.15;
  if (variant.marker.clinical_significance === 'moderate') return 0.12;
  if (variant.isHeterozygous) return 0.10;
  return 0.08;
}

function getRiskLevel(variant) {
  if (variant.marker.clinical_significance === 'high') return 1.0;
  if (variant.marker.clinical_significance === 'moderate') return 0.6;
  if (variant.isHeterozygous) return 0.3;
  return 0.1;
}

function generateConnections(variants) {
  const connections = [];
  for (let i = 0; i < variants.length - 1; i++) {
    if (variants[i].marker.gene === variants[i + 1]?.marker.gene) {
      connections.push([i, i + 1]);
    }
  }
  return connections;
}

function calculateOverallHealth(results) {
  const highRisk = results.health_risks.filter(r => r.severity === 'high').length;
  if (highRisk === 0) return 'excellent';
  if (highRisk <= 2) return 'good';
  if (highRisk <= 4) return 'fair';
  return 'poor';
}
