import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Download, Share2, Sparkles } from "lucide-react-native";
import { useState } from "react";
import {
  useFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
} from "@expo-google-fonts/instrument-sans";

export default function ReportDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isExporting, setIsExporting] = useState(false);

  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
  });

  const { data: tierData } = useQuery({
    queryKey: ["subscription-tier"],
    queryFn: async () => {
      const res = await fetch("/api/subscription-tier");
      if (!res.ok) throw new Error("Failed to fetch tier");
      return res.json();
    },
  });

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["report-detail", id],
    queryFn: async () => {
      const res = await fetch(`/api/analyze-dna?petId=${id}`);
      if (!res.ok) throw new Error("Failed to fetch report");
      const data = await res.json();
      return data.reports[0]; // Get first report for this pet
    },
    enabled: !!id,
  });

  const handleExport = async () => {
    const tier = tierData?.tier || "FREE";

    if (tier === "FREE") {
      router.push("/paywall");
      return;
    }

    setIsExporting(true);
    try {
      const res = await fetch("/api/export-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: id,
          userId: "current_user",
          tier,
        }),
      });

      if (!res.ok) throw new Error("Export failed");
      const data = await res.json();

      // Simulate PDF generation complete
      alert("PDF export ready! In production, this would download the PDF.");
    } catch (err) {
      alert("Export failed: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my pet's DNA analysis report! Analyzed with Pet DNA AI.`,
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8FAFC",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0F172A" />
      </View>
    );
  }

  if (!reportData) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8FAFC",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "InstrumentSans_400Regular",
            fontSize: 16,
            color: "#64748B",
          }}
        >
          Report not found
        </Text>
      </View>
    );
  }

  const analysis = reportData.analysis_json;
  const tier = tierData?.tier || "FREE";

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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "InstrumentSans_500Medium",
                fontSize: 24,
                color: "#0F172A",
                letterSpacing: -0.48,
              }}
            >
              DNA Report #{reportData.id}
            </Text>
            <Text
              style={{
                fontFamily: "InstrumentSans_400Regular",
                fontSize: 14,
                color: "#64748B",
                marginTop: 4,
              }}
            >
              Analyzed {new Date(reportData.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity onPress={handleShare}>
              <Share2 size={24} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExport} disabled={isExporting}>
              {isExporting ? (
                <ActivityIndicator size="small" color="#0F172A" />
              ) : (
                <Download size={24} color="#0F172A" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom + 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Tier Badge */}
        <View
          style={{
            backgroundColor: reportData.tier === "FREE" ? "#F1F5F9" : "#0F172A",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            alignSelf: "flex-start",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontFamily: "InstrumentSans_500Medium",
              fontSize: 11,
              color: reportData.tier === "FREE" ? "#0F172A" : "#FFFFFF",
            }}
          >
            {reportData.tier} ANALYSIS
          </Text>
        </View>

        {/* Analysis Sections */}
        {Object.entries(analysis).map(([key, value]) => {
          if (key === "analysis_metadata" || key === "specialist_insights")
            return null;

          return (
            <View
              key={key}
              style={{
                backgroundColor: "#FFFFFF",
                padding: 20,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                marginBottom: 16,
              }}
            >
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
                {key.replace(/_/g, " ")}
              </Text>

              {typeof value === "object" && !Array.isArray(value) ? (
                <View style={{ gap: 8 }}>
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <View
                      key={subKey}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "InstrumentSans_400Regular",
                          fontSize: 14,
                          color: "#1E293B",
                        }}
                      >
                        {subKey}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "InstrumentSans_500Medium",
                          fontSize: 14,
                          color: "#0F172A",
                        }}
                      >
                        {typeof subValue === "number"
                          ? `${subValue}%`
                          : subValue}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : Array.isArray(value) ? (
                <View style={{ gap: 6 }}>
                  {value.map((item, idx) => (
                    <Text
                      key={idx}
                      style={{
                        fontFamily: "InstrumentSans_400Regular",
                        fontSize: 14,
                        color: "#1E293B",
                      }}
                    >
                      • {item}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text
                  style={{
                    fontFamily: "InstrumentSans_400Regular",
                    fontSize: 14,
                    color: "#1E293B",
                    lineHeight: 20,
                  }}
                >
                  {value}
                </Text>
              )}
            </View>
          );
        })}

        {/* Specialist Insights (ULTRA only) */}
        {analysis.specialist_insights && (
          <View
            style={{
              backgroundColor: "#8B5CF6",
              padding: 24,
              borderRadius: 12,
              marginTop: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <Sparkles size={20} color="#FFFFFF" />
              <Text
                style={{
                  fontFamily: "InstrumentSans_500Medium",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
              >
                ULTRA Specialist Insights
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "InstrumentSans_400Regular",
                fontSize: 14,
                color: "#F3E8FF",
                lineHeight: 20,
              }}
            >
              {JSON.stringify(analysis.specialist_insights, null, 2)}
            </Text>
          </View>
        )}

        {/* Upgrade CTA for FREE users */}
        {tier === "FREE" && (
          <TouchableOpacity
            onPress={() => router.push("/paywall")}
            style={{
              backgroundColor: "#0F172A",
              padding: 20,
              borderRadius: 12,
              marginTop: 24,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "InstrumentSans_500Medium",
                fontSize: 16,
                color: "#FFFFFF",
                marginBottom: 4,
              }}
            >
              Unlock 20+ More Categories
            </Text>
            <Text
              style={{
                fontFamily: "InstrumentSans_400Regular",
                fontSize: 13,
                color: "#94A3B8",
              }}
            >
              Upgrade to PRO or ULTRA for comprehensive analysis
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
