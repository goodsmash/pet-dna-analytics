// Smart Notification System
// Health alerts, medication reminders, genetic milestone notifications

import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { userId, petId, notificationType, customMessage, scheduleDate } =
      await request.json();

    // Notification types:
    // - health_alert: Genetic health risk detected
    // - medication_reminder: Time for medication/preventive care
    // - milestone: Pet reached age milestone
    // - report_ready: DNA analysis complete
    // - subscription_expiring: Subscription ending soon
    // - breeding_season: Optimal breeding time based on genetics
    // - environmental_alert: Weather/environment risk for pet

    const notification = {
      user_id: userId,
      pet_id: petId,
      type: notificationType,
      message: customMessage || generateNotificationMessage(notificationType),
      scheduled_for: scheduleDate || new Date(),
      sent: false,
      created_at: new Date(),
    };

    // Store notification
    const [created] = await sql`
      INSERT INTO usage_tracking (event_type, user_id, metadata)
      VALUES ('notification_created', ${userId}, ${JSON.stringify(notification)})
      RETURNING *
    `;

    // In production, integrate with:
    // - Expo Push Notifications for mobile
    // - Email service (SendGrid, Resend)
    // - SMS service (Twilio)

    return Response.json({
      success: true,
      notification_id: created.id,
      message: "Notification scheduled successfully",
    });
  } catch (error) {
    console.error("Notification error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Generate smart notifications based on genetic data
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const petId = searchParams.get("petId");

  if (!petId) {
    return Response.json({ error: "Missing petId" }, { status: 400 });
  }

  // Get latest DNA report
  const [report] = await sql`
    SELECT dr.*, p.name, p.species, p.created_at as pet_birthday
    FROM dna_reports dr
    JOIN pets p ON dr.pet_id = p.id
    WHERE dr.pet_id = ${petId}
    ORDER BY dr.created_at DESC
    LIMIT 1
  `;

  if (!report) {
    return Response.json({ notifications: [] });
  }

  const analysis = report.analysis_json;
  const smartNotifications = [];

  // Generate health alerts based on genetics
  if (analysis.health_predispositions) {
    const highRiskConditions = analysis.health_predispositions.filter(
      (condition) =>
        typeof condition === "string" &&
        (condition.toLowerCase().includes("high risk") ||
          condition.toLowerCase().includes("carrier")),
    );

    highRiskConditions.forEach((condition) => {
      smartNotifications.push({
        type: "health_alert",
        priority: "high",
        title: "Genetic Health Alert",
        message: `${report.name} has genetic markers for: ${condition}. Consult your vet for screening recommendations.`,
        action: "View full report",
        icon: "🏥",
      });
    });
  }

  // Medication reminders based on pharmacogenomics
  if (analysis.pharmacogenomics) {
    smartNotifications.push({
      type: "medication_reminder",
      priority: "medium",
      title: "Medication Safety",
      message: `Review pharmacogenomics data before administering new medications to ${report.name}`,
      action: "View drug safety report",
      icon: "💊",
    });
  }

  // Age milestone notifications
  const petAgeYears = calculateAge(report.pet_birthday);
  if (petAgeYears >= 7 && report.species.toLowerCase() === "dog") {
    smartNotifications.push({
      type: "milestone",
      priority: "medium",
      title: "Senior Pet Care",
      message: `${report.name} has reached senior age. Consider increased health screenings based on genetic profile.`,
      action: "View aging recommendations",
      icon: "🎂",
    });
  }

  // Environmental alerts
  if (analysis.environmental_risk_factors) {
    smartNotifications.push({
      type: "environmental_alert",
      priority: "low",
      title: "Weather Alert",
      message: `Temperature extremes predicted. ${report.name}'s genetics indicate heat/cold sensitivity.`,
      action: "View environmental recommendations",
      icon: "🌡️",
    });
  }

  // Breeding season (for intact pets)
  if (analysis.reproductive_traits) {
    smartNotifications.push({
      type: "breeding_season",
      priority: "low",
      title: "Breeding Season",
      message: `Optimal breeding period approaching based on ${report.name}'s genetic profile`,
      action: "View breeding compatibility",
      icon: "🐾",
    });
  }

  return Response.json({
    notifications: smartNotifications,
    total: smartNotifications.length,
    pet_name: report.name,
  });
}

function generateNotificationMessage(type) {
  const messages = {
    health_alert:
      "Important: New genetic health information available for your pet",
    medication_reminder: "Time for preventive care medication",
    milestone: "Your pet has reached an important age milestone",
    report_ready: "Your DNA analysis report is ready!",
    subscription_expiring: "Your premium subscription expires soon",
    breeding_season: "Optimal breeding window approaching",
    environmental_alert: "Environmental conditions may affect your pet",
  };

  return messages[type] || "New notification from Pet DNA Analyzer";
}

function calculateAge(birthday) {
  const now = new Date();
  const birth = new Date(birthday);
  const ageMs = now - birth;
  return ageMs / (1000 * 60 * 60 * 24 * 365.25);
}
