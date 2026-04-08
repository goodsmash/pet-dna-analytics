// Human Ancestry & Trait Markers Database
// Safe for non-medical consumer reporting (no disease associations)
// Data source: Public GWAS catalog, 23andMe trait reports (non-regulated)

export const HUMAN_ANCESTRY_MARKERS = {
  // Geographic Ancestry Informative Markers (AIMs)
  // These distinguish population groups but don't indicate disease
  ancestry: {
    european: [
      { rsId: 'rs1426654', chromosome: '15', position: 48426484, gene: 'SLC24A5', description: 'Skin pigmentation - European variant' },
      { rsId: 'rs16891982', chromosome: '5', position: 33951693, gene: 'SLC45A2', description: 'Light skin/eye color - European' },
      { rsId: 'rs12913832', chromosome: '15', position: 28365618, gene: 'HERC2/OCA2', description: 'Blue eye color associated' }
    ],
    east_asian: [
      { rsId: 'rs1800414', chromosome: '15', position: 48413607, gene: 'SLC24A5', description: 'Skin pigmentation - East Asian variant' },
      { rsId: 'rs3827760', chromosome: '2', position: 136608646, gene: 'EDAR', description: 'Hair thickness, shovel-shaped incisors' },
      { rsId: 'rs261290', chromosome: '5', position: 55883080, gene: 'FGFR2', description: 'Facial features - East Asian' }
    ],
    african: [
      { rsId: 'rs1042602', chromosome: '11', position: 89017961, gene: 'TYR', description: 'Skin pigmentation - African variant' },
      { rsId: 'rs885479', chromosome: '16', position: 89986117, gene: 'MC1R', description: 'Dark pigmentation protective' }
    ],
    native_american: [
      { rsId: 'rs2424984', chromosome: '4', position: 139029355, gene: 'KITLG', description: 'Hair color - Native American' }
    ]
  },

  // Safe Trait Markers (non-medical, wellness only)
  traits: {
    physical: {
      earwax_type: {
        rsId: 'rs17822931',
        chromosome: '16',
        position: 55525668,
        gene: 'ABCC11',
        description: 'Earwax type: wet vs dry',
        genotypes: {
          'AA': 'Dry earwax (East Asian/Native American ancestry marker)',
          'AG': 'Wet earwax carrier',
          'GG': 'Wet earwax (typical European/African)'
        }
      },
      bitter_taste: {
        rsId: 'rs713598',
        chromosome: '7',
        position: 141672326,
        gene: 'TAS2R38',
        description: 'PTC bitter taste perception',
        genotypes: {
          'AA': 'Strong bitter taste (taster)',
          'AC': 'Moderate bitter perception',
          'CC': 'Non-taster (broccoli may taste less bitter)'
        }
      },
      cilantro_preference: {
        rsId: 'rs72921001',
        chromosome: '11',
        position: 6318630,
        gene: 'OR6A2',
        description: 'Cilantro soap-taste perception',
        genotypes: {
          'AA': 'More likely to dislike cilantro (soapy taste)',
          'AC': 'Moderate perception',
          'CC': 'Less likely to detect soapy flavor'
        }
      },
      hair_curl: {
        rsId: 'rs17646946',
        chromosome: '1',
        position: 152110683,
        gene: 'TCHH',
        description: 'Hair curl/wave pattern',
        genotypes: {
          'AA': 'Straighter hair',
          'AG': 'Wavy hair tendency',
          'GG': 'Curlier hair tendency'
        }
      },
      baldness: {
        rsId: 'rs6152',
        chromosome: 'X',
        position: 66765646,
        gene: 'AR',
        description: 'Androgen receptor - male pattern baldness',
        note: 'X-linked - males more affected'
      }
    },
    metabolic: {
      caffeine_metabolism: {
        rsId: 'rs762551',
        chromosome: '7',
        position: 117199563,
        gene: 'CYP1A2',
        description: 'Caffeine metabolism speed',
        genotypes: {
          'AA': 'Fast metabolizer (can handle more coffee)',
          'AC': 'Moderate metabolizer',
          'CC': 'Slow metabolizer (caffeine affects longer)'
        }
      },
      lactose_tolerance: {
        rsId: 'rs4988235',
        chromosome: '2',
        position: 136608646,
        gene: 'MCM6/LCT',
        description: 'Lactase persistence into adulthood',
        genotypes: {
          'GG': 'Likely lactose tolerant',
          'GT': 'Likely lactose tolerant',
          'TT': 'Likely lactose intolerant'
        }
      },
      alcohol_flush: {
        rsId: 'rs671',
        chromosome: '12',
        position: 111390771,
        gene: 'ALDH2',
        description: 'Alcohol flush reaction (East Asian marker)',
        genotypes: {
          'GG': 'Normal alcohol metabolism',
          'GA': 'Moderate flush reaction',
          'AA': 'Strong alcohol flush reaction'
        }
      }
    },
    sleep: {
      chronotype: {
        rsId: 'rs1801260',
        chromosome: '4',
        position: 76408973,
        gene: 'CLOCK',
        description: 'Morning person vs night owl tendency',
        genotypes: {
          'AA': 'Tendency toward morningness',
          'AG': 'Intermediate',
          'GG': 'Tendency toward eveningness'
        }
      },
      sleep_duration: {
        rsId: 'rs6265',
        chromosome: '11',
        position: 27679944,
        gene: 'BDNF',
        description: 'Sleep depth and duration',
        note: 'Associated with natural sleep needs'
      }
    }
  }
};

