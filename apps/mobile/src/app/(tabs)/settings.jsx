import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  Settings,
  CreditCard,
  Shield,
  Info,
  ChevronRight,
  LogOut,
  User,
  FileQuestion,
  Database,
  RefreshCw,
} from "lucide-react-native";
import {
  useFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
} from "@expo-google-fonts/instrument-sans";
import { useRef, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
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

  const tier = tierData?.tier || "FREE";

  const handleResetOnboarding = async () => {
    Alert.alert(
      "Reset Onboarding",
      "This will clear your onboarding status and show the welcome flow again. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("onboarding_completed");
            Alert.alert(
              "Success",
              "Onboarding reset! Restart the app to see the welcome flow.",
            );
          },
        },
      ],
    );
  };

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      {/* App Shell Header (Canvas Layer) */}
      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 24,
          paddingBottom: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "InstrumentSans_400Regular",
            fontSize: 32,
            color: "#020617",
            letterSpacing: -0.64,
          }}
        >
          Control Panel
        </Text>
      </View>

      {/* Workspace Layer */}
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
          {/* User Profile Summary */}
          <View
            style={{
              padding: 24,
              backgroundColor: "#F8FAFC",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              marginBottom: 32,
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#0F172A",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={32} color="#FFFFFF" strokeWidth={1.5} />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: "InstrumentSans_500Medium",
                  fontSize: 18,
                  color: "#0F172A",
                }}
              >
                Researcher Profile
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 4,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F1F5F9",
                    borderRadius: 999,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: "InstrumentSans_500Medium",
                      color: "#0F172A",
                    }}
                  >
                    {tier} ACCOUNT
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Settings Groups */}
          <View style={{ gap: 32 }}>
            <View>
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
                Account & Billing
              </Text>
              <View style={{ gap: 4 }}>
                <TouchableOpacity
                  onPress={() => router.push("/paywall")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <CreditCard size={18} color="#0F172A" strokeWidth={1.5} />
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_400Regular",
                        fontSize: 16,
                        color: "#0F172A",
                      }}
                    >
                      Subscription Tier
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Shield size={18} color="#0F172A" strokeWidth={1.5} />
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_400Regular",
                        fontSize: 16,
                        color: "#0F172A",
                      }}
                    >
                      Security & Auth
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
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
                Data & Privacy
              </Text>
              <View style={{ gap: 4 }}>
                <TouchableOpacity
                  onPress={() => router.push("/settings/data-consent")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Database size={18} color="#0F172A" strokeWidth={1.5} />
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_400Regular",
                        fontSize: 16,
                        color: "#0F172A",
                      }}
                    >
                      Data Privacy & Research
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
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
                Help & Resources
              </Text>
              <View style={{ gap: 4 }}>
                <TouchableOpacity
                  onPress={() => router.push("/onboarding/dna-guide")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <FileQuestion size={18} color="#0F172A" strokeWidth={1.5} />
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_400Regular",
                        fontSize: 16,
                        color: "#0F172A",
                      }}
                    >
                      DNA Import Guide
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleResetOnboarding}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <RefreshCw size={18} color="#2563EB" strokeWidth={1.5} />
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_400Regular",
                        fontSize: 16,
                        color: "#2563EB",
                      }}
                    >
                      Reset Onboarding (Debug)
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
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
                System Information
              </Text>
              <View style={{ gap: 4 }}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 12,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Info size={18} color="#0F172A" strokeWidth={1.5} />
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_400Regular",
                        fontSize: 16,
                        color: "#0F172A",
                      }}
                    >
                      About Pet DNA AI
                    </Text>
                  </View>
                  <ChevronRight size={18} color="#64748B" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingVertical: 12,
                    marginTop: 12,
                  }}
                >
                  <LogOut size={18} color="#991B1B" strokeWidth={1.5} />
                  <Text
                    style={{
                      fontFamily: "InstrumentSans_500Medium",
                      fontSize: 16,
                      color: "#991B1B",
                    }}
                  >
                    Terminate Session
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
