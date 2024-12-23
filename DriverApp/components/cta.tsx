import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { ButtonProps } from "@/types/type";

const getBgVariantStyle = (varient: ButtonProps["bgVariant"]) => {
  switch (varient) {
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-neutral-400 border-[0.5px]";
    default:
      return "bg-black";
  }
};

const getTextVariantStyle = (varient: ButtonProps["textVariant"]) => {
  switch (varient) {
    case "primary":
      return "text-white";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-600";
    case "success":
      return "text-green-100";
    default:
      return "text-white";
  }
};

const CTA = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  ...props
}: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`w-full rounded-2xl px-4 py-2 min-w-40 min-h-11 flex justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(
      bgVariant
    )} ${className}`}
    {...props}
  >
    {IconLeft && <IconLeft />}
    <Text
      className={`text-xl ${getTextVariantStyle(textVariant)}`}
      style={{ fontFamily: "PoppinsMedium" }}
    >
      {title}
    </Text>
    {IconRight && <IconRight />}
  </TouchableOpacity>
);

export default CTA;
