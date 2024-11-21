import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { onboarding } from "@/constants";
import CTA from "@/components/cta";

import * as Location from "expo-location";

export default function Onboarding() {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;

  const requestLocationPermission = async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (foregroundStatus && backgroundStatus !== "granted") {
      console.log("Permission to access location was denied");
      Alert.alert("Permission to access location was denied! Try Again!");
      return false;
    }
    return true;
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white py-5">
      <TouchableOpacity
        className="flex w-full justify-end items-end p-6"
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }}
      >
        <Text className="text-black text-xl font-PoppinsLight">Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0]" />}
        activeDot={<View className="w-[32px] h-[4px] mx-1 bg-[#0286FF]" />}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex items-center justify-center">
            <Text className="text-black text-3xl font-PoppinsSemiBold">
              {item.title}
            </Text>
            <Text className="text-black text-lg font-PoppinsLight py-4 px-6 text-center">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CTA
        title={isLastSlide ? "Get Started" : "Next"}
        className="!w-5/12 mt-10 mb-10"
        onPress={async () => {
          if (activeIndex === 1) {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) return;
          }
          if (isLastSlide) {
            router.replace("/(auth)/sign-up");
          } else {
            swiperRef.current?.scrollBy(1);
          }
        }}
      />
    </SafeAreaView>
  );
}
