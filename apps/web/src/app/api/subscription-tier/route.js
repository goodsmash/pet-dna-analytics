export async function GET(request) {
  // Mock tier response
  // In a real app, this would check the user's subscription status via RevenueCat/Stripe
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "default_user";

  // Hardcode a default tier for development
  return Response.json({
    tier: "FREE",
    userId,
    entitlements: ["basic_analysis"],
  });
}
