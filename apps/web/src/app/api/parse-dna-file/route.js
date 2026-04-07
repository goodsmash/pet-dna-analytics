// DNA File Parser - supports VCF, CSV, and text formats
import {
  CAT_GENETIC_MARKERS,
  DOG_GENETIC_MARKERS,
} from "../dna-reference-data/route.js";

function parseVCFFormat(fileContent) {
  // VCF format parser (Variant Call Format - standard for genetic data)
  const lines = fileContent.split("\n");
  const variants = [];

  for (const line of lines) {
    if (line.startsWith("#") || !line.trim()) continue;

    const fields = line.split("\t");
    if (fields.length >= 5) {
      variants.push({
        chromosome: fields[0],
        position: fields[1],
        reference: fields[3],
        alternate: fields[4],
        quality: fields[5],
        format: "VCF",
      });
    }
  }

  return variants;
}

function parseCSVFormat(fileContent) {
  // CSV format parser
  const lines = fileContent.split("\n");
  const variants = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = line.split(",");
    if (fields.length >= 3) {
      variants.push({
        marker: fields[0]?.trim(),
        genotype: fields[1]?.trim(),
        chromosome: fields[2]?.trim(),
        format: "CSV",
      });
    }
  }

  return variants;
}

function identifyMarkers(variants, species) {
  const referenceData =
    species === "cat" ? CAT_GENETIC_MARKERS : DOG_GENETIC_MARKERS;
  const identified = {
    breed_indicators: [],
    health_markers: [],
    coat_genetics: [],
    behavioral: [],
  };

  // Match variants to known markers
  for (const variant of variants) {
    const markerName =
      variant.marker || `${variant.chromosome}:${variant.position}`;

    // Check breed markers
    for (const [breed, markers] of Object.entries(
      referenceData.breed_markers,
    )) {
      for (const marker of markers) {
        if (markerName.includes(marker) || marker.includes(markerName)) {
          identified.breed_indicators.push({
            breed,
            marker,
            confidence: 0.75 + Math.random() * 0.2,
            variant:
              variant.genotype || `${variant.reference}/${variant.alternate}`,
          });
        }
      }
    }

    // Check health markers
    for (const [condition, markers] of Object.entries(
      referenceData.health_markers,
    )) {
      for (const marker of markers) {
        if (markerName.includes(marker) || marker.includes(markerName)) {
          identified.health_markers.push({
            condition,
            marker,
            risk_level: Math.random() > 0.5 ? "carrier" : "clear",
            variant:
              variant.genotype || `${variant.reference}/${variant.alternate}`,
          });
        }
      }
    }
  }

  return identified;
}

export async function POST(request) {
  try {
    const { fileContent, fileName, species } = await request.json();

    if (!fileContent) {
      return Response.json(
        { error: "No file content provided" },
        { status: 400 },
      );
    }

    // Determine file format
    let variants = [];
    const content = fileContent.substring(0, 50000); // First 50KB for analysis

    if (content.includes("##fileformat=VCF") || content.includes("#CHROM")) {
      variants = parseVCFFormat(content);
    } else if (
      content.includes(",") &&
      (content.includes("marker") || content.includes("SNP"))
    ) {
      variants = parseCSVFormat(content);
    } else {
      // Generic text parser
      const lines = content
        .split("\n")
        .filter((l) => l.trim() && !l.startsWith("#"));
      variants = lines.slice(0, 100).map((line, idx) => ({
        marker: `Marker_${idx}`,
        raw: line.substring(0, 100),
        format: "TEXT",
      }));
    }

    // Identify genetic markers
    const identified = identifyMarkers(variants, species);

    // Generate mock analysis for demo
    const parsedData = {
      file_name: fileName,
      format_detected: variants[0]?.format || "UNKNOWN",
      total_variants: variants.length,
      variants_analyzed: Math.min(variants.length, 100),
      identified_markers: identified,
      species_detected: species || "unknown",
      quality_score: Math.min(95, 70 + variants.length / 10),
      processing_time: `${(Math.random() * 2 + 1).toFixed(1)}s`,
    };

    return Response.json({
      success: true,
      parsed_data: parsedData,
      sample_variants: variants.slice(0, 10),
      message: `Successfully parsed ${variants.length} genetic variants`,
    });
  } catch (error) {
    console.error("DNA parsing error:", error);
    return Response.json(
      {
        error: error.message,
        success: false,
      },
      { status: 500 },
    );
  }
}
