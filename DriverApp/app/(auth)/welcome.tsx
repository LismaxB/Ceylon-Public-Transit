import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { onboarding } from "@/constants";
import CTA from "@/components/cta";

export default function Onboarding() {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;

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
            <Text className="text-black text-lg font-PoppinsLight">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CTA
        title={isLastSlide ? "Get Started" : "Next"}
        className="w-4/6 mt-10"
        onPress={() => {
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
