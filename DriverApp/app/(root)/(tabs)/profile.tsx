import { Text, SafeAreaView, View } from "react-native";
import React from "react";
import CTA from "@/components/cta";

import { supabase } from "@/lib/supabase";
import Input from "@/components/Input";
import Selector from "@/components/Selector";

const Profile = () => {
  const [busData, setBusData] = React.useState({
    bus_id: "",
    bus_no: "",
    bus_type: "",
    capacity: "",
    private: null as boolean | null,
  });

  const handleBusForm = async () => {
    if (busData.bus_no === "") return;

    const { data, error } = await supabase
      .from("BusData")
      .insert([
        {
          bus_number: busData.bus_no,
          bus_type: busData.bus_type,
          capacity: busData.capacity,
          private: busData.private,
        },
      ])
      .select("id")
      .limit(1);

    if (error) {
      console.error("Error inserting data:", error);
      alert("Error inserting data. Please try again.");
    }
    setBusData({ ...busData, bus_id: data ? data[0].id : "" });
    console.log(data ? data[0].id : "");
  };

  return (
    <SafeAreaView className="pt-24 p-5">
      <Text className="text-2xl font-PoppinsBold">Profile</Text>
      <View className="mt-4">
        <Input
          label="Bus No"
          placeholder="Enter Bus No. (ex. NC-5050)"
          value={busData.bus_no}
          containerStyle="border border-neutral-500"
          inputStyle="focus:border-2"
          onChangeText={(value) =>
            setBusData({ ...busData, bus_no: value.toUpperCase() })
          }
        />
        <Input
          label="Bus Type"
          placeholder="Normal/Semi-Luxury/Luxury"
          value={busData.bus_type}
          containerStyle="border border-neutral-500"
          inputStyle="focus:border-2"
          onChangeText={(value) => setBusData({ ...busData, bus_type: value })}
        />
        <Input
          label="Bus Capacity"
          placeholder="Enter Bus Capacity"
          value={busData.capacity}
          containerStyle="border border-neutral-500"
          inputStyle="focus:border-2"
          onChangeText={(value) => setBusData({ ...busData, capacity: value })}
          keyboardType="numeric"
        />
        <Selector
          placeholder="Select Bus Type"
          className="border-neutral-500"
          selectedValue={busData.private}
          items={[
            { label: "Private", value: "true" },
            { label: "CTB", value: "false" },
          ]}
          onValueChange={(value) =>
            setBusData({ ...busData, private: value === "true" })
          }
        />
      </View>
      <View className="flex mt-8 gap-10 items-center">
        <CTA title="Select Bus" onPress={handleBusForm} />
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
