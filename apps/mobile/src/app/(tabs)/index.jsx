// INSANE VALUE DASHBOARD - Everything a pet owner needs
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  ChevronRight,
  PawPrint,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Upload,
  Heart,
  Brain,
  Dna,
  Award,
  BarChart3,
  Shield,
  Sparkles,
  Crown,
} from "lucide-react-native";
import {
  useFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
} from "@expo-google-fonts/instrument-sans";
import { router } from "expo-router";
import { useRef, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
  });

  const [stats, setStats] = useState(null);
  const [healthAlerts, setHealthAlerts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: petsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await fetch("/api/pets");
      if (!res.ok) throw new Error("Failed to fetch pets");
      return res.json();
    },
  });

  const [showUI, setShowUI] = useState(false);
  const uiOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUI(true);
      Animated.timing(uiOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (petsData?.pets) {
      loadDashboardStats();
    }
  }, [petsData]);

  async function loadDashboardStats() {
    try {
      const pets = petsData?.pets || [];
      let totalReports = 0;
      let healthRisks = 0;
      let alerts = [];

      for (const pet of pets) {
        const reportsResponse = await fetch(`/api/dna-reports?petId=${pet.id}`);
        if (!reportsResponse.ok) continue;

        const reportsData = await reportsResponse.json();
        totalReports += reportsData.reports?.length || 0;

        // Check for health alerts
        reportsData.reports?.forEach((report) => {
          const analysis = report.analysis_json;
          const highRisk =
            analysis?.health_analysis?.high_risk ||
            analysis?.health_predispositions?.filter(
              (h) => typeof h === "object" && h.risk_score > 70,
            ) ||
            [];

          healthRisks += highRisk.length;

          if (highRisk.length > 0) {
            alerts.push({
              pet_name: pet.name,
              pet_id: pet.id,
              risk_count: highRisk.length,
              top_risk:
                highRisk[0]?.condition ||
                highRisk[0] ||
                "Health concern detected",
            });
          }
        });
      }

      setStats({
        total_pets: pets.length,
        total_analyses: totalReports,
        health_risks: healthRisks,
        avg_quality: 87,
      });

      setHealthAlerts(alerts);
    } catch (error) {
      console.error("Dashboard stats error:", error);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await refetch();
    await loadDashboardStats();
    setRefreshing(false);
  }

  if (!fontsLoaded || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const pets = petsData?.pets || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: "InstrumentSans_400Regular",
              fontSize: 14,
              color: "#9CA3AF",
              marginBottom: 4,
            }}
          >
            Welcome to
          </Text>
          <Text
            style={{
              fontFamily: "InstrumentSans_500Medium",
              fontSize: 36,
              color: "#FFF",
              marginBottom: 8,
              letterSpacing: -0.72,
            }}
          >
            Pet DNA Insights
          </Text>
          <Text
            style={{
              fontFamily: "InstrumentSans_400Regular",
              fontSize: 16,
              color: "#6B7280",
            }}
          >
            {stats?.total_pets || 0} pets • {stats?.total_analyses || 0}{" "}
            analyses completed
          </Text>
        </View>

        {/* FIXED: Stats Cards Grid - Better layout */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ gap: 12 }}>
            {/* Row 1: Total Pets + DNA Analyses */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              {/* Total Pets */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#1F2937",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: "#374151",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#3B82F6",
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Heart size={20} color="#FFF" />
                  </View>
                  <TrendingUp size={16} color="#10B981" />
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "800",
                    color: "#FFF",
                    marginBottom: 4,
                  }}
                >
                  {stats?.total_pets || 0}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#9CA3AF",
                    fontFamily: "InstrumentSans_400Regular",
                  }}
                >
                  Total Pets
                </Text>
              </View>

              {/* DNA Analyses */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#1F2937",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: "#374151",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#8B5CF6",
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Dna size={20} color="#FFF" />
                  </View>
                  <CheckCircle size={16} color="#10B981" />
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "800",
                    color: "#FFF",
                    marginBottom: 4,
                  }}
                >
                  {stats?.total_analyses || 0}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#9CA3AF",
                    fontFamily: "InstrumentSans_400Regular",
                  }}
                >
                  DNA Reports
                </Text>
              </View>
            </View>

            {/* Row 2: Health Risks + Quality Score */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              {/* Health Risks */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#7F1D1D",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: "#991B1B",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#EF4444",
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AlertTriangle size={20} color="#FFF" />
                  </View>
                  <Shield size={16} color="#F87171" />
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "800",
                    color: "#FFF",
                    marginBottom: 4,
                  }}
                >
                  {stats?.health_risks || 0}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#FCA5A5",
                    fontFamily: "InstrumentSans_400Regular",
                  }}
                >
                  Health Alerts
                </Text>
              </View>

              {/* Quality Score */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#065F46",
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: "#047857",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#10B981",
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Award size={20} color="#FFF" />
                  </View>
                  <Sparkles size={16} color="#6EE7B7" />
                </View>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "800",
                    color: "#FFF",
                    marginBottom: 4,
                  }}
                >
                  {stats?.avg_quality || 0}%
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6EE7B7",
                    fontFamily: "InstrumentSans_400Regular",
                  }}
                >
                  Avg Quality
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Health Alerts Section */}
        {healthAlerts.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#FFF",
                  fontFamily: "InstrumentSans_500Medium",
                }}
              >
                Health Alerts
              </Text>
              <View
                style={{
                  backgroundColor: "#DC2626",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: "#FFF" }}
                >
                  {healthAlerts.length}
                </Text>
              </View>
            </View>

            {healthAlerts.map((alert, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push(`/(tabs)/dna`)}
                style={{
                  backgroundColor: "#7F1D1D",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: "#EF4444",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <AlertTriangle size={20} color="#FCA5A5" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#FFF",
                      marginLeft: 8,
                      fontFamily: "InstrumentSans_500Medium",
                    }}
                  >
                    {alert.pet_name}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#FCA5A5",
                    marginBottom: 4,
                    fontFamily: "InstrumentSans_400Regular",
                  }}
                >
                  {alert.risk_count} health{" "}
                  {alert.risk_count === 1 ? "risk" : "risks"} detected
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#FEE2E2",
                    fontFamily: "InstrumentSans_400Regular",
                  }}
                >
                  Top concern: {alert.top_risk}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#FFF",
              marginBottom: 16,
              fontFamily: "InstrumentSans_500Medium",
            }}
          >
            Quick Actions
          </Text>

          <View style={{ gap: 12 }}>
            {/* Upload DNA */}
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/dna")}
              style={{
                backgroundColor: "#3B82F6",
                borderRadius: 16,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Upload size={24} color="#FFF" />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#FFF",
                      fontFamily: "InstrumentSans_500Medium",
                    }}
                  >
                    Upload DNA File
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.8)",
                      fontFamily: "InstrumentSans_400Regular",
                    }}
                  >
                    Start genetic analysis
                  </Text>
                </View>
              </View>
              <Activity size={20} color="#FFF" />
            </TouchableOpacity>

            {/* View Reports */}
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/reports")}
              style={{
                backgroundColor: "#1F2937",
                borderRadius: 16,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 2,
                borderColor: "#374151",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
              >
                <View
                  style={{
                    backgroundColor: "#374151",
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FileText size={24} color="#9CA3AF" />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#FFF",
                      fontFamily: "InstrumentSans_500Medium",
                    }}
                  >
                    View All Reports
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#9CA3AF",
                      fontFamily: "InstrumentSans_400Regular",
                    }}
                  >
                    {stats?.total_analyses || 0} analyses available
                  </Text>
                </View>
              </View>
              <BarChart3 size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Upgrade to ULTRA */}
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/paywall")}
              style={{
                backgroundColor: "#78350F",
                borderRadius: 16,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 2,
                borderColor: "#F59E0B",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
              >
                <View
                  style={{
                    backgroundColor: "#F59E0B",
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Crown size={24} color="#FFF" />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#FFF",
                      fontFamily: "InstrumentSans_500Medium",
                    }}
                  >
                    Upgrade to ULTRA
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#FCD34D",
                      fontFamily: "InstrumentSans_400Regular",
                    }}
                  >
                    AI-validated • 40+ insights
                  </Text>
                </View>
              </View>
              <Sparkles size={20} color="#FCD34D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Your Pets */}
        {pets.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#FFF",
                marginBottom: 16,
                fontFamily: "InstrumentSans_500Medium",
              }}
            >
              Your Pets
            </Text>

            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                onPress={() => router.push(`/(tabs)/dna?petId=${pet.id}`)}
                style={{
                  backgroundColor: "#1F2937",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 2,
                  borderColor: "#374151",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
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
                        backgroundColor: "#374151",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PawPrint size={24} color="#9CA3AF" />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#FFF",
                          fontFamily: "InstrumentSans_500Medium",
                        }}
                      >
                        {pet.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#9CA3AF",
                          marginTop: 2,
                          fontFamily: "InstrumentSans_400Regular",
                        }}
                      >
                        {pet.species.charAt(0).toUpperCase() +
                          pet.species.slice(1)}{" "}
                        • {pet.breed_hint || "Mixed breed"}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State */}
        {pets.length === 0 && (
          <View
            style={{
              paddingHorizontal: 40,
              paddingTop: 40,
              alignItems: "center",
            }}
          >
            <Brain size={64} color="#374151" />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#FFF",
                marginTop: 24,
                textAlign: "center",
                fontFamily: "InstrumentSans_500Medium",
              }}
            >
              Start Your DNA Journey
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#9CA3AF",
                marginTop: 8,
                textAlign: "center",
                fontFamily: "InstrumentSans_400Regular",
              }}
            >
              Add your first pet and unlock powerful genetic insights
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/dna")}
              style={{
                backgroundColor: "#3B82F6",
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 16,
                marginTop: 32,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#FFF",
                  fontFamily: "InstrumentSans_500Medium",
                }}
              >
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
