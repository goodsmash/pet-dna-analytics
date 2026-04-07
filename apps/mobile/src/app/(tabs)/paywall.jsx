// Premium Subscription Paywall - RevenueCat Integration
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, Check, Crown, Sparkles, Zap, Star } from "lucide-react-native";
import useInAppPurchase from "@/utils/useInAppPurchase";

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    isReady,
    getAvailableSubscriptions,
    startSubscription,
    isPurchasing,
    currentTier,
  } = useInAppPurchase();

  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (isReady) {
      try {
        const available = getAvailableSubscriptions();
        setSubscriptions(available);
        if (available.length > 0) {
          setSelectedPlan(available[1] || available[0]); // Default to PRO tier
        }
      } catch (error) {
        console.log("No subscriptions available yet");
      }
    }
  }, [isReady]);

  const handlePurchase = async () => {
    if (!selectedPlan) return;

    const success = await startSubscription({
      subscription: selectedPlan,
      userId: "current_user_id", // Replace with actual user ID from auth
    });

    if (success) {
      router.back();
    }
  };

  const features = {
    FREE: [
      "Basic breed composition",
      "3 genetic categories",
      "Basic health notes",
      "Community support",
    ],
    PRO: [
      "Everything in FREE",
      "12 genetic categories",
      "Health predispositions",
      "Behavioral analysis",
      "Vocal genetics",
      "Coat & physical traits",
      "Dietary recommendations",
      "Email support",
    ],
    ULTRA: [
      "Everything in PRO",
      "25+ genetic categories",
      "Multi-agent AI analysis",
      "Pharmacogenomics (drug safety)",
      "Longitudinal health tracking",
      "Breeding compatibility",
      "Environmental risk assessment",
      "Export PDF reports",
      "Share with veterinarian",
      "Priority support",
      "Early access to features",
    ],
  };

  const tierIcons = {
    FREE: <Star size={32} color="#6B7280" />,
    PRO: <Zap size={32} color="#3B82F6" />,
    ULTRA: <Crown size={32} color="#F59E0B" />,
  };

  const tierColors = {
    FREE: "#6B7280",
    PRO: "#3B82F6",
    ULTRA: "#F59E0B",
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#FFF" }}>
              Unlock Premium
            </Text>
            <Text style={{ fontSize: 16, color: "#9CA3AF", marginTop: 4 }}>
              Advanced DNA analysis for your pet
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <X size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 180, // FIXED: Space for bottom CTA + extra padding
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Plans */}
        <View style={{ paddingHorizontal: 20 }}>
          {["FREE", "PRO", "ULTRA"].map((tier) => {
            const isSelected = selectedPlan?.identifier?.includes(
              tier.toLowerCase(),
            );
            const subscription = subscriptions.find((s) =>
              s.identifier.toLowerCase().includes(tier.toLowerCase()),
            );

            return (
              <TouchableOpacity
                key={tier}
                onPress={() => subscription && setSelectedPlan(subscription)}
                style={{
                  backgroundColor: isSelected
                    ? tierColors[tier] + "20"
                    : "#1F2937",
                  borderWidth: 2,
                  borderColor: isSelected ? tierColors[tier] : "#374151",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 16,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    {tierIcons[tier]}
                    <View>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "bold",
                          color: "#FFF",
                        }}
                      >
                        {tier}
                      </Text>
                      {tier === "ULTRA" && (
                        <View
                          style={{
                            backgroundColor: tierColors.ULTRA,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 4,
                            marginTop: 4,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "bold",
                              color: "#000",
                            }}
                          >
                            MOST POPULAR
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {subscription && (
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: "bold",
                          color: "#FFF",
                        }}
                      >
                        {subscription.product.priceString}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                        /month
                      </Text>
                    </View>
                  )}

                  {tier === "FREE" && (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: "#10B981",
                      }}
                    >
                      Current Plan
                    </Text>
                  )}
                </View>

                {/* Features */}
                <View style={{ marginTop: 8 }}>
                  {features[tier].map((feature, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                        gap: 8,
                      }}
                    >
                      <Check size={16} color={tierColors[tier]} />
                      <Text style={{ fontSize: 14, color: "#D1D5DB", flex: 1 }}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Trust Badges */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View
            style={{
              backgroundColor: "#1F2937",
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: "#374151",
            }}
          >
            <Text style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 20 }}>
              ✓ Powered by real NCBI genetic data{"\n"}✓ Cancel anytime{"\n"}✓
              Secure payment via App Store{"\n"}✓ Used by 10,000+ pet owners
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA - with semi-transparent background */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#000", // SOLID background
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: "#374151",
          // ADDED: Shadow for depth
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={!selectedPlan || isPurchasing || !isReady}
          style={{
            backgroundColor: selectedPlan
              ? tierColors[
                  selectedPlan.identifier.includes("ultra") ? "ULTRA" : "PRO"
                ]
              : "#374151",
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            opacity: !selectedPlan || isPurchasing || !isReady ? 0.5 : 1,
          }}
        >
          {isPurchasing ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FFF" }}>
                {selectedPlan ? "Subscribe Now" : "Select a Plan"}
              </Text>
              {selectedPlan && (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#FFF",
                    marginTop: 4,
                    opacity: 0.8,
                  }}
                >
                  7-day free trial • Cancel anytime
                </Text>
              )}
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 12, alignItems: "center" }}
        >
          <Text style={{ fontSize: 14, color: "#9CA3AF" }}>
            Continue with FREE plan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
