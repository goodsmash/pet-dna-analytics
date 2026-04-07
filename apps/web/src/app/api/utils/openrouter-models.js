// Using FREE/CHEAP models for testing - no cost required
export const TIER_MODELS = {
  FREE: "google/gemini-2.0-flash-exp:free", // FREE Gemini Flash
  PRO: "google/gemini-2.0-flash-exp:free", // FREE for testing - upgrade to paid later
  ULTRA: "google/gemini-2.0-flash-thinking-exp-1219:free", // FREE thinking model
};

// Specialized models - using free models for testing
export const SPECIALIST_MODELS = {
  HEALTH_ANALYSIS: "meta-llama/llama-3.3-70b-instruct:free", // FREE Llama for health
  BREED_COMPOSITION: "google/gemini-2.0-flash-exp:free", // FREE Gemini
  BEHAVIORAL_TRAITS: "meta-llama/llama-3.2-3b-instruct:free", // FREE small Llama
  LONGEVITY_MARKERS: "google/gemini-2.0-flash-thinking-exp-1219:free", // FREE thinking
  PHARMACOGENOMICS: "meta-llama/llama-3.3-70b-instruct:free", // FREE Llama 70B
};

// Multi-model validation models - for cross-checking accuracy
export const VALIDATION_MODELS = {
  VALIDATOR_1: "google/gemini-2.0-flash-thinking-exp-1219:free",
  VALIDATOR_2: "meta-llama/llama-3.3-70b-instruct:free",
  VALIDATOR_3: "qwen/qwen-2.5-72b-instruct:free",

  CONSENSUS_SET: [
    "google/gemini-2.0-flash-thinking-exp-1219:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen-2.5-72b-instruct:free",
  ],
};

export function getModelForTier(tier) {
  return TIER_MODELS[tier] || TIER_MODELS.FREE;
}

export function getSpecialistModel(domain) {
  return SPECIALIST_MODELS[domain] || TIER_MODELS.PRO;
}

