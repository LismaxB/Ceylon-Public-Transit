import { SafeAreaView, View, Text } from "react-native";
import React, { useState, useEffect } from "react";

import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import CTA from "@/components/cta";

const Home = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <SafeAreaView className="pt-24 p-5">
      <Text className="text-2xl font-PoppinsBold">
        Welcome, {session?.user.user_metadata.name} ! 👋
      </Text>
      <View className="mt-10 flex justify-center items-center">
        <CTA title="Start Trip" className="mb-8 !w-64" />
        <CTA title="End Trip" className="!w-64" bgVariant="danger" />
      </View>
    </SafeAreaView>
  );
};

export default Home;
