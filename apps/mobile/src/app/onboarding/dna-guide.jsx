import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  ExternalLink,
  Download,
  Upload,
} from "lucide-react-native";
import {
  useFonts,
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
} from "@expo-google-fonts/instrument-sans";

export default function DNAGuideScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
  });

  if (!fontsLoaded) return null;

  const guides = [
    {
      provider: "Embark (Dogs)",
      steps: [
        "Log in to your Embark account at embarkvet.com",
        "Navigate to 'My Dogs' and select your dog",
        "Click on 'Download Raw Data'",
        "Save the .zip file to your device",
        "Upload the file in the DNA Analysis tab",
      ],
      url: "https://embarkvet.com",
    },
    {
      provider: "Wisdom Panel (Dogs & Cats)",
      steps: [
        "Visit wisdompanel.com and log into your account",
        "Go to 'My Pets' section",
        "Select 'Download DNA Data'",
        "Choose your preferred format (.csv or .txt)",
        "Import the file into Pet DNA AI",
      ],
      url: "https://wisdompanel.com",
    },
    {
      provider: "Basepaws (Cats)",
      steps: [
        "Access your Basepaws dashboard at basepaws.com",
        "Navigate to 'My Cats'",
        "Click 'Export Genetic Data'",
        "Download the .vcf or .csv file",
        "Upload to our app for analysis",
      ],
      url: "https://basepaws.com",
    },
  ];

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
          How to Import DNA Files
        </Text>
        <Text
          style={{
            fontFamily: "InstrumentSans_400Regular",
            fontSize: 14,
            color: "#64748B",
            marginTop: 4,
          }}
        >
          Step-by-step guides for each provider
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Supported Formats */}
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
          <Text
            style={{
              fontFamily: "InstrumentSans_500Medium",
              fontSize: 16,
              color: "#0F172A",
              marginBottom: 12,
            }}
          >
            Supported File Formats
          </Text>
          <View style={{ gap: 8 }}>
            {[".zip", ".csv", ".txt", ".vcf"].map((format) => (
              <View
                key={format}
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Download size={16} color="#0F172A" />
                <Text
                  style={{
                    fontFamily: "InstrumentSans_400Regular",
                    fontSize: 14,
                    color: "#0F172A",
                  }}
                >
                  {format} files
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Provider Guides */}
        {guides.map((guide, idx) => (
          <View
            key={idx}
            style={{
              backgroundColor: "#FFFFFF",
              padding: 20,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              marginBottom: 16,
            }}
          >
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
                  fontFamily: "InstrumentSans_500Medium",
                  fontSize: 18,
                  color: "#0F172A",
                }}
              >
                {guide.provider}
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL(guide.url)}>
                <ExternalLink size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            {guide.steps.map((step, stepIdx) => (
              <View
                key={stepIdx}
                style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
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
                    {stepIdx + 1}
                  </Text>
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: "InstrumentSans_400Regular",
                    fontSize: 14,
                    color: "#1E293B",
                    lineHeight: 20,
                  }}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Help Section */}
        <View
          style={{
            backgroundColor: "#FEF3C7",
            padding: 20,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#FDE68A",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "InstrumentSans_500Medium",
              fontSize: 14,
              color: "#78350F",
              marginBottom: 8,
            }}
          >
            Need Help?
          </Text>
          <Text
            style={{
              fontFamily: "InstrumentSans_400Regular",
              fontSize: 13,
              color: "#92400E",
              lineHeight: 18,
            }}
          >
            If you're having trouble downloading your DNA file, contact your
            testing provider's support team. They can guide you through
            accessing your raw genetic data.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