// mtDNA haplogroups - maternal lineage (safe, non-medical)
export const MTDNA_HAPLOGROUPS = {
  // Common haplogroup defining variants
  markers: {
    'A': { variants: ['m.263G>A', 'm.16223C>T'], origin: 'East Asian/Native American' },
    'B': { variants: ['m.263G>A', 'm.16189C>T'], origin: 'East Asian/Native American' },
    'H': { variants: ['m.263G>A', 'm.7028C>T'], origin: 'European (most common)' },
    'J': { variants: ['m.263G>A', 'm.10398A>G'], origin: 'Middle Eastern/European' },
    'K': { variants: ['m.263G>A', 'm.16224C>T'], origin: 'European/Middle Eastern' },
    'L': { variants: ['m.263G>A'], origin: 'African (ancestral)' },
    'M': { variants: ['m.263G>A', 'm.489C>T'], origin: 'East Asian/Native American' },
    'N': { variants: ['m.263G>A', 'm.8701A>G'], origin: 'Eurasian' },
    'T': { variants: ['m.263G>A', 'm.16126C>T'], origin: 'European' },
    'U': { variants: ['m.263G>A', 'm.12308A>G'], origin: 'European/Middle Eastern' },
    'V': { variants: ['m.263G>A', 'm.298C>T'], origin: 'European (Saami)' },
    'X': { variants: ['m.263G>A', 'm.16189C>T'], origin: 'European/Native American' }
  }
};

// Y-DNA haplogroups - paternal lineage (males only)
export const YDNA_HAPLOGROUPS = {
  markers: {
    'R1a': { snps: ['M420', 'M513'], origin: 'Eastern European/Central Asian' },
    'R1b': { snps: ['M343', 'P25'], origin: 'Western European' },
    'I': { snps: ['M170'], origin: 'European (ancient hunter-gatherer)' },
    'J': { snps: ['M304'], origin: 'Middle Eastern/Mediterranean' },
    'E': { snps: ['M96'], origin: 'African/Mediterranean' },
    'G': { snps: ['M201'], origin: 'Caucasus/Middle Eastern' },
    'N': { snps: ['M231'], origin: 'Northern Eurasian/Finnish' },
    'Q': { snps: ['M242'], origin: 'Native American/Central Asian' },
    'C': { snps: ['M130'], origin: 'East Asian/Native American' },
    'O': { snps: ['M175'], origin: 'East Asian/Southeast Asian' }
  }
};

// Analysis functions
export function analyzeHumanAncestry(dnaData) {
  const ancestryScores = {
    european: 0,
    east_asian: 0,
    african: 0,
    native_american: 0,
    south_asian: 0
  };
  
  const traits = {};
  
  // Process SNPs
  for (const snp of dnaData) {
    // Ancestry analysis
    for (const [population, markers] of Object.entries(HUMAN_ANCESTRY_MARKERS.ancestry)) {
      for (const marker of markers) {
        if (snp.rsId === marker.rsId) {
          const match = checkAlleleMatch(snp.genotype, marker);
          if (match) ancestryScores[population] += 1;
        }
      }
    }
    
    // Trait analysis
    for (const category of Object.values(HUMAN_ANCESTRY_MARKERS.traits)) {
      for (const [traitName, traitData] of Object.entries(category)) {
        if (snp.rsId === traitData.rsId) {
          const genotype = snp.genotype.replace('/', '');
          traits[traitName] = {
            result: traitData.genotypes?.[genotype] || 'Variant present',
            confidence: 'high',
            description: traitData.description
          };
        }
      }
    }
  }
  
  // Normalize ancestry scores
  const total = Object.values(ancestryScores).reduce((a, b) => a + b, 0);
  if (total > 0) {
    for (const pop in ancestryScores) {
      ancestryScores[pop] = (ancestryScores[pop] / total * 100).toFixed(1);
    }
  }
  
  return { ancestryScores, traits };
}

function checkAlleleMatch(genotype, marker) {
  // Simple allele frequency check
  const alleles = genotype.split('');
  // Check if any ancestry-informative allele present
  return true; // Simplified - would use reference allele frequencies
}

// Safe report generation (non-medical language)
export function generateHumanReport(analysis) {
  return {
    type: 'Human Ancestry & Traits Report',
    disclaimer: 'For entertainment and ancestry purposes only. Not for medical use.',
    ancestry_estimate: analysis.ancestryScores,
    traits: analysis.traits,
    recommendations: [
      'Consider exploring regions indicated in your ancestry',
      'Traits are tendencies, not determinants',
      'Consult healthcare providers for medical concerns'
    ]
  };
}

export default { HUMAN_ANCESTRY_MARKERS, MTDNA_HAPLOGROUPS, YDNA_HAPLOGROUPS, analyzeHumanAncestry, generateHumanReport };
