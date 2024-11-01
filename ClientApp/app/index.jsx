import { View, Text, StatusBar, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font-[Poppins-Black] text-bold text-2xl color-black uppercase">
        index
      </Text>
      <Link href="/signin" className="text-blue-500">
        Sign In
      </Link>
      <Link href="/settings" className="text-blue-500">
        Settings
      </Link>
      <StatusBar barStyle="default" />
    </View>
  );
}
