import { SafeAreaView, Text } from "react-native";
import React, { useState, useEffect } from "react";

import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

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
    <SafeAreaView className="mt-10">
      <Text>Home</Text>
      {session && <Text>{session.user?.id}</Text>}
    </SafeAreaView>
  );
};

export default Home;
