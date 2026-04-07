// DNA Reports List Screen - View all pet DNA analyses
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
import {
  FileText,
  ChevronRight,
  Crown,
  Zap,
  Star,
  Calendar,
  AlertCircle,
} from "lucide-react-native";

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pets");

      if (!response.ok) {
        throw new Error("Failed to load reports");
      }

      const data = await response.json();

      // Get all pets with their reports
      const allReports = [];
      for (const pet of data.pets || []) {
        const petReports = await fetch(`/api/pets?petId=${pet.id}`);
        const petData = await petReports.json();

        if (petData.reports && petData.reports.length > 0) {
          petData.reports.forEach((report) => {
            allReports.push({
              ...report,
              pet_name: pet.name,
              pet_species: pet.species,
            });
          });
        }
      }

      setReports(allReports);
      setError(null);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tierIcons = {
    FREE: <Star size={20} color="#6B7280" />,
    PRO: <Zap size={20} color="#3B82F6" />,
    ULTRA: <Crown size={20} color="#F59E0B" />,
  };

  const tierColors = {
    FREE: "#6B7280",
    PRO: "#3B82F6",
    ULTRA: "#F59E0B",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
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
        <Text style={{ color: "#9CA3AF", marginTop: 16 }}>
          Loading reports...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#1F2937",
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "bold", color: "#FFF" }}>
          DNA Reports
        </Text>
        <Text style={{ fontSize: 16, color: "#9CA3AF", marginTop: 4 }}>
          {reports.length} {reports.length === 1 ? "report" : "reports"} total
        </Text>
      </View>

      {error && (
        <View
          style={{
            backgroundColor: "#7F1D1D",
            marginHorizontal: 20,
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <AlertCircle size={24} color="#FCA5A5" />
          <Text style={{ color: "#FCA5A5", flex: 1 }}>{error}</Text>
        </View>
      )}

      {reports.length === 0 && !loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
            paddingBottom: insets.bottom + 80,
          }}
        >
          <FileText size={64} color="#374151" />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#FFF",
              marginTop: 24,
            }}
          >
            No Reports Yet
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#9CA3AF",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Upload your first DNA file to get started with genetic analysis
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/dna")}
            style={{
              backgroundColor: "#3B82F6",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 12,
              marginTop: 32,
            }}
          >
            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "bold" }}>
              Upload DNA File
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {reports.map((report) => (
            <TouchableOpacity
              key={report.id}
              onPress={() => router.push(`/report/${report.id}`)}
              style={{
                backgroundColor: "#1F2937",
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: tierColors[report.tier] + "40",
              }}
            >
              {/* Header Row */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", color: "#FFF" }}
                  >
                    {report.pet_name}
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "#9CA3AF", marginTop: 2 }}
                  >
                    {report.pet_species}
                  </Text>
                </View>

                {/* Tier Badge */}
                <View
                  style={{
                    backgroundColor: tierColors[report.tier] + "20",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {tierIcons[report.tier]}
                  <Text
                    style={{
                      color: tierColors[report.tier],
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {report.tier}
                  </Text>
                </View>
              </View>

              {/* Report Stats */}
              <View
                style={{
                  backgroundColor: "#111827",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>
                      Categories
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#FFF",
                        marginTop: 2,
                      }}
                    >
                      {report.analysis_json?.analysis_metadata
                        ?.categories_analyzed || "N/A"}
                    </Text>
                  </View>

                  <View>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>
                      Quality
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#10B981",
                        marginTop: 2,
                      }}
                    >
                      {report.analysis_json?.quality_score || "N/A"}%
                    </Text>
                  </View>

                  <View>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>
                      Health Risks
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#F59E0B",
                        marginTop: 2,
                      }}
                    >
                      {report.analysis_json?.health_predispositions?.length ||
                        0}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Validation Badge (ULTRA tier only) */}
              {report.tier === "ULTRA" &&
                report.analysis_json?.validation_results?.validation_passed && (
                  <View
                    style={{
                      backgroundColor: "#065F46",
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 8,
                      marginBottom: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>🔬</Text>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: "#10B981",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        AI-Validated Analysis
                      </Text>
                      <Text style={{ color: "#6EE7B7", fontSize: 11 }}>
                        {
                          report.analysis_json.validation_results
                            .validation_metadata.achieved_agreement
                        }{" "}
                        agreement across 3 AI models
                      </Text>
                    </View>
                  </View>
                )}

              {/* Bottom Row */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Calendar size={14} color="#6B7280" />
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>
                    {formatDate(report.created_at)}
                  </Text>
                </View>

                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#3B82F6",
                      fontWeight: "600",
                    }}
                  >
                    View Report
                  </Text>
                  <ChevronRight size={16} color="#3B82F6" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
