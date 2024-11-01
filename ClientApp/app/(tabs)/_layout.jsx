import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";

import icons from "../../constants/icons";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className='items-center justify-center gap-1'>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{width: 25, height: 25}}
      />
      <Text
        className={`text-xs ${focused ? "font-[Poppins-Bold]" : "text-gray-500"}`}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  return (
    <>
      <Tabs screenOptions={{tabBarShowLabel:false}}>
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon:({color, focused}) => (
            <TabIcon icon={icons.Home} color={color} name="Home" focused={focused} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon:({color, focused}) => (
            <TabIcon icon={icons.Settings} color={color} name="Settings" focused={focused} />
          )
        }}
      />
      </Tabs>
    </>
  );
};

export default TabLayout;
