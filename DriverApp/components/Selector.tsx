import React from "react";
import PickerSelect from "react-native-picker-select";

import { SelectorProps } from "@/types/type";
import { View, Text } from "react-native";

const Selector = ({
  onValueChange,
  selectedValue,
  placeholder,
  items,
  className,
  ...props
}: SelectorProps) => (
  <View className="my-2">
    <Text className="text-black text-lg font-PoppinsSemiBold mb-3">
      {placeholder}
    </Text>
    <View className={`border border-neutral-100 rounded-xl ${className}`}>
      <PickerSelect
        onValueChange={(value) => onValueChange(value)}
        items={items}
        value={selectedValue}
        placeholder={{ label: placeholder, value: null }}
        {...props}
      />
    </View>
  </View>
);

export default Selector;