export async function callOpenRouter(prompt, tier = "FREE", jsonMode = true) {
  const model = getModelForTier(tier);
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_CREATE_APP_URL,
        "X-Title": "Pet DNA AI",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: jsonMode
              ? "You are a professional animal genetics assistant. Respond only in valid JSON."
              : "You are a professional animal genetics assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3, // Lower temperature for more accurate, consistent results
        response_format: jsonMode ? { type: "json_object" } : undefined,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter Error [${response.status}]: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Multi-agent analysis for ULTRA tier
export async function multiAgentAnalysis(dnaContent, petInfo, tier) {
  if (tier !== "ULTRA") {
    // Single-pass analysis for non-ULTRA tiers
    return null;
  }

  // Run specialized analyses in parallel
  const analyses = await Promise.all([
    callOpenRouter(
      `Analyze health risks and predispositions for this ${petInfo.species}. DNA: ${dnaContent.slice(0, 2000)}. Return JSON with: { health_risks: [], disease_markers: [], preventive_care: [] }`,
      "ULTRA",
      true,
    ),
    callOpenRouter(
      `Analyze behavioral and temperament genetics for this ${petInfo.species}. DNA: ${dnaContent.slice(0, 2000)}. Return JSON with: { temperament: {}, behavioral_traits: [], training_recommendations: [] }`,
      "ULTRA",
      true,
    ),
    callOpenRouter(
      `Analyze longevity and aging markers for this ${petInfo.species}. DNA: ${dnaContent.slice(0, 2000)}. Return JSON with: { longevity_score: 0, aging_markers: [], life_expectancy_range: "", optimal_care: [] }`,
      "ULTRA",
      true,
    ),
  ]);

  return {
    health_analysis: JSON.parse(analyses[0]),
    behavioral_analysis: JSON.parse(analyses[1]),
    longevity_analysis: JSON.parse(analyses[2]),
  };
}

/**
 * Multi-Model Validation System
 * Cross-validates DNA analysis across 3 different AI models for accuracy
 * Ensures truthful, accurate genetic analysis through consensus
 *
 * @param {string} prompt - The DNA analysis prompt
 * @param {object} dnaData - The DNA markers to analyze
 * @param {number} requiredAgreement - Minimum agreement threshold (0.66 = 66% consensus)
 * @returns {object} Validated analysis with consensus findings and confidence scores
 */
export async function multiModelValidation(
  prompt,
  dnaData,
  requiredAgreement = 0.66,
) {
  console.log("🔬 Starting multi-model DNA validation across 3 AI models...");

  // Run analysis across 3 different AI models in parallel
  const analysisPromises = VALIDATION_MODELS.CONSENSUS_SET.map(
    async (modelId, index) => {
      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer":
                process.env.NEXT_PUBLIC_CREATE_APP_URL || "https://petdna.app",
              "X-Title": "Pet DNA Analyzer - Validation",
            },
            body: JSON.stringify({
              model: modelId,
              messages: [
                {
                  role: "system",
                  content:
                    "You are a veterinary geneticist. Analyze DNA data scientifically. Return JSON with: health_risks (array of strings), breed_likelihood (object with breed:percentage pairs), confidence (0-100), key_findings (array of strings). Be accurate and evidence-based.",
                },
                {
                  role: "user",
                  content: `${prompt}\n\nDNA Markers Found:\n${JSON.stringify(dnaData, null, 2)}`,
                },
              ],
              temperature: 0.2, // Very low temp for consistency
              max_tokens: 4000,
              response_format: { type: "json_object" },
            }),
          },
        );

        if (!response.ok) {
          console.warn(`Model ${index + 1} (${modelId}) validation failed`);
          return null;
        }

        const data = await response.json();
        const analysis = JSON.parse(data.choices[0].message.content);

        console.log(`✅ Model ${index + 1} completed analysis`);

        return {
          model: modelId,
          model_name: `Model ${index + 1}`,
          analysis: analysis,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        console.error(`Validation error for model ${index + 1}:`, error);
        return null;
      }
    },
  );

  const results = await Promise.all(analysisPromises);
  const validResults = results.filter((r) => r !== null);

  if (validResults.length < 2) {
    throw new Error(
      "Insufficient AI models responded for validation - need at least 2/3 models",
    );
  }

  console.log(
    `✅ ${validResults.length}/3 models completed DNA analysis successfully`,
  );

  // Build consensus from multiple model outputs
  const consensus = buildConsensus(validResults, requiredAgreement);

  return {
    validated_analysis: consensus.agreed_findings,
    confidence_score: consensus.confidence,
    model_agreement: consensus.agreement_percentage,
    individual_model_results: validResults.map((r) => ({
      model: r.model_name,
      findings: r.analysis,
    })),
    validation_passed: consensus.agreement_percentage >= requiredAgreement,
    discrepancies: consensus.discrepancies,
    validation_metadata: {
      models_used: validResults.map((r) => r.model_name),
      total_models: VALIDATION_MODELS.CONSENSUS_SET.length,
      successful_models: validResults.length,
      timestamp: new Date().toISOString(),
      required_agreement: (requiredAgreement * 100).toFixed(0) + "%",
      achieved_agreement:
        Math.round(consensus.agreement_percentage * 100) + "%",
      quality_score: calculateQualityScore(consensus, validResults.length),
    },
  };
}

/**
 * Build consensus from multiple AI model outputs
 * Aggregates findings that multiple models agree on
 */
