import { View, Text, ScrollView, TouchableOpacity, Switch } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ChevronLeft, Shield, Database, Info } from "lucide-react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
} from "@expo-google-fonts/instrument-sans";

export default function DataConsentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
  });

  // Fetch current consent status
  const { data: consentData } = useQuery({
    queryKey: ["data-consent"],
    queryFn: async () => {
      const res = await fetch("/api/data-consent?userId=current_user");
      if (!res.ok) return { consents: [] };
      return res.json();
    },
  });

  const updateConsentMutation = useMutation({
    mutationFn: async ({ consentGiven }) => {
      const res = await fetch("/api/data-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "current_user",
          consentGiven,
          consentType: "research",
        }),
      });
      if (!res.ok) throw new Error("Failed to update consent");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["data-consent"]);
    },
  });

  if (!fontsLoaded) return null;

  const currentConsent = consentData?.consents?.find(
    (c) => c.consent_type === "research",
  );
  const isConsented = currentConsent?.consent_given || false;

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
          Data Privacy & Research
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Privacy Info */}
        <View
          style={{
            backgroundColor: "#EFF6FF",
            padding: 20,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#DBEAFE",
            marginBottom: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <Shield size={24} color="#1E40AF" />
            <Text
              style={{
                fontFamily: "InstrumentSans_500Medium",
                fontSize: 16,
                color: "#1E40AF",
              }}
            >
              Your Privacy is Protected
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "InstrumentSans_400Regular",
              fontSize: 14,
              color: "#1E3A8A",
              lineHeight: 20,
            }}
          >
            All DNA data is encrypted end-to-end and stored securely. We never
            share your personal information or sell your data to third parties.
          </Text>
        </View>

        {/* Research Contribution Toggle */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            padding: 20,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            marginBottom: 24,
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
            <View style={{ flex: 1, marginRight: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Database size={20} color="#0F172A" />
                <Text
                  style={{
                    fontFamily: "InstrumentSans_500Medium",
                    fontSize: 16,
                    color: "#0F172A",
                  }}
                >
                  Contribute to Research
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "InstrumentSans_400Regular",
                  fontSize: 13,
                  color: "#64748B",
                  lineHeight: 18,
                }}
              >
                Help advance pet health science by sharing anonymized genetic
                data with researchers
              </Text>
            </View>
            <Switch
              value={isConsented}
              onValueChange={(value) =>
                updateConsentMutation.mutate({ consentGiven: value })
              }
              trackColor={{ false: "#CBD5E1", true: "#0F172A" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {isConsented && (
            <View
              style={{
                backgroundColor: "#D1FAE5",
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#A7F3D0",
              }}
            >
              <Text
                style={{
                  fontFamily: "InstrumentSans_400Regular",
                  fontSize: 12,
                  color: "#065F46",
                }}
              >
                ✓ Thank you for contributing to pet health research. Your
                anonymized data helps scientists develop better treatments and
                understand genetic diseases.
              </Text>
            </View>
          )}
        </View>

        {/* How It Works */}
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
          How Anonymization Works
        </Text>

        <View style={{ gap: 16 }}>
          {[
            {
              title: "Remove Identifiers",
              description:
                "All personal information (names, emails, locations) is stripped from the data",
            },
            {
              title: "Hash Samples",
              description:
                "DNA samples are cryptographically hashed so they cannot be traced back to individuals",
            },
            {
              title: "Aggregate Data",
              description:
                "Your data is combined with thousands of other samples for statistical analysis",
            },
            {
              title: "Research Use Only",
              description:
                "Data is only shared with approved veterinary research institutions",
            },
          ].map((item, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                gap: 12,
                backgroundColor: "#FFFFFF",
                padding: 16,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#E2E8F0",
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: "#F1F5F9",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "InstrumentSans_500Medium",
                    fontSize: 12,
                    color: "#0F172A",
                  }}
                >
                  {idx + 1}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "InstrumentSans_500Medium",
                    fontSize: 14,
                    color: "#0F172A",
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontFamily: "InstrumentSans_400Regular",
                    fontSize: 13,
                    color: "#64748B",
                    lineHeight: 18,
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer Note */}
        <View
          style={{
            backgroundColor: "#FFFBEB",
            padding: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#FDE68A",
            marginTop: 24,
            flexDirection: "row",
            gap: 12,
          }}
        >
          <Info size={20} color="#92400E" />
          <Text
            style={{
              flex: 1,
              fontFamily: "InstrumentSans_400Regular",
              fontSize: 12,
              color: "#92400E",
              lineHeight: 16,
            }}
          >
            You can change your data sharing preferences at any time. Previously
            shared data will remain anonymized in research databases.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
