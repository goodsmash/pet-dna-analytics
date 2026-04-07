import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dna,
  Upload,
  FileText,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Download,
  HelpCircle,
  Sparkles,
  Lock,
  Crown,
  Zap,
} from "lucide-react-native";
import {
  useFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
} from "@expo-google-fonts/instrument-sans";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useEffect, useState, useCallback } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import useUpload from "@/utils/useUpload";
import { StatusBar } from "expo-status-bar";

export default function DNAScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { petId: initialPetId } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const [selectedPetId, setSelectedPetId] = useState(initialPetId);
  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
  });

  const [upload, { loading: isUploading }] = useUpload();
  const [error, setError] = useState(null);
  const [isDownloadingSample, setIsDownloadingSample] = useState(false);

  const { data: petsData } = useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await fetch("/api/pets");
      if (!res.ok) throw new Error("Failed to fetch pets");
      return res.json();
    },
  });

  const { data: tierData } = useQuery({
    queryKey: ["subscription-tier"],
    queryFn: async () => {
      const res = await fetch("/api/subscription-tier");
      if (!res.ok) throw new Error("Failed to fetch tier");
      return res.json();
    },
  });

  const { data: reportsData, isLoading: isLoadingReports } = useQuery({
    queryKey: ["dna-reports", selectedPetId],
    queryFn: async () => {
      if (!selectedPetId) return { reports: [] };
      const res = await fetch(`/api/dna-reports?petId=${selectedPetId}`);
      if (!res.ok) return { reports: [] };
      return res.json();
    },
    enabled: !!selectedPetId,
  });

  const analyzeMutation = useMutation({
    mutationFn: async ({ petId, fileUrl, tier }) => {
      const res = await fetch("/api/analyze-dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petId,
          fileUrl,
          tier,
          enableValidation: tier === "ULTRA",
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Analysis failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dna-reports", selectedPetId]);
      queryClient.invalidateQueries(["all-reports"]);
      Alert.alert(
        "Success!",
        "DNA analysis complete! Check your reports to see the results.",
        [
          {
            text: "View Reports",
            onPress: () => router.push("/(tabs)/reports"),
          },
        ],
      );
    },
    onError: (error) => {
      Alert.alert("Analysis Failed", error.message);
    },
  });

  const handlePickAndUpload = useCallback(async () => {
    if (!selectedPetId) {
      setError("Please select a pet first");
      return;
    }
    setError(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/zip", "text/csv", "text/plain", "*/*"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        const { url, error: uploadError } = await upload({
          reactNativeAsset: file,
        });

        if (uploadError) {
          setError(uploadError);
          return;
        }

        analyzeMutation.mutate({
          petId: selectedPetId,
          fileUrl: url,
          tier: tierData?.tier || "FREE",
        });
      }
    } catch (err) {
      setError("File selection failed: " + err.message);
      console.error(err);
    }
  }, [selectedPetId, tierData, upload, analyzeMutation]);

  const handleDownloadSample = useCallback(async () => {
    setIsDownloadingSample(true);
    try {
      const currentPet = pets.find((p) => p.id == selectedPetId);
      const species = currentPet?.species || "dog";

      // Just show alert that sample is available
      Alert.alert(
        "Sample DNA Available",
        `Sample ${species} DNA files are available for download at /api/sample-dna-download?species=${species}&format=vcf\n\nYou can download this from a web browser to test the analysis.`,
        [{ text: "OK" }],
      );
    } catch (err) {
      console.error("Sample download error:", err);
      Alert.alert("Error", err.message);
    } finally {
      setIsDownloadingSample(false);
    }
  }, [selectedPetId]);

  if (!fontsLoaded) return null;

  const pets = petsData?.pets || [];
  const reports = reportsData?.reports || [];
  const currentPet = pets.find((p) => p.id == selectedPetId);
  const tier = tierData?.tier || "FREE";

  // Category display helpers
  const renderCategorySection = (title, data, isLocked = false) => {
    if (!data && !isLocked) return null;

    return (
      <View style={{ marginBottom: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "InstrumentSans_500Medium",
              fontSize: 12,
              color: "#64748B",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {title}
          </Text>
          {isLocked && <Lock size={12} color="#64748B" />}
        </View>

        {isLocked ? (
          <TouchableOpacity
            onPress={() => router.push("/paywall")}
            style={{
              backgroundColor: "#FEF3C7",
              padding: 12,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#FDE68A",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Sparkles size={16} color="#92400E" />
            <Text
              style={{
                fontFamily: "InstrumentSans_400Regular",
                fontSize: 13,
                color: "#92400E",
                flex: 1,
              }}
            >
              Upgrade to {tier === "FREE" ? "PRO" : "ULTRA"} to unlock this
              analysis
            </Text>
          </TouchableOpacity>
        ) : typeof data === "object" && !Array.isArray(data) ? (
          <View style={{ gap: 4 }}>
            {Object.entries(data).map(([key, value]) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontFamily: "InstrumentSans_400Regular",
                    fontSize: 14,
                    color: "#0F172A",
                  }}
                >
                  {key}
                </Text>
                <Text
                  style={{
                    fontFamily: "InstrumentSans_500Medium",
                    fontSize: 14,
                    color: "#0F172A",
                  }}
                >
                  {typeof value === "number" ? `${value}%` : value}
                </Text>
              </View>
            ))}
          </View>
        ) : Array.isArray(data) ? (
          <View style={{ gap: 4 }}>
            {data.map((item, idx) => (
              <Text
                key={idx}
                style={{
                  fontFamily: "InstrumentSans_400Regular",
                  fontSize: 14,
                  color: "#0F172A",
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
              color: "#0F172A",
              lineHeight: 20,
            }}
          >
            {data}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <StatusBar style="dark" />
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
          paddingBottom: 20,
          backgroundColor: "#F8FAFC",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: "InstrumentSans_400Regular",
                fontSize: 32,
                color: "#020617",
                letterSpacing: -0.64,
              }}
            >
              DNA Analysis
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              <View
                style={{
                  backgroundColor:
                    tier === "FREE"
                      ? "#F1F5F9"
                      : tier === "ULTRA"
                        ? "#78350F"
                        : "#1E40AF",
                  borderRadius: 999,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderWidth: 1,
                  borderColor:
                    tier === "FREE"
                      ? "#E2E8F0"
                      : tier === "ULTRA"
                        ? "#F59E0B"
                        : "#3B82F6",
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "InstrumentSans_500Medium",
                    color: tier === "FREE" ? "#0F172A" : "#FFFFFF",
                  }}
                >
                  {tier} TIER
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "InstrumentSans_400Regular",
                  fontSize: 14,
                  color: "#64748B",
                }}
              >
                {tier === "FREE"
                  ? "3 categories"
                  : tier === "PRO"
                    ? "12 categories"
                    : "40+ categories • AI Validated"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/onboarding/dna-guide")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#FFFFFF",
              borderWidth: 1,
              borderColor: "#E2E8F0",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HelpCircle size={20} color="#0F172A" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderWidth: 1,
          borderColor: "#E2E8F0",
          overflow: "hidden",
        }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 24,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Pet Selector */}
          <Text
            style={{
              fontFamily: "InstrumentSans_500Medium",
              fontSize: 14,
              color: "#64748B",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Target Subject
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0, marginBottom: 24 }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  onPress={() => setSelectedPetId(pet.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor:
                      selectedPetId == pet.id ? "#0F172A" : "#E2E8F0",
                    backgroundColor:
                      selectedPetId == pet.id ? "#0F172A" : "#FFFFFF",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "InstrumentSans_500Medium",
                      fontSize: 14,
                      color: selectedPetId == pet.id ? "#FFFFFF" : "#0F172A",
                    }}
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Upgrade CTA for FREE users */}
          {tier === "FREE" && (
            <TouchableOpacity
              onPress={() => router.push("/paywall")}
              style={{
                backgroundColor: "#8B5CF6",
                padding: 20,
                borderRadius: 12,
                marginBottom: 24,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Crown size={24} color="#FFFFFF" />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "InstrumentSans_500Medium",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  Unlock 20+ Analysis Categories
                </Text>
                <Text
                  style={{
                    fontFamily: "InstrumentSans_400Regular",
                    fontSize: 13,
                    color: "#F3E8FF",
                    marginTop: 2,
                  }}
                >
                  Upgrade to PRO or ULTRA for comprehensive insights
                </Text>
              </View>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {/* Action Area */}
          <View
            style={{
              padding: 24,
              backgroundColor: "#F8FAFC",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              marginBottom: 32,
            }}
          >
            <View style={{ alignItems: "center", gap: 12 }}>
              <Dna size={40} color="#0F172A" strokeWidth={1} />
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "InstrumentSans_500Medium",
                    fontSize: 18,
                    color: "#0F172A",
                    textAlign: "center",
                  }}
                >
                  Analyze Genetic Blueprint
                </Text>
                <Text
                  style={{
                    fontFamily: "InstrumentSans_400Regular",
                    fontSize: 14,
                    color: "#64748B",
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  Upload .zip, .csv, or .vcf files for{" "}
                  {currentPet?.name || "your pet"}
                </Text>
              </View>

              <TouchableOpacity
                disabled={isUploading || analyzeMutation.isPending}
                onPress={handlePickAndUpload}
                style={{
                  backgroundColor: "#0F172A",
                  width: "100%",
                  paddingVertical: 14,
                  borderRadius: 6,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 8,
                  opacity: isUploading || analyzeMutation.isPending ? 0.7 : 1,
                }}
              >
                {isUploading || analyzeMutation.isPending ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Upload size={18} color="#FFFFFF" strokeWidth={1.5} />
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "InstrumentSans_500Medium",
                        fontSize: 16,
                      }}
                    >
                      Select DNA File
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {error && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 8,
                  }}
                >
                  <AlertCircle size={14} color="#991B1B" />
                  <Text
                    style={{
                      fontFamily: "InstrumentSans_400Regular",
                      fontSize: 12,
                      color: "#991B1B",
                    }}
                  >
                    {error}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Reports History with navigation */}
          <Text
            style={{
              fontFamily: "InstrumentSans_500Medium",
              fontSize: 14,
              color: "#64748B",
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Analysis Dossiers
          </Text>

          {isLoadingReports ? (
            <ActivityIndicator color="#0F172A" />
          ) : reports.length === 0 ? (
            <Text
              style={{
                fontFamily: "InstrumentSans_400Regular",
                fontSize: 14,
                color: "#64748B",
                fontStyle: "italic",
              }}
            >
              No previous reports found for this subject.
            </Text>
          ) : (
            <View style={{ gap: 16 }}>
              {reports.map((report) => (
                <TouchableOpacity
                  key={report.id}
                  onPress={() => router.push(`/report/${report.id}`)}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                    padding: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 16,
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
                        Genetic Report #{report.id}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "InstrumentSans_400Regular",
                          fontSize: 12,
                          color: "#64748B",
                        }}
                      >
                        Processed{" "}
                        {new Date(report.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#D1FAE5",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 999,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "InstrumentSans_500Medium",
                          color: "#065F46",
                        }}
                      >
                        VERIFIED
                      </Text>
                    </View>
                  </View>

                  <View style={{ gap: 16 }}>
                    {/* Breed Section */}
                    <View>
                      <Text
                        style={{
                          fontFamily: "InstrumentSans_500Medium",
                          fontSize: 12,
                          color: "#64748B",
                          marginBottom: 6,
                        }}
                      >
                        BREED COMPOSITION
                      </Text>
                      <View style={{ gap: 4 }}>
                        {Object.entries(
                          report.analysis_json.breed_composition || {},
                        ).map(([breed, pct]) => (
                          <View
                            key={breed}
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "InstrumentSans_400Regular",
                                fontSize: 14,
                                color: "#0F172A",
                              }}
                            >
                              - {breed}
                            </Text>
                            <Text
                              style={{
                                fontFamily: "InstrumentSans_500Medium",
                                fontSize: 14,
                                color: "#0F172A",
                              }}
                            >
                              {pct}%
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Health Section */}
                    <View>
                      <Text
                        style={{
                          fontFamily: "InstrumentSans_500Medium",
                          fontSize: 12,
                          color: "#64748B",
                          marginBottom: 6,
                        }}
                      >
                        HEALTH PREDISPOSITIONS
                      </Text>
                      <View style={{ gap: 4 }}>
                        {(
                          report.analysis_json.health_predispositions || []
                        ).map((health, idx) => (
                          <Text
                            key={idx}
                            style={{
                              fontFamily: "InstrumentSans_400Regular",
                              fontSize: 14,
                              color: "#0F172A",
                            }}
                          >
                            - {health}
                          </Text>
                        ))}
                      </View>
                    </View>

                    {/* Vocal Section */}
                    <View>
                      <Text
                        style={{
                          fontFamily: "InstrumentSans_500Medium",
                          fontSize: 12,
                          color: "#64748B",
                          marginBottom: 6,
                        }}
                      >
                        VOCAL GENETICS
                      </Text>
                      <Text
                        style={{
                          fontFamily: "InstrumentSans_400Regular",
                          fontSize: 14,
                          color: "#0F172A",
                        }}
                      >
                        {report.analysis_json.vocal_genetics}
                      </Text>
                    </View>

                    {tier !== "FREE" &&
                      report.analysis_json.detailed_insights && (
                        <View
                          style={{
                            backgroundColor: "#F1F5F9",
                            padding: 12,
                            borderRadius: 6,
                            borderLeftWidth: 2,
                            borderLeftColor: "#0F172A",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "InstrumentSans_500Medium",
                              fontSize: 12,
                              color: "#0F172A",
                              marginBottom: 4,
                            }}
                          >
                            PRO INSIGHTS
                          </Text>
                          <Text
                            style={{
                              fontFamily: "InstrumentSans_400Regular",
                              fontSize: 14,
                              color: "#1E293B",
                            }}
                          >
                            {report.analysis_json.detailed_insights}
                          </Text>
                        </View>
                      )}
                  </View>

                  {/* Add View Full Report button */}
                  <TouchableOpacity
                    onPress={() => router.push(`/report/${report.id}`)}
                    style={{
                      backgroundColor: "#0F172A",
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_500Medium",
                        fontSize: 14,
                        color: "#FFFFFF",
                      }}
                    >
                      View Full Report
                    </Text>
                    <ChevronRight size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
