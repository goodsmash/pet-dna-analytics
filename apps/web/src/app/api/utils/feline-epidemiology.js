import { CAT_GENETIC_MARKERS } from "./feline-genetic-markers";

export const ADVANCED_FELINE_EPIDEMIOLOGY = {
  "BloodTypes": {
    "variants": ["c.268T>A", "c.179G>T", "c.364C>T", "c.1322delT"],
    "notes": "AB blood group system (A, B, AB types)"
  },
  "FactorXII_Deficiency": {
    "gene": "F12",
    "variants": ["c.1321delC", "c.1631G>C"],
    "clinical_relevance": "Prolonged aPTT, coagulation screening indicator"
  },
  "PyruvateKinaseDeficiency": {
    "gene": "PKLR",
    "variant": "c.693+304G>A",
    "clinical_relevance": "Hemolytic anemia, lethargy, jaundice"
  },
  "PolycysticKidneyDisease": {
    "gene": "PKD1",
    "variant": "c.9882C>A",
    "clinical_relevance": "Autosomal dominant, chronic kidney failure"
  },
  "HypertrophicCardiomyopathy": {
    "genes": ["MYBPC3_A31P", "MYBPC3_R818W"],
    "clinical_relevance": "Diastolic/systolic dysfunction, cardiac risk"
  },
  "RetinalDystrophy": {
    "genes": ["CEP290", "KIF3B", "AIPL1"],
    "clinical_relevance": "Progressive Retinal Atrophy (PRA)"
  },
  "MDR1MedicationSensitivity": {
    "gene": "ABCB1",
    "description": "Macrocyclic lactone-induced neurologic toxicosis risk"
  }
};
