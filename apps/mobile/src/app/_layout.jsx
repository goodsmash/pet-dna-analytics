import { useAuth } from "@/utils/auth/useAuth";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initiate, isReady } = useAuth();
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    initiate();
    checkOnboarding();
  }, [initiate]);

  const checkOnboarding = async () => {
    try {
      const completed = await AsyncStorage.getItem("onboarding_completed");
      if (!completed) {
        // Onboarding not completed, will redirect in index
      }
      setOnboardingChecked(true);
    } catch (error) {
      console.error("Error checking onboarding:", error);
      setOnboardingChecked(true);
    }
  };

  useEffect(() => {
    if (isReady && onboardingChecked) {
      SplashScreen.hideAsync();
    }
  }, [isReady, onboardingChecked]);

  if (!isReady || !onboardingChecked) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
          <Stack.Screen name="index" />
          <Stack.Screen
            name="onboarding/welcome"
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
