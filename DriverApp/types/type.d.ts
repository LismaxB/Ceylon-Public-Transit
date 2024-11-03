/* eslint-disable @typescript-eslint/no-explicit-any */
import { TouchableOpacityProps, TextInputProps } from "react-native";

declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
  }

  declare interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
  }

  declare interface SelectorProps{
    placeholder: string;
    items: Array;
    onValueChange: (value: T | null) => void;
    selectedValue: T | null;
    className?: string;
  }