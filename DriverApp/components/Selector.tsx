import React from "react";
import { Picker } from "@react-native-picker/picker";

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
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => onValueChange(itemValue)}
        {...props}
      >
        {items.map(
          (
            item: { label: string | undefined; value: string | null },
            index: React.Key | null | undefined
          ) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          )
        )}
      </Picker>
    </View>
  </View>
);

export default Selector;
