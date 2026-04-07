// Complete RevenueCat Integration for Mobile
import { useCallback, useState, useEffect } from "react";
import { Platform } from "react-native";
import Purchases, { LOG_LEVEL, PRODUCT_CATEGORY } from "react-native-purchases";
import { create } from "zustand";

const useInAppPurchaseStore = create((set) => ({
  isReady: false,
  offerings: null,
  isSubscribed: false,
  currentTier: "FREE",
  setIsSubscribed: (isSubscribed) => set({ isSubscribed }),
  setCurrentTier: (tier) => set({ currentTier: tier }),
  setOfferings: (offerings) => set({ offerings }),
  setIsReady: (isReady) => set({ isReady }),
}));

function useInAppPurchase() {
  const {
    isReady,
    offerings,
    setOfferings,
    setIsSubscribed,
    isSubscribed,
    setIsReady,
    currentTier,
    setCurrentTier,
  } = useInAppPurchaseStore();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const getRevenueCatAPIKey = useCallback(() => {
    if (process.env.EXPO_PUBLIC_CREATE_ENV === "DEVELOPMENT") {
      return process.env.EXPO_PUBLIC_REVENUE_CAT_TEST_STORE_API_KEY;
    }
    if (Platform.OS === "ios") {
      return process.env.EXPO_PUBLIC_REVENUE_CAT_APP_STORE_API_KEY;
    }
    if (Platform.OS === "android") {
      return process.env.EXPO_PUBLIC_REVENUE_CAT_PLAY_STORE_API_KEY;
    }
    console.warn("Running on unknown platform, defaulting to Test Store");
    return process.env.EXPO_PUBLIC_REVENUE_CAT_TEST_STORE_API_KEY;
  }, []);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/revenue-cat/get-subscription-status", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to check subscription status");
      }

      const data = await response.json();
      setIsSubscribed(data.hasAccess || false);
      setCurrentTier(data.tier || "FREE");
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setIsSubscribed(false);
      setCurrentTier("FREE");
    }
  }, [setIsSubscribed, setCurrentTier]);

  const initiateInAppPurchase = useCallback(async () => {
    try {
      Purchases.setLogLevel(LOG_LEVEL.INFO);

      const apiKey = getRevenueCatAPIKey();

      if (apiKey) {
        await Purchases.configure({ apiKey });

        // Fetch offerings and subscription status in parallel
        await Promise.allSettled([
          Purchases.getOfferings().then(setOfferings),
          fetchSubscriptionStatus(),
        ]);
      }
    } catch (error) {
      console.warn("Failed to initialize RevenueCat:", error);
    } finally {
      setIsReady(true);
    }
  }, [getRevenueCatAPIKey, setOfferings, fetchSubscriptionStatus, setIsReady]);

  const getAvailableSubscriptions = useCallback(() => {
    const offering = offerings?.current;

    if (!offering) {
      throw new Error("No offering found");
    }

    return offering.availablePackages.filter(
      (pkg) => pkg.product.productCategory === PRODUCT_CATEGORY.SUBSCRIPTION,
    );
  }, [offerings]);

  const startSubscription = useCallback(
    async ({ subscription, userId }) => {
      try {
        setIsPurchasing(true);

        if (!userId) {
          throw new Error("User not authenticated");
        }

        await Purchases.setAttributes({ userId });
        await Purchases.logIn(userId);
        await Purchases.purchasePackage(subscription);
        await fetchSubscriptionStatus();

        return true;
      } catch (error) {
        console.error("Failed to start subscription:", error);
        return false;
      } finally {
        setIsPurchasing(false);
      }
    },
    [fetchSubscriptionStatus],
  );

  const restorePurchases = useCallback(async () => {
    try {
      setIsPurchasing(true);
      await Purchases.restorePurchases();
      await fetchSubscriptionStatus();
      return true;
    } catch (error) {
      console.error("Failed to restore purchases:", error);
      return false;
    } finally {
      setIsPurchasing(false);
    }
  }, [fetchSubscriptionStatus]);

  return {
    isReady,
    isSubscribed,
    currentTier,
    offerings,
    isPurchasing,
    initiateInAppPurchase,
    getAvailableSubscriptions,
    startSubscription,
    restorePurchases,
    fetchSubscriptionStatus,
  };
}

export default useInAppPurchase;
