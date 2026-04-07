import { Tabs } from "expo-router";
import { PawPrint, Dna, Settings } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#F8FAFC", // Canvas background
          borderTopWidth: 1,
          borderColor: "#E2E8F0", // Slate-200 border
          paddingTop: 8,
          paddingBottom: 8,
          // height: 64, // removed for compliance
        },
        tabBarActiveTintColor: "#0F172A", // Deep Navy
        tabBarInactiveTintColor: "#64748B", // Muted foreground
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_500Medium", // Medium weight grotesque
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Pets",
          tabBarIcon: ({ color, size }) => (
            <PawPrint color={color} size={24} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="dna"
        options={{
          title: "DNA Analysis",
          tabBarIcon: ({ color, size }) => (
            <Dna color={color} size={24} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={24} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}
