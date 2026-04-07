// Provide a sample DNA file for testing
export async function GET(request) {
  const sampleDNAContent = `# Sample Cat DNA File - Test Data
# This is a simplified example for demonstration purposes
# Real DNA files contain millions of SNPs (Single Nucleotide Polymorphisms)

## Sample Information
Species: Felis catus (Domestic Cat)
Sample ID: CAT_001
Test Date: 2024-01-15

## Genetic Markers

# Breed-related markers
rs123456789 A/G  # Associated with Siamese coat patterns
rs234567890 C/C  # Persian breed marker
rs345678901 T/T  # Maine Coon size trait
rs456789012 G/A  # Ragdoll temperament marker

# Health markers
rs567890123 C/T  # PKD (Polycystic Kidney Disease) - carrier
rs678901234 A/A  # HCM (Hypertrophic Cardiomyopathy) - negative
rs789012345 G/G  # FIP susceptibility - low risk
rs890123456 T/C  # Dental health marker - moderate risk

# Coat color genetics
MC1R G/G         # Black coat color
TYR C/C          # Full pigmentation
ASIP A/a         # Agouti pattern (tabby)

# Behavioral traits
DRD4 L/L         # Social behavior - highly social
SLC6A4 S/L       # Anxiety response - moderate
HTR2A A/G        # Aggression threshold - low

# Metabolic markers
CYP1A2 *1A/*1B   # Caffeine metabolism - normal
UGT1A6 G/A       # Drug metabolism - standard

# Sensory traits
TAS2R38 PAV/AVI  # Taste sensitivity - moderate
PCDH15 A/A       # Hearing - normal

# Longevity markers
IGF1 A/A         # Growth factor - associated with longer lifespan
FOXO3 G/G        # Longevity gene variant

# Sample SNP data (simplified format)
# Chromosome Position Genotype
1 12345678 A/G
1 23456789 C/C
2 34567890 T/A
2 45678901 G/G
3 56789012 C/T
4 67890123 A/A
5 78901234 G/C
6 89012345 T/T

## Analysis Notes
This sample contains markers for:
- Mixed breed ancestry (Siamese, Persian, Maine Coon, Ragdoll)
- PKD carrier status (important for breeding decisions)
- Low HCM risk
- Tabby coat pattern with black base color
- Highly social temperament
- Normal metabolic function
- Good longevity indicators
`;

  return new Response(sampleDNAContent, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": 'attachment; filename="sample_cat_dna.txt"',
    },
  });
}
