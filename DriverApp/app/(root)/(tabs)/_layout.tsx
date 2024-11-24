import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { View, Image, ImageSourcePropType } from "react-native";

import { icons } from "@/constants";

import * as Notifications from "expo-notifications";

const TabIcon = ({
  source,
  focused,
}: {
  source: ImageSourcePropType;
  focused: boolean;
}) => (
  <View>
    <View>
      <Image
        alt="Home"
        source={source}
        tintColor={`${focused ? "red" : "black"}`}
        resizeMode="contain"
        className="w-7 h-7"
      />
    </View>
  </View>
);

export default function RootLayout() {
  useEffect(() => {
    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission for notifications is required.");
      }
    };

    requestPermissions();
  }, []);
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "black",
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          overflow: "hidden",
          borderRadius: 20,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.settings} />
          ),
        }}
      />
    </Tabs>
  );
}
