import { supabase } from "@/lib/supabase";
import { AuthSession } from "@supabase/supabase-js";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Home() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchSession();
  }, []);

  if (loading) return null; // add a loading screen here

  if (session) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
