import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";
import Carousel from "react-native-reanimated-carousel";
import {
  Dna,
  Heart,
  Shield,
  Brain,
  Sparkles,
  Crown,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  Users,
  AlertTriangle,
  Zap,
  Lock,
  Camera,
  FileText,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Cat,
  Dog,
  Calendar,
  Weight,
  Activity,
  Utensils,
  Stethoscope,
  Home,
  MapPin,
  Mail,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useUpload } from "@/utils/useUpload";

const { width, height } = Dimensions.get("window");

export default function WelcomeOnboarding() {
  const insets = useSafeAreaInsets();
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTier, setSelectedTier] = useState("ULTRA");
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [upload, { loading: uploadLoading }] = useUpload();

  // Pet profile data
  const [petData, setPetData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    photoUrl: null,
    activityLevel: "",
    dietType: "",
    healthConcerns: [],
    location: "",
    ownerEmail: "",
  });

  const totalSteps = 18;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / totalSteps,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleNext = () => {
    // Validate required fields on certain steps
    if (currentIndex === 6 && !petData.name) {
      Alert.alert("Required", "Please enter your pet's name");
      return;
    }
    if (currentIndex === 7 && !petData.species) {
      Alert.alert("Required", "Please select your pet's species");
      return;
    }
    if (currentIndex === 14 && !petData.ownerEmail) {
      Alert.alert("Required", "Please enter your email");
      return;
    }

    if (currentIndex < totalSteps - 1) {
      carouselRef.current?.scrollTo({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      // Save pet data to database
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_PROXY_BASE_URL}/api/pets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: petData.name,
            species: petData.species,
            breed_hint: petData.breed || null,
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to create pet");

      const { pet } = await response.json();

      // Store pet ID and onboarding completion
      await AsyncStorage.setItem("primary_pet_id", pet.id.toString());
      await AsyncStorage.setItem("onboarding_completed", "true");
      await AsyncStorage.setItem("selected_tier", selectedTier);
      await AsyncStorage.setItem("pet_profile_data", JSON.stringify(petData));

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Onboarding completion error:", error);
      Alert.alert("Error", "Could not complete setup. Please try again.");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uploadResult = await upload({
        reactNativeAsset: {
          uri: asset.uri,
          name: asset.fileName || "pet-photo.jpg",
          mimeType: asset.mimeType || "image/jpeg",
        },
      });

      if (uploadResult.error) {
        Alert.alert("Upload Error", uploadResult.error);
      } else {
        setPetData({ ...petData, photoUrl: uploadResult.url });
      }
    }
  };

  const renderStep = ({ item: stepIndex }) => {
    // Step 1: Hero
    if (stepIndex === 0) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#3B82F6",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <StatusBar style="light" />
          <Dna size={120} color="#FFF" strokeWidth={1} />
          <Text
            style={{
              fontSize: 42,
              fontWeight: "900",
              color: "#FFF",
              textAlign: "center",
              marginTop: 32,
              lineHeight: 48,
            }}
          >
            Unlock Your Pet's{"\n"}Genetic Secrets
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              marginTop: 16,
              paddingHorizontal: 20,
            }}
          >
            AI-powered DNA analysis trusted by 500,000+ pet parents worldwide
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 24,
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={20} color="#FCD34D" fill="#FCD34D" />
            ))}
            <Text
              style={{
                fontSize: 16,
                color: "#FFF",
                fontWeight: "700",
                marginLeft: 8,
              }}
            >
              4.9/5 (12,847 reviews)
            </Text>
          </View>
        </View>
      );
    }

    // Step 2: Problem
    if (stepIndex === 1) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <StatusBar style="light" />
          <View
            style={{
              backgroundColor: "#EF4444",
              width: 80,
              height: 80,
              borderRadius: 40,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 32,
            }}
          >
            <AlertTriangle size={40} color="#FFF" />
          </View>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: "#FFF",
              lineHeight: 42,
              marginBottom: 16,
            }}
          >
            Are You Worried About{"\n"}Your Pet's Health?
          </Text>
          <Text style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 40 }}>
            Most pet owners discover health issues too late
          </Text>
          <View style={{ gap: 24 }}>
            <View
              style={{
                backgroundColor: "#1F2937",
                borderRadius: 16,
                padding: 20,
                borderLeftWidth: 4,
                borderLeftColor: "#EF4444",
              }}
            >
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: "900",
                  color: "#FFF",
                  marginBottom: 4,
                }}
              >
                78%
              </Text>
              <Text style={{ fontSize: 16, color: "#9CA3AF" }}>
                of genetic diseases
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                are preventable
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#1F2937",
                borderRadius: 16,
                padding: 20,
                borderLeftWidth: 4,
                borderLeftColor: "#EF4444",
              }}
            >
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: "900",
                  color: "#FFF",
                  marginBottom: 4,
                }}
              >
                $2,400
              </Text>
              <Text style={{ fontSize: 16, color: "#9CA3AF" }}>
                saved with early detection
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                average
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#1F2937",
                borderRadius: 16,
                padding: 20,
                borderLeftWidth: 4,
                borderLeftColor: "#EF4444",
              }}
            >
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: "900",
                  color: "#FFF",
                  marginBottom: 4,
                }}
              >
                3-5 yrs
              </Text>
              <Text style={{ fontSize: 16, color: "#9CA3AF" }}>
                longer with prevention
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                lifespan
              </Text>
            </View>
          </View>
        </View>
      );
    }

    // Step 3: Solution
    if (stepIndex === 2) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <StatusBar style="light" />
          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: "#FFF",
              lineHeight: 42,
              marginBottom: 16,
            }}
          >
            Know Before{"\n"}Symptoms Appear
          </Text>
          <Text style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 48 }}>
            Predict health risks 5-7 years in advance with DNA science
          </Text>
          <View style={{ gap: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                backgroundColor: "#1F2937",
                padding: 20,
                borderRadius: 16,
              }}
            >
              <View
                style={{
                  backgroundColor: "#10B981",
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Brain size={28} color="#FFF" />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  color: "#FFF",
                  fontWeight: "600",
                  flex: 1,
                }}
              >
                AI analyzes 91M+ genetic variants
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                backgroundColor: "#1F2937",
                padding: 20,
                borderRadius: 16,
              }}
            >
              <View
                style={{
                  backgroundColor: "#10B981",
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Shield size={28} color="#FFF" />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  color: "#FFF",
                  fontWeight: "600",
                  flex: 1,
                }}
              >
                Detect 200+ hereditary conditions
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                backgroundColor: "#1F2937",
                padding: 20,
                borderRadius: 16,
              }}
            >
              <View
                style={{
                  backgroundColor: "#10B981",
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TrendingUp size={28} color="#FFF" />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  color: "#FFF",
                  fontWeight: "600",
                  flex: 1,
                }}
              >
                Personalized health roadmap
              </Text>
            </View>
          </View>
        </View>
      );
    }

    // Step 4: Social Proof
    if (stepIndex === 3) {
      const testimonials = [
        {
          name: "Sarah M.",
          pet: "Golden Retriever",
          text: "Found cancer markers early. Max is still with us thanks to this!",
          saved: "$8,200",
        },
        {
          name: "James T.",
          pet: "Persian Cat",
          text: "Discovered food allergies before they became serious. Game changer!",
          saved: "$1,400",
        },
        {
          name: "Maria L.",
          pet: "Labrador Mix",
          text: "The breeding insights helped us make informed decisions. Worth every penny.",
          saved: "$3,800",
        },
      ];

      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#F8FAFC",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <StatusBar style="dark" />
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <Users size={48} color="#8B5CF6" />
            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                color: "#000",
                textAlign: "center",
                marginTop: 16,
                lineHeight: 42,
              }}
            >
              Join 500K+ Happy{"\n"}Pet Parents
            </Text>
          </View>
          <View style={{ gap: 16 }}>
            {testimonials.map((testimonial, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: "#FFF",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 2,
                  borderColor: "#E2E8F0",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <View>
                    <Text
                      style={{ fontSize: 16, fontWeight: "700", color: "#000" }}
                    >
                      {testimonial.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#64748B" }}>
                      {testimonial.pet}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#10B981",
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{ fontSize: 12, fontWeight: "700", color: "#FFF" }}
                    >
                      Saved {testimonial.saved}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginBottom: 8 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} color="#F59E0B" fill="#F59E0B" />
                  ))}
                </View>
                <Text
                  style={{ fontSize: 15, color: "#1E293B", lineHeight: 22 }}
                >
                  "{testimonial.text}"
                </Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    // Step 5: Urgency Offer
    if (stepIndex === 4) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#7F1D1D",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <StatusBar style="light" />
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View
              style={{
                backgroundColor: "#F59E0B",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 999,
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "900",
                  color: "#000",
                  letterSpacing: 1,
                }}
              >
                ⏰ 67% OFF
              </Text>
            </View>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                color: "#FFF",
                textAlign: "center",
                lineHeight: 42,
              }}
            >
              Limited Time{"\n"}Founder's Offer
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.8)",
                textAlign: "center",
                marginTop: 12,
              }}
            >
              Join now and lock in lifetime benefits
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#991B1B",
              borderRadius: 20,
              padding: 32,
              borderWidth: 3,
              borderColor: "#F59E0B",
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.7)",
                  textDecorationLine: "line-through",
                }}
              >
                $299/year
              </Text>
              <Text style={{ fontSize: 56, fontWeight: "900", color: "#FFF" }}>
                $99/year
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#F59E0B",
                  fontWeight: "700",
                  marginTop: 8,
                }}
              >
                Save $200 • Offer expires in 23 hours
              </Text>
            </View>
            <View style={{ gap: 12 }}>
              {[
                "✨ Lifetime price guarantee",
                "🎁 Free quarterly updates",
                "👨‍⚕️ Priority vet consultations",
                "📊 Advanced health tracking",
              ].map((bonus, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <CheckCircle size={20} color="#10B981" />
                  <Text style={{ fontSize: 16, color: "#FFF" }}>{bonus}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    }

    // Step 6: Science Credibility
    if (stepIndex === 5) {
      const sources = [
        { name: "NCBI Database", variants: "91M+" },
        { name: "Dog10K Project", variants: "43M+" },
        { name: "PubMed Research", studies: "12,000+" },
      ];
      const badges = ["FDA Validated", "AAHA Certified", "ISO 9001"];

      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <StatusBar style="light" />
          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: "#FFF",
              lineHeight: 42,
              marginBottom: 16,
            }}
          >
            Powered by Real{"\n"}Scientific Data
          </Text>
          <Text style={{ fontSize: 18, color: "#9CA3AF", marginBottom: 40 }}>
            Not guesswork. Real peer-reviewed genetics.
          </Text>
          <View style={{ gap: 16, marginBottom: 32 }}>
            {sources.map((source, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: "#1F2937",
                  borderRadius: 16,
                  padding: 20,
                  borderLeftWidth: 4,
                  borderLeftColor: "#06B6D4",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#FFF",
                    marginBottom: 8,
                  }}
                >
                  {source.name}
                </Text>
                <Text
                  style={{ fontSize: 32, fontWeight: "900", color: "#06B6D4" }}
                >
                  {source.variants || source.studies}
                </Text>
                <Text style={{ fontSize: 14, color: "#9CA3AF" }}>
                  {source.variants
                    ? "genetic variants"
                    : "peer-reviewed studies"}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {badges.map((badge, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: "#065F46",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: "#10B981",
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: "#6EE7B7" }}
                >
                  ✓ {badge}
                </Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    // Step 7: Pet Name Input
    if (stepIndex === 6) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            backgroundColor: "#EC4899",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              padding: 32,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
          >
            <StatusBar style="light" />
            <Heart
              size={64}
              color="#FFF"
              style={{ alignSelf: "center", marginBottom: 24 }}
            />
            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                color: "#FFF",
                textAlign: "center",
                lineHeight: 42,
                marginBottom: 16,
              }}
            >
              What's Your{"\n"}Pet's Name?
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: "rgba(255,255,255,0.9)",
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              Let's personalize your experience
            </Text>
            <TextInput
              value={petData.name}
              onChangeText={(text) => setPetData({ ...petData, name: text })}
              placeholder="Enter your pet's name"
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: 16,
                padding: 20,
                fontSize: 18,
                color: "#FFF",
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.3)",
              }}
              autoFocus
            />
            {petData.name ? (
              <View
                style={{
                  marginTop: 24,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  padding: 20,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 24, fontWeight: "700", color: "#FFF" }}
                >
                  Welcome, {petData.name}! 🎉
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }

    // Step 8: Species Selection
    if (stepIndex === 7) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#F8FAFC",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <StatusBar style="dark" />
          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: "#000",
              textAlign: "center",
              lineHeight: 42,
              marginBottom: 16,
            }}
          >
            What Type of Pet{"\n"}is {petData.name || "Your Pet"}?
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#64748B",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Select your pet's species
          </Text>
          <View style={{ gap: 16 }}>
            <TouchableOpacity
              onPress={() => setPetData({ ...petData, species: "Dog" })}
              style={{
                backgroundColor: petData.species === "Dog" ? "#3B82F6" : "#FFF",
                borderRadius: 20,
                padding: 24,
                borderWidth: 3,
                borderColor: petData.species === "Dog" ? "#3B82F6" : "#E2E8F0",
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <View
                style={{
                  backgroundColor:
                    petData.species === "Dog" ? "#FFF" : "#DBEAFE",
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Dog
                  size={32}
                  color={petData.species === "Dog" ? "#3B82F6" : "#1E40AF"}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "900",
                    color: petData.species === "Dog" ? "#FFF" : "#000",
                  }}
                >
                  Dog
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      petData.species === "Dog"
                        ? "rgba(255,255,255,0.8)"
                        : "#64748B",
                  }}
                >
                  Canine genetic analysis
                </Text>
              </View>
              {petData.species === "Dog" && (
                <CheckCircle size={28} color="#FFF" fill="#FFF" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPetData({ ...petData, species: "Cat" })}
              style={{
                backgroundColor: petData.species === "Cat" ? "#8B5CF6" : "#FFF",
                borderRadius: 20,
                padding: 24,
                borderWidth: 3,
                borderColor: petData.species === "Cat" ? "#8B5CF6" : "#E2E8F0",
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <View
                style={{
                  backgroundColor:
                    petData.species === "Cat" ? "#FFF" : "#EDE9FE",
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Cat
                  size={32}
                  color={petData.species === "Cat" ? "#8B5CF6" : "#6D28D9"}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "900",
                    color: petData.species === "Cat" ? "#FFF" : "#000",
                  }}
                >
                  Cat
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      petData.species === "Cat"
                        ? "rgba(255,255,255,0.8)"
                        : "#64748B",
                  }}
                >
                  Feline genetic analysis
                </Text>
              </View>
              {petData.species === "Cat" && (
                <CheckCircle size={28} color="#FFF" fill="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Step 9: Breed Input
    if (stepIndex === 8) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            backgroundColor: "#000",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              padding: 32,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
          >
            <StatusBar style="light" />
            <Dna
              size={64}
              color="#3B82F6"
              style={{ alignSelf: "center", marginBottom: 24 }}
            />
            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                color: "#FFF",
                textAlign: "center",
                lineHeight: 42,
                marginBottom: 16,
              }}
            >
              {petData.name}'s Breed?
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: "#9CA3AF",
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              Best guess is fine - DNA will reveal the truth!
            </Text>
            <TextInput
              value={petData.breed}
              onChangeText={(text) => setPetData({ ...petData, breed: text })}
              placeholder="e.g., Labrador, Persian, Mixed"
              placeholderTextColor="#6B7280"
              style={{
                backgroundColor: "#1F2937",
                borderRadius: 16,
                padding: 20,
                fontSize: 18,
                color: "#FFF",
                borderWidth: 2,
                borderColor: "#374151",
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: "#6B7280",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              💡 Don't know? Leave blank - we'll discover it together!
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }

    // Step 10: Age & Weight
    if (stepIndex === 9) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            backgroundColor: "#F8FAFC",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              padding: 32,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
          >
            <StatusBar style="dark" />
            <View
              style={{
                backgroundColor: "#3B82F6",
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginBottom: 24,
              }}
            >
              <Calendar size={40} color="#FFF" />
            </View>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                color: "#000",
                textAlign: "center",
                lineHeight: 42,
                marginBottom: 40,
              }}
            >
              Age & Weight
            </Text>
            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#000",
                    marginBottom: 8,
                  }}
                >
                  Age (years)
                </Text>
                <TextInput
                  value={petData.age}
                  onChangeText={(text) => setPetData({ ...petData, age: text })}
                  placeholder="e.g., 3"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "#FFF",
                    borderRadius: 16,
                    padding: 20,
                    fontSize: 18,
                    color: "#000",
                    borderWidth: 2,
                    borderColor: "#E2E8F0",
                  }}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#000",
                    marginBottom: 8,
                  }}
                >
                  Weight (lbs)
                </Text>
                <TextInput
                  value={petData.weight}
                  onChangeText={(text) =>
                    setPetData({ ...petData, weight: text })
                  }
                  placeholder="e.g., 45"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "#FFF",
                    borderRadius: 16,
                    padding: 20,
                    fontSize: 18,
                    color: "#000",
                    borderWidth: 2,
                    borderColor: "#E2E8F0",
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }

    // Step 11: Gender
    if (stepIndex === 10) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <StatusBar style="light" />
          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: "#FFF",
              textAlign: "center",
              lineHeight: 42,
              marginBottom: 48,
            }}
          >
            {petData.name}'s Gender?
          </Text>
          <View style={{ gap: 16 }}>
            <TouchableOpacity
              onPress={() => setPetData({ ...petData, gender: "Male" })}
              style={{
                backgroundColor:
                  petData.gender === "Male" ? "#3B82F6" : "#1F2937",
                borderRadius: 16,
                padding: 24,
                borderWidth: 2,
                borderColor: petData.gender === "Male" ? "#3B82F6" : "#374151",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFF" }}>
                ♂ Male
              </Text>
              {petData.gender === "Male" && (
                <CheckCircle size={24} color="#FFF" fill="#FFF" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPetData({ ...petData, gender: "Female" })}
              style={{
                backgroundColor:
                  petData.gender === "Female" ? "#EC4899" : "#1F2937",
                borderRadius: 16,
                padding: 24,
                borderWidth: 2,
                borderColor:
                  petData.gender === "Female" ? "#EC4899" : "#374151",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "700", color: "#FFF" }}>
                ♀ Female
              </Text>
              {petData.gender === "Female" && (
                <CheckCircle size={24} color="#FFF" fill="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Step 12: Activity Level
    if (stepIndex === 11) {
      const levels = [
        { value: "Low", emoji: "😴", desc: "Couch potato" },
        { value: "Moderate", emoji: "🚶", desc: "Regular walks" },
        { value: "High", emoji: "⚡", desc: "Very active" },
      ];

      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#F8FAFC",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <StatusBar style="dark" />
          <Activity
            size={64}
            color="#3B82F6"
            style={{ alignSelf: "center", marginBottom: 24 }}
          />
          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: "#000",
              textAlign: "center",
              lineHeight: 42,
              marginBottom: 16,
            }}
          >
            Activity Level
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#64748B",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            How active is {petData.name || "your pet"}?
          </Text>
          <View style={{ gap: 16 }}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level.value}
                onPress={() =>
                  setPetData({ ...petData, activityLevel: level.value })
                }
                style={{
                  backgroundColor:
                    petData.activityLevel === level.value ? "#3B82F6" : "#FFF",
                  borderRadius: 16,
                  padding: 24,
                  borderWidth: 2,
                  borderColor:
                    petData.activityLevel === level.value
                      ? "#3B82F6"
                      : "#E2E8F0",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Text style={{ fontSize: 32 }}>{level.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color:
                        petData.activityLevel === level.value ? "#FFF" : "#000",
                    }}
                  >
                    {level.value}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color:
                        petData.activityLevel === level.value
                          ? "rgba(255,255,255,0.8)"
                          : "#64748B",
                    }}
                  >
                    {level.desc}
                  </Text>
                </View>
                {petData.activityLevel === level.value && (
                  <CheckCircle size={24} color="#FFF" fill="#FFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    // Step 13: Diet Type
    if (stepIndex === 12) {
      const diets = [
        { value: "Kibble", emoji: "🥘", desc: "Dry food" },
        { value: "Wet Food", emoji: "🥫", desc: "Canned food" },
        { value: "Raw", emoji: "🥩", desc: "Raw diet" },
        { value: "Homemade", emoji: "👨‍🍳", desc: "Home cooked" },
        { value: "Mixed", emoji: "🍽️", desc: "Combination" },
      ];

      return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          <StatusBar style="light" />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingTop: insets.top + 60,
              paddingHorizontal: 32,
              paddingBottom: 150,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Utensils
              size={64}
              color="#10B981"
              style={{ alignSelf: "center", marginBottom: 24 }}
            />
            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                color: "#FFF",
                textAlign: "center",
                lineHeight: 42,
                marginBottom: 16,
              }}
            >
              Diet Type
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: "#9CA3AF",
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              What does {petData.name || "your pet"} eat?
            </Text>
            <View style={{ gap: 12 }}>
              {diets.map((diet) => (
                <TouchableOpacity
                  key={diet.value}
                  onPress={() =>
                    setPetData({ ...petData, dietType: diet.value })
                  }
                  style={{
                    backgroundColor:
                      petData.dietType === diet.value ? "#10B981" : "#1F2937",
                    borderRadius: 16,
                    padding: 20,
                    borderWidth: 2,
                    borderColor:
                      petData.dietType === diet.value ? "#10B981" : "#374151",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <Text style={{ fontSize: 28 }}>{diet.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ fontSize: 16, fontWeight: "700", color: "#FFF" }}
                    >
                      {diet.value}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color:
                          petData.dietType === diet.value
                            ? "rgba(255,255,255,0.8)"
                            : "#9CA3AF",
                      }}
                    >
                      {diet.desc}
                    </Text>
                  </View>
                  {petData.dietType === diet.value && (
                    <CheckCircle size={20} color="#FFF" fill="#FFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      );
    }

    // Step 14: Health Concerns
    if (stepIndex === 13) {
      const concerns = [
        "Allergies",
        "Joint Issues",
        "Skin Problems",
        "Digestive Issues",
        "Weight Issues",
        "Heart Condition",
        "None",
      ];

      const toggleConcern = (concern) => {
        if (concern === "None") {
          setPetData({ ...petData, healthConcerns: ["None"] });
        } else {
          const current = petData.healthConcerns.filter((c) => c !== "None");
          if (current.includes(concern)) {
            setPetData({
              ...petData,
              healthConcerns: current.filter((c) => c !== concern),
            });
          } else {
            setPetData({ ...petData, healthConcerns: [...current, concern] });
          }
        }
      };

      return (
        <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
          <StatusBar style="dark" />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingTop: insets.top + 60,
              paddingHorizontal: 32,
              paddingBottom: 150,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Stethoscope
              size={64}
              color="#EF4444"
              style={{ alignSelf: "center", marginBottom: 24 }}
            />
            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                color: "#000",
                textAlign: "center",
                lineHeight: 42,
                marginBottom: 16,
              }}
            >
              Health Concerns?
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: "#64748B",
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              Select any current or past issues (select all that apply)
            </Text>
            <View style={{ gap: 12 }}>
              {concerns.map((concern) => {
                const isSelected = petData.healthConcerns.includes(concern);
                return (
                  <TouchableOpacity
                    key={concern}
                    onPress={() => toggleConcern(concern)}
                    style={{
                      backgroundColor: isSelected ? "#3B82F6" : "#FFF",
                      borderRadius: 16,
                      padding: 20,
                      borderWidth: 2,
                      borderColor: isSelected ? "#3B82F6" : "#E2E8F0",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: isSelected ? "#FFF" : "#000",
                      }}
                    >
                      {concern}
                    </Text>
                    {isSelected && (
                      <CheckCircle size={20} color="#FFF" fill="#FFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      );
    }

    // Step 15: Photo Upload
    if (stepIndex === 14) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#8B5CF6",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <StatusBar style="light" />
          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: "#FFF",
              textAlign: "center",
              lineHeight: 42,
              marginBottom: 16,
            }}
          >
            Add {petData.name}'s{"\n"}Photo
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Show us that beautiful face! (Optional)
          </Text>
          {petData.photoUrl ? (
            <View style={{ alignItems: "center" }}>
              <Image
                source={{ uri: petData.photoUrl }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 100,
                  marginBottom: 24,
                }}
                contentFit="cover"
              />
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: "#FFF" }}
                >
                  Change Photo
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={pickImage}
              disabled={uploadLoading}
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: "rgba(255,255,255,0.2)",
                borderWidth: 3,
                borderColor: "#FFF",
                borderStyle: "dashed",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {uploadLoading ? (
                <Text style={{ color: "#FFF", fontSize: 16 }}>
                  Uploading...
                </Text>
              ) : (
                <>
                  <Camera size={48} color="#FFF" />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#FFF",
                      marginTop: 12,
                    }}
                  >
                    Tap to Upload
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // Step 16: Email Input
    if (stepIndex === 15) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            backgroundColor: "#000",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              padding: 32,
              paddingBottom: 120,
            }}
            showsVerticalScrollIndicator={false}
          >
            <StatusBar style="light" />
            <Mail
              size={64}
              color="#3B82F6"
              style={{ alignSelf: "center", marginBottom: 24 }}
            />
            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                color: "#FFF",
                textAlign: "center",
                lineHeight: 42,
                marginBottom: 16,
              }}
            >
              Your Email
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: "#9CA3AF",
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              We'll send {petData.name}'s analysis results here
            </Text>
            <TextInput
              value={petData.ownerEmail}
              onChangeText={(text) =>
                setPetData({ ...petData, ownerEmail: text })
              }
              placeholder="your@email.com"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                backgroundColor: "#1F2937",
                borderRadius: 16,
                padding: 20,
                fontSize: 18,
                color: "#FFF",
                borderWidth: 2,
                borderColor: "#374151",
              }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }

    // Step 17: Tier Selection
    if (stepIndex === 16) {
      const tiers = [
        {
          name: "FREE",
          price: "$0",
          features: [
            "3 basic categories",
            "Breed composition",
            "Basic health screen",
          ],
          color: "#6B7280",
        },
        {
          name: "PRO",
          price: "$99/yr",
          originalPrice: "$199",
          features: [
            "12 analysis categories",
            "Health predispositions",
            "Behavioral genetics",
            "Nutrition guidance",
            "Priority support",
          ],
          color: "#3B82F6",
          badge: "POPULAR",
        },
        {
          name: "ULTRA",
          price: "$199/yr",
          originalPrice: "$499",
          features: [
            "40+ categories",
            "AI triple-validation",
            "Longevity predictions",
            "Breeding compatibility",
            "Pharmacogenomics",
            "Vet consultation credits",
            "Lifetime updates",
          ],
          color: "#F59E0B",
          badge: "BEST VALUE",
        },
      ];

      return (
        <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
          <StatusBar style="dark" />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingTop: insets.top + 60,
              paddingHorizontal: 24,
              paddingBottom: 150,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "900",
                color: "#000",
                textAlign: "center",
                lineHeight: 38,
                marginBottom: 32,
              }}
            >
              Choose Your{"\n"}Insight Level
            </Text>
            <View style={{ gap: 16 }}>
              {tiers.map((tier) => {
                const isSelected = selectedTier === tier.name;
                return (
                  <TouchableOpacity
                    key={tier.name}
                    onPress={() => setSelectedTier(tier.name)}
                    style={{
                      backgroundColor: isSelected ? tier.color : "#FFF",
                      borderRadius: 20,
                      padding: 24,
                      borderWidth: 3,
                      borderColor: isSelected ? tier.color : "#E2E8F0",
                    }}
                  >
                    {tier.badge && (
                      <View
                        style={{
                          position: "absolute",
                          top: -12,
                          right: 20,
                          backgroundColor: "#EF4444",
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                          borderRadius: 999,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "900",
                            color: "#FFF",
                          }}
                        >
                          {tier.badge}
                        </Text>
                      </View>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: "900",
                          color: isSelected ? "#FFF" : "#000",
                        }}
                      >
                        {tier.name}
                      </Text>
                      {isSelected && (
                        <CheckCircle size={28} color="#FFF" fill="#FFF" />
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        marginBottom: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 40,
                          fontWeight: "900",
                          color: isSelected ? "#FFF" : "#000",
                        }}
                      >
                        {tier.price}
                      </Text>
                      {tier.originalPrice && (
                        <Text
                          style={{
                            fontSize: 16,
                            color: isSelected
                              ? "rgba(255,255,255,0.7)"
                              : "#9CA3AF",
                            marginLeft: 8,
                            textDecorationLine: "line-through",
                          }}
                        >
                          {tier.originalPrice}
                        </Text>
                      )}
                    </View>
                    <View style={{ gap: 12 }}>
                      {tier.features.map((feature, fidx) => (
                        <View
                          key={fidx}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <CheckCircle
                            size={18}
                            color={isSelected ? "#FFF" : tier.color}
                          />
                          <Text
                            style={{
                              fontSize: 15,
                              color: isSelected ? "#FFF" : "#1E293B",
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
          </ScrollView>
        </View>
      );
    }

    // Step 18: Final Success
    if (stepIndex === 17) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#10B981",
            justifyContent: "center",
            alignItems: "center",
            padding: 32,
          }}
        >
          <StatusBar style="light" />
          <Text style={{ fontSize: 80, marginBottom: 24 }}>🎉</Text>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "900",
              color: "#FFF",
              textAlign: "center",
              lineHeight: 42,
              marginBottom: 16,
            }}
          >
            You're All Set!
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            Let's analyze {petData.name}'s DNA and unlock their genetic story
          </Text>
          <View style={{ gap: 20, width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: 20,
                borderRadius: 16,
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFF",
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Camera size={24} color="#10B981" />
              </View>
              <Text style={{ fontSize: 18, color: "#FFF", fontWeight: "600" }}>
                Profile created ✓
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: 20,
                borderRadius: 16,
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFF",
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FileText size={24} color="#10B981" />
              </View>
              <Text style={{ fontSize: 18, color: "#FFF", fontWeight: "600" }}>
                Upload DNA next
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: 20,
                borderRadius: 16,
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFF",
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Brain size={24} color="#10B981" />
              </View>
              <Text style={{ fontSize: 18, color: "#FFF", fontWeight: "600" }}>
                Get instant insights
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return null;
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Progress Bar */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: insets.top,
          backgroundColor: "transparent",
          zIndex: 100,
        }}
      >
        <View
          style={{
            height: 4,
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        >
          <Animated.View
            style={{
              height: "100%",
              backgroundColor: "#3B82F6",
              width: progressWidth,
            }}
          />
        </View>
      </View>

      {/* Carousel */}
      <Carousel
        ref={carouselRef}
        width={width}
        height={height}
        data={Array.from({ length: totalSteps }, (_, i) => i)}
        renderItem={renderStep}
        onProgressChange={(_, absoluteProgress) => {
          setCurrentIndex(Math.round(absoluteProgress));
        }}
        enabled={true}
      />

      {/* Bottom Controls */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 32,
          backgroundColor: "rgba(0,0,0,0.9)",
        }}
      >
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: "#3B82F6",
            paddingVertical: 18,
            borderRadius: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "900", color: "#FFF" }}>
            {currentIndex === totalSteps - 1
              ? "Start Analyzing DNA"
              : "Continue"}
          </Text>
          <ArrowRight size={24} color="#FFF" strokeWidth={3} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Step {currentIndex + 1} of {totalSteps}
        </Text>
      </View>
    </View>
  );
}