function buildConsensus(results, requiredAgreement) {
  const healthRisks = {};
  const breedLikelihoods = {};
  const keyFindings = {};

  // Aggregate health risks across all models
  results.forEach((result) => {
    if (
      result.analysis.health_risks &&
      Array.isArray(result.analysis.health_risks)
    ) {
      result.analysis.health_risks.forEach((risk) => {
        const key = normalizeString(risk);
        if (!healthRisks[key]) {
          healthRisks[key] = { count: 0, original: risk };
        }
        healthRisks[key].count++;
      });
    }
  });

  // Aggregate breed predictions
  results.forEach((result) => {
    if (
      result.analysis.breed_likelihood &&
      typeof result.analysis.breed_likelihood === "object"
    ) {
      Object.entries(result.analysis.breed_likelihood).forEach(
        ([breed, percentage]) => {
          const normalizedBreed = normalizeString(breed);
          if (!breedLikelihoods[normalizedBreed]) {
            breedLikelihoods[normalizedBreed] = { values: [], original: breed };
          }
          breedLikelihoods[normalizedBreed].values.push(
            parseFloat(percentage) || 0,
          );
        },
      );
    }
  });

  // Aggregate key findings
  results.forEach((result) => {
    if (
      result.analysis.key_findings &&
      Array.isArray(result.analysis.key_findings)
    ) {
      result.analysis.key_findings.forEach((finding) => {
        const key = normalizeString(finding);
        if (!keyFindings[key]) {
          keyFindings[key] = { count: 0, original: finding };
        }
        keyFindings[key].count++;
      });
    }
  });

  const totalModels = results.length;
  const agreementThreshold = Math.ceil(totalModels * requiredAgreement);

  // Filter for consensus items (items that enough models agreed on)
  const agreedHealthRisks = Object.entries(healthRisks)
    .filter(([_, data]) => data.count >= agreementThreshold)
    .map(([_, data]) => ({
      risk: data.original,
      model_agreement: `${data.count}/${totalModels} models`,
      confidence: ((data.count / totalModels) * 100).toFixed(0) + "%",
    }))
    .sort((a, b) => parseInt(b.confidence) - parseInt(a.confidence));

  const agreedBreeds = Object.entries(breedLikelihoods)
    .filter(([_, data]) => data.values.length >= agreementThreshold)
    .map(([_, data]) => ({
      breed: data.original,
      average_percentage:
        (data.values.reduce((a, b) => a + b, 0) / data.values.length).toFixed(
          1,
        ) + "%",
      model_agreement: `${data.values.length}/${totalModels} models`,
      range: `${Math.min(...data.values).toFixed(1)}-${Math.max(...data.values).toFixed(1)}%`,
      consistency: calculateConsistency(data.values),
    }))
    .sort(
      (a, b) =>
        parseFloat(b.average_percentage) - parseFloat(a.average_percentage),
    );

  const agreedFindings = Object.entries(keyFindings)
    .filter(([_, data]) => data.count >= agreementThreshold)
    .map(([_, data]) => ({
      finding: data.original,
      model_agreement: `${data.count}/${totalModels} models`,
      confidence: ((data.count / totalModels) * 100).toFixed(0) + "%",
    }))
    .sort((a, b) => parseInt(b.confidence) - parseInt(a.confidence));

  // Calculate overall consensus agreement
  const totalItems =
    Object.keys(healthRisks).length +
    Object.keys(breedLikelihoods).length +
    Object.keys(keyFindings).length;
  const agreedItems =
    agreedHealthRisks.length + agreedBreeds.length + agreedFindings.length;
  const agreementPercentage = totalItems > 0 ? agreedItems / totalItems : 0;

  // Identify discrepancies (items where models disagreed)
  const discrepancies = {
    health_risks_disputed: Object.entries(healthRisks)
      .filter(([_, data]) => data.count < agreementThreshold && data.count > 0)
      .map(([_, data]) => ({
        risk: data.original,
        disagreement: `Only ${data.count}/${totalModels} models identified this - may be false positive`,
      })),

    breeds_disputed: Object.entries(breedLikelihoods)
      .filter(([_, data]) => data.values.length < agreementThreshold)
      .map(([_, data]) => ({
        breed: data.original,
        disagreement: `Only ${data.values.length}/${totalModels} models predicted this`,
        variance:
          data.values.length > 1
            ? (Math.max(...data.values) - Math.min(...data.values)).toFixed(1) +
              "%"
            : "N/A",
      })),

    findings_disputed: Object.entries(keyFindings)
      .filter(([_, data]) => data.count < agreementThreshold && data.count > 0)
      .map(([_, data]) => ({
        finding: data.original,
        disagreement: `Only ${data.count}/${totalModels} models reported this`,
      })),
  };

  return {
    agreed_findings: {
      health_risks: agreedHealthRisks,
      breed_composition: agreedBreeds,
      key_findings: agreedFindings,
    },
    confidence: Math.round(agreementPercentage * 100),
    agreement_percentage: agreementPercentage,
    discrepancies,
    consensus_summary: {
      total_agreed_items: agreedItems,
      total_disputed_items:
        healthRisks.length +
        breedLikelihoods.length +
        keyFindings.length -
        agreedItems,
      validation_strength:
        agreementPercentage >= 0.8
          ? "High"
          : agreementPercentage >= 0.6
            ? "Moderate"
            : "Low",
    },
  };
}

// Helper: Normalize strings for comparison (lowercase, trim, remove special chars)
function normalizeString(str) {
  if (typeof str !== "string") return JSON.stringify(str);
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "");
}

// Helper: Calculate consistency score for breed percentage predictions
function calculateConsistency(values) {
  if (values.length < 2) return "N/A";
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / mean) * 100;

  if (coefficientOfVariation < 10) return "Very High";
  if (coefficientOfVariation < 20) return "High";
  if (coefficientOfVariation < 30) return "Moderate";
  return "Low";
}

// Helper: Calculate overall quality score
function calculateQualityScore(consensus, modelsResponded) {
  const agreementScore = consensus.agreement_percentage * 50;
  const responseScore = (modelsResponded / 3) * 30;
  const confidenceScore = (consensus.confidence / 100) * 20;

  return Math.round(agreementScore + responseScore + confidenceScore);
}
