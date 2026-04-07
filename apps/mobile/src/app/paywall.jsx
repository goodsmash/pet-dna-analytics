import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { X, Check, Sparkles, Zap, Crown } from "lucide-react-native";
import {
  useFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
} from "@expo-google-fonts/instrument-sans";

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState("PRO");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
  });

  if (!fontsLoaded) return null;

  const tiers = [
    {
      id: "PRO",
      name: "Pro",
      icon: Zap,
      price: "$9.99",
      period: "/month",
      color: "#3B82F6",
      features: [
        "12 genetic analysis categories",
        "Health predispositions",
        "Behavioral trait analysis",
        "Coat & size predictions",
        "Priority AI processing",
        "Unlimited analyses",
      ],
    },
    {
      id: "ULTRA",
      name: "Ultra",
      icon: Crown,
      price: "$24.99",
      period: "/month",
      color: "#8B5CF6",
      popular: true,
      features: [
        "All Pro features",
        "22+ genetic categories",
        "Multi-agent AI analysis",
        "Pharmacogenomics insights",
        "Longevity predictions",
        "PDF report exports",
        "AI chat assistant",
        "Ancestry & lineage tracking",
      ],
    },
  ];

  const handlePurchase = async () => {
    setIsPurchasing(true);
    // TODO: Integrate with RevenueCat
    // For now, simulate purchase
    setTimeout(() => {
      setIsPurchasing(false);
      router.back();
    }, 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Sparkles size={48} color="#FFFFFF" strokeWidth={1.5} />
          <Text
            style={{
              fontFamily: "InstrumentSans_500Medium",
              fontSize: 32,
              color: "#FFFFFF",
              textAlign: "center",
              marginTop: 16,
              letterSpacing: -0.64,
            }}
          >
            Unlock Premium Analysis
          </Text>
          <Text
            style={{
              fontFamily: "InstrumentSans_400Regular",
              fontSize: 16,
              color: "#94A3B8",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Get the most comprehensive genetic insights for your pet
          </Text>
        </View>

        {/* Tier Cards */}
        <View style={{ gap: 16, marginBottom: 32 }}>
          {tiers.map((tier) => {
            const IconComponent = tier.icon;
            const isSelected = selectedTier === tier.id;

            return (
              <TouchableOpacity
                key={tier.id}
                onPress={() => setSelectedTier(tier.id)}
                style={{
                  backgroundColor: isSelected ? "#1E293B" : "#0F172A",
                  padding: 24,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: isSelected ? tier.color : "#334155",
                }}
              >
                {tier.popular && (
                  <View
                    style={{
                      position: "absolute",
                      top: -10,
                      right: 20,
                      backgroundColor: tier.color,
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_500Medium",
                        fontSize: 11,
                        color: "#FFFFFF",
                      }}
                    >
                      MOST POPULAR
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: tier.color + "20",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconComponent
                        size={24}
                        color={tier.color}
                        strokeWidth={1.5}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontFamily: "InstrumentSans_500Medium",
                          fontSize: 24,
                          color: "#FFFFFF",
                        }}
                      >
                        {tier.name}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "baseline" }}
                      >
                        <Text
                          style={{
                            fontFamily: "InstrumentSans_500Medium",
                            fontSize: 20,
                            color: "#FFFFFF",
                          }}
                        >
                          {tier.price}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "InstrumentSans_400Regular",
                            fontSize: 14,
                            color: "#94A3B8",
                          }}
                        >
                          {tier.period}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isSelected ? tier.color : "#334155",
                      backgroundColor: isSelected ? tier.color : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isSelected && (
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </View>
                </View>

                <View style={{ gap: 10 }}>
                  {tier.features.map((feature, idx) => (
                    <View
                      key={idx}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Check size={16} color={tier.color} strokeWidth={2} />
                      <Text
                        style={{
                          fontFamily: "InstrumentSans_400Regular",
                          fontSize: 14,
                          color: "#CBD5E1",
                          flex: 1,
                        }}
                      >
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={isPurchasing}
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: 18,
            borderRadius: 12,
            alignItems: "center",
            opacity: isPurchasing ? 0.7 : 1,
          }}
        >
          {isPurchasing ? (
            <ActivityIndicator color="#0F172A" />
          ) : (
            <Text
              style={{
                fontFamily: "InstrumentSans_500Medium",
                fontSize: 16,
                color: "#0F172A",
              }}
            >
              Start {selectedTier} Subscription
            </Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <Text
          style={{
            fontFamily: "InstrumentSans_400Regular",
            fontSize: 12,
            color: "#64748B",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Cancel anytime. Auto-renews monthly.
        </Text>
      </ScrollView>
    </View>
  );
}
