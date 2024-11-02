import CTA from "@/components/cta";
import Input from "@/components/Input";
import React from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";

export default function SignUp() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const onSignUp = async () => {};

  return (
    <ScrollView className="flex-1 bg-white p-5">
      <TouchableOpacity
        className="flex w-full justify-end items-end py-6"
        onPress={() => {
          router.replace("/home");
        }}
      >
        <Text className="text-black text-xl font-PoppinsLight">Skip</Text>
      </TouchableOpacity>
      <Text className="text-3xl text-black font-PoppinsSemiBold mb-6">
        Sign Up
      </Text>
      <View className="flex-1">
        <Input
          label="Full Name"
          placeholder="Enter you name"
          value={form.name}
          onChangeText={(value) => setForm({ ...form, name: value })}
        />
        <Input
          label="Email"
          placeholder="Enter you email address"
          value={form.email}
          onChangeText={(value) => setForm({ ...form, email: value })}
        />
        <Input
          label="Password"
          placeholder="Enter you password"
          value={form.password}
          onChangeText={(value) => setForm({ ...form, password: value })}
        />
        <View className="flex justify-center items-center">
          <CTA
            title="Sign Up"
            className="!w-5/12 mt-10 mb-10"
            onPress={onSignUp}
          />
        </View>
        <Link href="/(auth)/sign-in" className="text-center">
          <Text className="text-black text-md font-PoppinsLight text-center">
            Already have an account?{" "}
          </Text>
          <Text className="text-blue-500 text-md font-PoppinsMedium text-center">
            Sign In
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}
