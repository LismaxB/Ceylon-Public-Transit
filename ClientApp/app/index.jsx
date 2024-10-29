import { View, Text, StatusBar } from 'react-native'
import React from 'react'

export default function App(){
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-bold text-2xl color-black uppercase">index</Text>
      <StatusBar style="auto" />
    </View>
  )
};