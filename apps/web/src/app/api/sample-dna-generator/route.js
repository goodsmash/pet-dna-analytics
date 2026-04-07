/**
 * Sample DNA File Generator
 * Creates realistic test DNA files for different breeds and species
 * Perfect for testing the platform without needing real DNA samples
 */

import { DOG_BREEDS, CAT_BREEDS } from "../dna-reference-data/route.js";

export async function POST(request) {
  try {
    const { species, breed, markerCount } = await request.json();

    if (!species || (species !== "dog" && species !== "cat")) {
      return Response.json(
        { error: "Invalid species. Must be 'dog' or 'cat'" },
        { status: 400 },
      );
    }

    const breedDatabase = species === "dog" ? DOG_BREEDS : CAT_BREEDS;
    const breedNames = Object.keys(breedDatabase);

    // Random breed if not specified
    const selectedBreed =
      breed && breedDatabase[breed]
        ? breed
        : breedNames[Math.floor(Math.random() * breedNames.length)];

    const breedData = breedDatabase[selectedBreed];
    const markers = breedData.genetic_markers;

    // Number of markers to generate
    const numMarkers = markerCount || Math.floor(Math.random() * 300) + 200; // 200-500 markers

    // Generate VCF file content
    let vcfContent = generateVCFHeader(species, selectedBreed);

    // Add breed-specific markers
    markers.forEach((marker, index) => {
      vcfContent += generateMarkerLine(marker, index + 1, species, true);
    });

    // Add random background markers
    const remainingMarkers = numMarkers - markers.length;
    for (let i = 0; i < remainingMarkers; i++) {
      vcfContent += generateMarkerLine(
        `RANDOM_${i}`,
        markers.length + i + 1,
        species,
        false,
      );
    }

    // Also create a summary object
    const summary = {
      species: species,
      breed: selectedBreed,
      breed_info: breedData,
      total_markers: numMarkers,
      breed_specific_markers: markers.length,
      background_markers: remainingMarkers,
      file_size_bytes: vcfContent.length,
      chromosomes: species === "dog" ? 38 : 19,
    };

    return Response.json({
      success: true,
      file_content: vcfContent,
      summary: summary,
      download_filename: `${species}_${selectedBreed.replace(/\s+/g, "_")}_dna.vcf`,
    });
  } catch (error) {
    console.error("Sample DNA Generation Error:", error);
    return Response.json(
      { error: error.message || "Failed to generate sample DNA" },
      { status: 500 },
    );
  }
}

// Generate VCF header
function generateVCFHeader(species, breed) {
  return `##fileformat=VCFv4.2
##fileDate=${new Date().toISOString().split("T")[0].replace(/-/g, "")}
##source=PetDNAAnalyzer_SampleGenerator
##reference=${species === "dog" ? "CanFam3.1" : "Felis_catus_9.0"}
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
##INFO=<ID=AF,Number=A,Type=Float,Description="Allele Frequency">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
##FORMAT=<ID=GQ,Number=1,Type=Integer,Description="Genotype Quality">
##SAMPLE=<ID=${breed.replace(/\s+/g, "_")},Species=${species}>
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE\n`;
}

// Generate a single marker line
function generateMarkerLine(markerName, index, species, isBreedSpecific) {
  const chromosomes = species === "dog" ? 38 : 19;
  const chromosome = Math.floor(Math.random() * chromosomes) + 1;
  const position = Math.floor(Math.random() * 100000000) + 1000000; // Random position

  const bases = ["A", "T", "C", "G"];
  const ref = bases[Math.floor(Math.random() * bases.length)];
  const alt = bases.filter((b) => b !== ref)[Math.floor(Math.random() * 3)];

  const quality = isBreedSpecific
    ? Math.floor(Math.random() * 20) + 80
    : Math.floor(Math.random() * 50) + 30;
  const depth = isBreedSpecific
    ? Math.floor(Math.random() * 50) + 50
    : Math.floor(Math.random() * 30) + 10;
  const af = isBreedSpecific
    ? (Math.random() * 0.3 + 0.7).toFixed(3)
    : (Math.random() * 0.6).toFixed(3);

  // Genotype: 0/0 (ref/ref), 0/1 (ref/alt), 1/1 (alt/alt)
  const genotypes = ["0/0", "0/1", "1/1"];
  const gt = isBreedSpecific
    ? genotypes[Math.floor(Math.random() * 2) + 1]
    : genotypes[Math.floor(Math.random() * 3)];
  const gq = Math.floor(Math.random() * 40) + 60;

  return `${chromosome}\t${position}\t${markerName}\t${ref}\t${alt}\t${quality}\tPASS\tDP=${depth};AF=${af}\tGT:GQ\t${gt}:${gq}\n`;
}

// GET endpoint to list available breeds
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const species = searchParams.get("species");

  if (!species) {
    return Response.json({
      message: "Sample DNA Generator",
      usage:
        "POST with { species: 'dog' or 'cat', breed: 'breed name' (optional), markerCount: 300 (optional) }",
      available_species: ["dog", "cat"],
      dog_breeds: Object.keys(DOG_BREEDS).length,
      cat_breeds: Object.keys(CAT_BREEDS).length,
    });
  }

  if (species === "dog") {
    return Response.json({
      species: "dog",
      available_breeds: Object.keys(DOG_BREEDS).sort(),
      total: Object.keys(DOG_BREEDS).length,
    });
  }

  if (species === "cat") {
    return Response.json({
      species: "cat",
      available_breeds: Object.keys(CAT_BREEDS).sort(),
      total: Object.keys(CAT_BREEDS).length,
    });
  }

  return Response.json({ error: "Invalid species" }, { status: 400 });
}
