import { SafeAreaView, View, Text, Alert, Image } from "react-native";
import React, { useState, useEffect } from "react";

import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import CTA from "@/components/cta";

import * as Location from "expo-location";
import { useStore } from "@/store";
import { router } from "expo-router";
// import { TripProps } from "@/types/type";

import { icons } from "@/constants";

const Home = () => {
  const [session, setSession] = useState<Session | null>(null);
  let rideStarted = false;
  const { bus_id } = useStore();
  const { busDetails } = useStore();
  const [busIcon, setBusIcon] = useState(icons.bus);

  const requestLocationPermission = async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (foregroundStatus && backgroundStatus !== "granted") {
      console.log("Permission to access location was denied");
      Alert.alert("Permission to access location was denied! Try Again!");
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
      driver_id: session?.user.id,
      bus_id,
    });

    if (error) {
      console.log("Error sending Location", error);
      return;
    }
  };

  const handleStartTrip = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission || rideStarted) return;
    if (!bus_id) {
      router.replace("./profile");
    } else {
      rideStarted = true;
      console.log("Starting Trip...");
      setInterval(async () => {
        const location = await getLocation();
        if (location && rideStarted) {
          await sendLocationToBackend(location.latitude, location.longitude);
        }
      }, 5000); // Send every 5 seconds
    }
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

  useEffect(() => {
    if (busDetails) {
      if (busDetails.private) {
        setBusIcon(icons.privateBus);
      }
      if (busDetails.bus_type === "Luxury") {
        setBusIcon(icons.luxuryBus);
      }
    }
  }, [busDetails]);

  return (
    <SafeAreaView className="flex-1 pt-24 justify-between">
      <View className="p-5">
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
      </View>

      {busDetails.active && (
        <View className="mt-10 bg-white border border-neutral-300 rounded-2xl p-6">
          <Text className="text-xl font-PoppinsBold">Selected Bus Details</Text>
          <View className="mt-6 flex-row gap-6">
            <Image alt="CTB Bus" source={busIcon} className="h-24 w-24" />
            <View className="flex justify-between">
              <View className="flex-row justify-between gap-6">
                <View className="bg-yellow-400 rounded-xl p-2 justify-center">
                  <Text className="text-xl font-bold">
                    {busDetails.bus_number}
                  </Text>
                </View>
                <View className="flex-row gap-2 items-center border border-neutral-300 rounded-xl p-2">
                  <Image
                    alt="Passenger"
                    source={icons.users}
                    className="h-7 w-7"
                  />
                  <Text className="text-lg">{busDetails.capacity}</Text>
                </View>
              </View>
              <View className="gap-1 mt-2">
                <Text className="text-lg">Type: {busDetails.bus_type}</Text>
                <Text className="text-lg">
                  {busDetails.private ? "Private" : "CTB"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;
