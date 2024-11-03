import { Text, SafeAreaView, View } from "react-native";
import React from "react";
import CTA from "@/components/cta";

import { supabase } from "@/lib/supabase";

const Profile = () => {
  return (
    <SafeAreaView className="pt-24 p-5">
      <Text className="text-2xl font-PoppinsBold">Profile</Text>
      <View className="flex mt-8">
        <CTA
          title="Sign Out"
          className="w-5/12 shadow-none"
          onPress={() => supabase.auth.signOut()}
          bgVariant="outline"
          textVariant="danger"
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
