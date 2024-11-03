import { SafeAreaView, View, Text, Alert } from "react-native";
import React, { useState, useEffect } from "react";

import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import CTA from "@/components/cta";

import * as Location from "expo-location";
import { useStore } from "@/store";
import { router } from "expo-router";
// import { TripProps } from "@/types/type";

const Home = () => {
  const [session, setSession] = useState<Session | null>(null);
  let rideStarted = false;
  const { bus_id } = useStore();

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return false;
    }
    return true;
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  const sendLocationToBackend = async (latitude: number, longitude: number) => {
    const { error } = await supabase.from("DriverLocations").insert({
      latitude,
      longitude,
      timestamp: new Date().toISOString(),
      driver_id: 5, // Genarate this!
      bus_id,
    });

    if (error) {
      console.log("Error sending Location", error);
      return;
    }
  };

  const handleStartTrip = async () => {
    if (!bus_id) router.replace("./profile");
    rideStarted = true;
    console.log("Starting Trip...");
    setInterval(async () => {
      const location = await getLocation();
      if (location && rideStarted) {
        await sendLocationToBackend(location.latitude, location.longitude);
      }
    }, 5000); // Send every 5 seconds
  };

  const endTrip = () => {
    if (rideStarted) {
      Alert.alert("Are you sure?", "Do you want to end the ride?", [
        {
          text: "Yes",
          onPress: () => {
            console.log("Trip Ended");
            rideStarted = false;
          },
        },
        { text: "No" },
      ]);
      console.log("Ending Trip...");
    }
  };

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
        <CTA
          title="Start Trip"
          className="mb-8 !w-64"
          onPress={handleStartTrip}
        />
        <CTA
          title="End Trip"
          className="!w-64"
          bgVariant="danger"
          onPress={endTrip}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
