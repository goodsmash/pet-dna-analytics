import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  TrendingUp,
  Users,
  DollarSign,
  Database,
} from "lucide-react-native";
import {
  useFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
} from "@expo-google-fonts/instrument-sans";

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
  });

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["revenue-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/revenue-analytics");
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
          paddingBottom: 20,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E2E8F0",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 12 }}
        >
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "InstrumentSans_500Medium",
            fontSize: 28,
            color: "#0F172A",
            letterSpacing: -0.56,
          }}
        >
          Revenue Analytics
        </Text>
        <Text
          style={{
            fontFamily: "InstrumentSans_400Regular",
            fontSize: 14,
            color: "#64748B",
            marginTop: 4,
          }}
        >
          Last 30 days
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#0F172A" />
        ) : (
          <>
            {/* Key Metrics */}
            <View style={{ gap: 12, marginBottom: 32 }}>
              <View
                style={{
                  backgroundColor: "#DCFCE7",
                  padding: 20,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#86EFAC",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <DollarSign size={20} color="#15803D" />
                  <Text
                    style={{
                      fontFamily: "InstrumentSans_500Medium",
                      fontSize: 14,
                      color: "#15803D",
                    }}
                  >
                    ESTIMATED REVENUE
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: "InstrumentSans_500Medium",
                    fontSize: 36,
                    color: "#15803D",
                  }}
                >
                  ${analytics?.estimatedRevenue || "0.00"}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 8,
                    }}
                  >
                    <TrendingUp size={16} color="#0F172A" />
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_500Medium",
                        fontSize: 12,
                        color: "#64748B",
                      }}
                    >
                      TOTAL ANALYSES
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: "InstrumentSans_500Medium",
                      fontSize: 28,
                      color: "#0F172A",
                    }}
                  >
                    {analytics?.metrics?.totalAnalyses || 0}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#FFFFFF",
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 8,
                    }}
                  >
                    <Users size={16} color="#0F172A" />
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_500Medium",
                        fontSize: 12,
                        color: "#64748B",
                      }}
                    >
                      UNIQUE PETS
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: "InstrumentSans_500Medium",
                      fontSize: 28,
                      color: "#0F172A",
                    }}
                  >
                    {analytics?.metrics?.uniquePets || 0}
                  </Text>
                </View>
              </View>
            </View>

            {/* Analysis by Tier */}
            <Text
              style={{
                fontFamily: "InstrumentSans_500Medium",
                fontSize: 14,
                color: "#64748B",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              ANALYSES BY TIER
            </Text>
            <View style={{ gap: 12, marginBottom: 32 }}>
              {analytics?.analysisByTier?.map((tier) => (
                <View
                  key={tier.tier}
                  style={{
                    backgroundColor: "#FFFFFF",
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_500Medium",
                        fontSize: 16,
                        color: "#0F172A",
                      }}
                    >
                      {tier.tier}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_400Regular",
                        fontSize: 13,
                        color: "#64748B",
                        marginTop: 2,
                      }}
                    >
                      {tier.unique_pets} unique pets
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: "InstrumentSans_500Medium",
                      fontSize: 20,
                      color: "#0F172A",
                    }}
                  >
                    {tier.count}
                  </Text>
                </View>
              ))}
            </View>

            {/* Data Consent Stats */}
            <Text
              style={{
                fontFamily: "InstrumentSans_500Medium",
                fontSize: 14,
                color: "#64748B",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              RESEARCH DATA CONSENT
            </Text>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                padding: 20,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E2E8F0",
              }}
            >
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontFamily: "InstrumentSans_500Medium",
                      fontSize: 32,
                      color: "#16A34A",
                    }}
                  >
                    {analytics?.consentStats?.consented || 0}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "InstrumentSans_400Regular",
                      fontSize: 13,
                      color: "#64748B",
                      marginTop: 4,
                    }}
                  >
                    Consented
                  </Text>
                </View>
                <View style={{ width: 1, backgroundColor: "#E2E8F0" }} />
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontFamily: "InstrumentSans_500Medium",
                      fontSize: 32,
                      color: "#DC2626",
                    }}
                  >
                    {analytics?.consentStats?.declined || 0}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "InstrumentSans_400Regular",
                      fontSize: 13,
                      color: "#64748B",
                      marginTop: 4,
                    }}
                  >
                    Declined
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
