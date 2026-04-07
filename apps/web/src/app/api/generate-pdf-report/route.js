import sql from "@/app/api/utils/sql";

/**
 * Generate PDF Report for DNA Analysis
 * Creates a beautiful, professional PDF with validation badges
 */
export async function POST(request) {
  try {
    const { reportId } = await request.json();

    if (!reportId) {
      return Response.json({ error: "Missing reportId" }, { status: 400 });
    }

    // Fetch report data
    const reports = await sql`
      SELECT r.*, p.name, p.species, p.breed_hint
      FROM dna_reports r
      JOIN pets p ON r.pet_id = p.id
      WHERE r.id = ${reportId}
    `;

    if (reports.length === 0) {
      return Response.json({ error: "Report not found" }, { status: 404 });
    }

    const report = reports[0];
    const analysis = report.analysis_json;

    // Build HTML for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      padding: 40px;
      color: #1a1a1a;
      line-height: 1.6;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #3b82f6;
    }
    .logo {
      font-size: 36px;
      font-weight: 800;
      color: #3b82f6;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 14px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .pet-info {
      background: #f3f4f6;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 30px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .info-item {
      padding: 12px;
      background: white;
      border-radius: 8px;
    }
    .info-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .tier-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .tier-free { background: #e5e7eb; color: #4b5563; }
    .tier-pro { background: #dbeafe; color: #1e40af; }
    .tier-ultra { background: #fef3c7; color: #92400e; }
    .validation-badge {
      display: inline-block;
      padding: 6px 12px;
      background: #d1fae5;
      color: #065f46;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 10px;
    }
    .section {
      margin-bottom: 32px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .breed-card {
      background: #f9fafb;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 16px;
      border-left: 4px solid #3b82f6;
    }
    .breed-name {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    .breed-percentage {
      font-size: 32px;
      font-weight: 800;
      color: #3b82f6;
      margin-bottom: 4px;
    }
    .risk-list {
      list-style: none;
    }
    .risk-item {
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .risk-high { background: #fee2e2; border-left: 4px solid #dc2626; }
    .risk-moderate { background: #fef3c7; border-left: 4px solid #f59e0b; }
    .risk-low { background: #dbeafe; border-left: 4px solid #3b82f6; }
    .risk-icon {
      font-size: 20px;
    }
    .trait-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .trait-card {
      background: #f9fafb;
      padding: 16px;
      border-radius: 8px;
    }
    .trait-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .trait-value {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .recommendation {
      background: #eff6ff;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 12px;
      border-left: 4px solid #3b82f6;
    }
    .footer {
      margin-top: 60px;
      padding-top: 24px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    .validation-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 32px;
    }
    .validation-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .validation-stats {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
    }
    .validation-stat {
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      padding: 12px;
      border-radius: 8px;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .stat-label {
      font-size: 12px;
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🧬 Pet DNA Analysis</div>
    <div class="subtitle">Professional Genetic Report</div>
  </div>

  <div class="pet-info">
    <div class="info-item">
      <div class="info-label">Pet Name</div>
      <div class="info-value">${report.name}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Species</div>
      <div class="info-value">${report.species.charAt(0).toUpperCase() + report.species.slice(1)}</div>
    </div>
    <div class="info-item">
      <div class="info-label">Analysis Tier</div>
      <div class="info-value">
        <span class="tier-badge tier-${report.tier.toLowerCase()}">${report.tier}</span>
        ${report.validation_confidence ? '<span class="validation-badge">✓ AI Validated</span>' : ""}
      </div>
    </div>
    <div class="info-item">
      <div class="info-label">Report Date</div>
      <div class="info-value">${new Date(report.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    </div>
  </div>

  ${
    report.validation_confidence
      ? `
  <div class="validation-section">
    <div class="validation-title">🔬 Multi-Model AI Validation</div>
    <div class="validation-stats">
      <div class="validation-stat">
        <div class="stat-value">${report.validation_confidence}%</div>
        <div class="stat-label">Confidence</div>
      </div>
      <div class="validation-stat">
        <div class="stat-value">${report.validation_agreement}</div>
        <div class="stat-label">AI Agreement</div>
      </div>
      <div class="validation-stat">
        <div class="stat-value">${report.quality_score}/100</div>
        <div class="stat-label">DNA Quality</div>
      </div>
    </div>
    <p style="margin-top: 16px; font-size: 14px; opacity: 0.9;">
      This analysis was validated across 3 independent AI models (Google Gemini, Meta Llama, Qwen) for maximum accuracy.
    </p>
  </div>
  `
      : ""
  }

  <div class="section">
    <div class="section-title">🐕 Breed Composition</div>
    ${
      analysis.breed_composition
        ? `
      <div class="breed-card">
        <div class="breed-name">${analysis.breed_composition.primary_breed}</div>
        <div class="breed-percentage">${analysis.breed_composition.percentage}%</div>
        <div style="font-size: 14px; color: #6b7280;">Primary Breed</div>
      </div>
      ${
        analysis.breed_composition.secondary_breeds
          ?.map(
            (breed) => `
        <div class="breed-card" style="border-left-color: #9ca3af;">
          <div class="breed-name">${breed.breed}</div>
          <div class="breed-percentage" style="color: #6b7280; font-size: 24px;">${breed.percentage}%</div>
        </div>
      `,
          )
          .join("") || ""
      }
    `
        : "<p>No breed data available</p>"
    }
  </div>

  <div class="section">
    <div class="section-title">⚕️ Health Analysis</div>
    ${
      analysis.health_analysis
        ? `
      ${
        analysis.health_analysis.high_risk?.length > 0
          ? `
        <h4 style="margin-bottom: 12px; color: #dc2626;">High Risk Conditions</h4>
        <ul class="risk-list">
          ${analysis.health_analysis.high_risk
            .map(
              (risk) => `
            <li class="risk-item risk-high">
              <span class="risk-icon">⚠️</span>
              <span>${risk}</span>
            </li>
          `,
            )
            .join("")}
        </ul>
      `
          : ""
      }
      
      ${
        analysis.health_analysis.moderate_risk?.length > 0
          ? `
        <h4 style="margin: 24px 0 12px; color: #f59e0b;">Moderate Risk Conditions</h4>
        <ul class="risk-list">
          ${analysis.health_analysis.moderate_risk
            .map(
              (risk) => `
            <li class="risk-item risk-moderate">
              <span class="risk-icon">⚡</span>
              <span>${risk}</span>
            </li>
          `,
            )
            .join("")}
        </ul>
      `
          : ""
      }
      
      ${
        analysis.health_analysis.low_risk?.length > 0
          ? `
        <h4 style="margin: 24px 0 12px; color: #3b82f6;">Low Risk / Monitoring</h4>
        <ul class="risk-list">
          ${analysis.health_analysis.low_risk
            .map(
              (risk) => `
            <li class="risk-item risk-low">
              <span class="risk-icon">ℹ️</span>
              <span>${risk}</span>
            </li>
          `,
            )
            .join("")}
        </ul>
      `
          : ""
      }
    `
        : "<p>No health data available</p>"
    }
  </div>

  <div class="section">
    <div class="section-title">✨ Genetic Traits</div>
    ${
      analysis.genetic_traits
        ? `
      <div class="trait-grid">
        <div class="trait-card">
          <div class="trait-label">Coat Color</div>
          <div class="trait-value">${analysis.genetic_traits.coat_color || "Unknown"}</div>
        </div>
        <div class="trait-card">
          <div class="trait-label">Coat Type</div>
          <div class="trait-value">${analysis.genetic_traits.coat_type || "Unknown"}</div>
        </div>
        <div class="trait-card">
          <div class="trait-label">Size Prediction</div>
          <div class="trait-value">${analysis.genetic_traits.size_prediction || "Unknown"}</div>
        </div>
        <div class="trait-card">
          <div class="trait-label">Temperament</div>
          <div class="trait-value">${analysis.genetic_traits.temperament || "Unknown"}</div>
        </div>
      </div>
    `
        : "<p>No trait data available</p>"
    }
  </div>

  <div class="section">
    <div class="section-title">💊 Preventive Care Recommendations</div>
    ${
      analysis.preventive_care
        ? `
      ${
        analysis.preventive_care.screening_recommendations?.length > 0
          ? `
        <h4 style="margin-bottom: 12px;">Recommended Screenings</h4>
        ${analysis.preventive_care.screening_recommendations
          .map(
            (rec) => `
          <div class="recommendation">
            <strong>📋</strong> ${rec}
          </div>
        `,
          )
          .join("")}
      `
          : ""
      }
      
      ${
        analysis.preventive_care.exercise_recommendations
          ? `
        <h4 style="margin: 24px 0 12px;">Exercise Recommendations</h4>
        <div class="recommendation">
          <strong>🏃</strong> ${analysis.preventive_care.exercise_recommendations}
        </div>
      `
          : ""
      }
    `
        : "<p>No preventive care data available</p>"
    }
  </div>

  ${
    analysis.interpretation
      ? `
  <div class="section">
    <div class="section-title">📊 Overall Interpretation</div>
    <div style="background: #f9fafb; padding: 20px; border-radius: 12px; line-height: 1.8;">
      ${analysis.interpretation}
    </div>
  </div>
  `
      : ""
  }

  <div class="footer">
    <p><strong>Pet DNA Analysis Report</strong> • Report ID: ${reportId}</p>
    <p style="margin-top: 8px;">This report is for informational purposes only and should not replace professional veterinary advice.</p>
    <p style="margin-top: 8px;">Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
  </div>
</body>
</html>
    `;

    // For now, return the HTML (you can integrate with a PDF generation service)
    // In production, you'd use puppeteer, playwright, or a service like PDFShift
    return new Response(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="dna-report-${reportId}.html"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return Response.json(
      { error: error.message || "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
