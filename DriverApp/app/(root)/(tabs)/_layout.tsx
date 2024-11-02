import { Tabs } from "expo-router";
import { View, Image, ImageSourcePropType } from "react-native";

import { icons } from "@/constants";

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
