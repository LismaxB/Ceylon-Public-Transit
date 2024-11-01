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
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-[#0286FF]";
  }
};

const getTextVariantStyle = (varient: ButtonProps["textVariant"]) => {
  switch (varient) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
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
    className={`w-full rounded-2xl p-3 flex justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(
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
