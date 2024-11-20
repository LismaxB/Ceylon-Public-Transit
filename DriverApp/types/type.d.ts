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

  declare interface BusDataProps{
    bus_number:string;
    bus_type:string;
    capacity:number;
    private:boolean;
    active:boolean;
    created_at:string;
  }

  declare interface StoreProps {
    bus_id:string;
    setBusId:(string)=>void;
    busDetails:BusDataProps;
    setBusDetails:(BusDataProps)=>void;
  }

  declare interface TripProps{
    latitude:number;
    longitude:number;
  }