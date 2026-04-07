import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dna,
  FileText,
  Sparkles,
  Shield,
  ChevronRight,
} from "lucide-react-native";
import {
  useFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
} from "@expo-google-fonts/instrument-sans";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
  });

  if (!fontsLoaded) return null;

  const steps = [
    {
      icon: Dna,
      title: "Welcome to Pet DNA AI",
      description:
        "Unlock your pet's genetic secrets with the most advanced AI-powered DNA analysis platform.",
      action: "Get Started",
    },
    {
      icon: FileText,
      title: "How to Get Your Pet's DNA File",
      description:
        "Order a DNA test kit from providers like Embark, Wisdom Panel, or Basepaws. Once complete, download your pet's raw DNA data file.",
      providers: [
        { name: "Embark", url: "embarkvet.com", species: "Dogs" },
        {
          name: "Wisdom Panel",
          url: "wisdompanel.com",
          species: "Dogs & Cats",
        },
        { name: "Basepaws", url: "basepaws.com", species: "Cats" },
        { name: "Orivet", url: "orivet.com", species: "Dogs" },
      ],
      action: "Continue",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description:
        "Our multi-agent AI system analyzes 20+ genetic categories including breed composition, health risks, behavioral traits, and more.",
      action: "Continue",
    },
    {
      icon: Shield,
      title: "Your Data is Secure",
      description:
        "All DNA data is encrypted and stored securely. You control your data and can optionally contribute anonymized data to pet health research.",
      action: "Start Analyzing",
    },
  ];

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#1E293B",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconComponent size={40} color="#FFFFFF" strokeWidth={1.5} />
          </View>
        </View>

        {/* Title */}
        <Text
          style={{
            fontFamily: "InstrumentSans_500Medium",
            fontSize: 32,
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 16,
            letterSpacing: -0.64,
          }}
        >
          {currentStepData.title}
        </Text>

        {/* Description */}
        <Text
          style={{
            fontFamily: "InstrumentSans_400Regular",
            fontSize: 16,
            color: "#94A3B8",
            textAlign: "center",
            lineHeight: 24,
            marginBottom: 32,
          }}
        >
          {currentStepData.description}
        </Text>

        {/* DNA Provider List */}
        {currentStepData.providers && (
          <View style={{ gap: 12, marginBottom: 32 }}>
            <Text
              style={{
                fontFamily: "InstrumentSans_500Medium",
                fontSize: 14,
                color: "#CBD5E1",
                marginBottom: 8,
              }}
            >
              RECOMMENDED DNA TEST PROVIDERS
            </Text>
            {currentStepData.providers.map((provider, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: "#1E293B",
                  padding: 16,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#334155",
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
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_500Medium",
                        fontSize: 16,
                        color: "#FFFFFF",
                      }}
                    >
                      {provider.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "InstrumentSans_400Regular",
                        fontSize: 12,
                        color: "#94A3B8",
                        marginTop: 2,
                      }}
                    >
                      {provider.species} • {provider.url}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#64748B" />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Step Indicators */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            marginBottom: 32,
          }}
        >
          {steps.map((_, idx) => (
            <View
              key={idx}
              style={{
                width: idx === currentStep ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: idx === currentStep ? "#FFFFFF" : "#334155",
              }}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "InstrumentSans_500Medium",
              fontSize: 16,
              color: "#0F172A",
            }}
          >
            {currentStepData.action}
          </Text>
        </TouchableOpacity>

        {currentStep > 0 && (
          <TouchableOpacity
            onPress={() => setCurrentStep(currentStep - 1)}
            style={{
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <Text
              style={{
                fontFamily: "InstrumentSans_400Regular",
                fontSize: 14,
                color: "#94A3B8",
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        )}

        {currentStep === steps.length - 1 && (
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            style={{
              paddingVertical: 16,
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <Text
              style={{
                fontFamily: "InstrumentSans_400Regular",
                fontSize: 14,
                color: "#94A3B8",
              }}
            >
              Skip for now
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
