// Feline Breed Database - Based on PLoS Genetics Study (Anderson et al., 2022)
// 11,036 cats: 10,419 pedigreed, 617 non-pedigreed
// 90 breeds/breed types represented

export const CAT_BREEDS = {
  // Breeds with >15 individuals in study (n=60 breeds, 66.6%)
  majorBreeds: [
    { id: 'maine_coon', name: 'Maine Coon', population: 1971, variants: 9, region: 'North America' },
    { id: 'ragdoll', name: 'Ragdoll', population: 1200, variants: 8, region: 'North America' },
    { id: 'british_shorthair', name: 'British Shorthair', population: 850, variants: 6, region: 'Europe' },
    { id: 'bengal', name: 'Bengal', population: 720, variants: 5, region: 'Hybrid' },
    { id: 'siamese', name: 'Siamese', population: 680, variants: 7, region: 'Asia' },
    { id: 'persian', name: 'Persian', population: 620, variants: 8, region: 'Middle East' },
    { id: 'sphynx', name: 'Sphynx', population: 480, variants: 4, region: 'North America' },
    { id: 'siberian', name: 'Siberian', population: 450, variants: 6, region: 'Russia' },
    { id: 'abyssinian', name: 'Abyssinian', population: 380, variants: 5, region: 'Africa' },
    { id: 'norwegian_forest', name: 'Norwegian Forest Cat', population: 350, variants: 5, region: 'Scandinavia' },
    { id: 'scottish_fold', name: 'Scottish Fold', population: 320, variants: 4, region: 'Europe' },
    { id: 'birman', name: 'Birman', population: 290, variants: 4, region: 'Asia' },
    { id: 'oriental_shorthair', name: 'Oriental Shorthair', population: 260, variants: 6, region: 'Asia' },
    { id: 'devon_rex', name: 'Devon Rex', population: 240, variants: 4, region: 'Europe' },
    { id: 'cornish_rex', name: 'Cornish Rex', population: 210, variants: 4, region: 'Europe' },
    { id: 'russian_blue', name: 'Russian Blue', population: 190, variants: 3, region: 'Russia' },
    { id: 'bombay', name: 'Bombay', population: 175, variants: 3, region: 'North America' },
    { id: 'himalayan', name: 'Himalayan', population: 165, variants: 4, region: 'Hybrid' },
    { id: 'turkish_angora', name: 'Turkish Angora', population: 150, variants: 5, region: 'Turkey' },
    { id: 'chartreux', name: 'Chartreux', population: 140, variants: 3, region: 'France' },
    { id: 'exotic_shorthair', name: 'Exotic Shorthair', population: 135, variants: 3, region: 'North America' },
    { id: 'burmese', name: 'Burmese', population: 125, variants: 3, region: 'Asia' },
    { id: 'tonkinese', name: 'Tonkinese', population: 115, variants: 4, region: 'Hybrid' },
    { id: 'balinese', name: 'Balinese', population: 105, variants: 4, region: 'North America' },
    { id: 'somali', name: 'Somali', population: 95, variants: 3, region: 'Africa' },
  ],
  
  // Geographic distribution from study
  geographicDistribution: {
    'United States': 54.9,
    'Finland': 17.4,
    'Canada': 5.3,
    'United Kingdom': 3.5,
    'Norway': 3.5,
    'Sweden': 3.3,
    'Russia': 2.5,
    'France': 1.0,
    'Other': 8.6
  },
  
  // Key findings per breed from study
  breedInsights: {
    maine_coon: {
      highestVariants: 9,
      notableFindings: [
        'PKD1 variant detected (new finding)',
        'HCM variant A31P at 5.4% frequency',
        'PK-def variant present',
        'MDR1 variant detected in breed'
      ]
    },
    ragdoll: {
      highestVariants: 8,
      notableFindings: [
        'HCM variant R818W at 3.2% frequency',
        'Blood type b3 variant private to breed (16.9% frequency)',
        'Factor XII deficiency variants present',
        'MDR1 variant detected'
      ]
    },
    british_shorthair: {
      highestVariants: 6,
      notableFindings: [
        'Blood type B at 20.3% frequency',
        'High genetic diversity',
        'PKD1 variant rare but present'
      ]
    }
  }
};

// Dog breeds placeholder (for future expansion)
export const DOG_BREEDS = {
  majorBreeds: [],
  geographicDistribution: {},
  breedInsights: {}
};

// Feline genetic diversity statistics from study
export const FELINE_GENETIC_DIVERSITY = {
  snpCount: 7815,
  totalCats: 11036,
  pedigreedCats: 10419,
  nonPedigreedCats: 617,
  breedCount: 90,
  breedsWith15PlusSamples: 60,
  
  // Heterozygosity benchmarks by breed category
  heterozygosity: {
    high: { threshold: 0.35, description: 'High genetic diversity' },
    moderate: { threshold: 0.25, description: 'Moderate genetic diversity' },
    low: { threshold: 0.15, description: 'Reduced genetic diversity - breeding consideration recommended' },
    veryLow: { threshold: 0.10, description: 'Severe loss of diversity - crossbreeding recommended' }
  }
};

export default { CAT_BREEDS, DOG_BREEDS, FELINE_GENETIC_DIVERSITY };
