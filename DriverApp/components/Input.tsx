import { InputFieldProps } from "@/types/type";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";

const Input = ({
  label,
  labelStyle,
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  ...props
}: InputFieldProps) => (
  <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="my-2 w-full">
        <Text
          className={`text-black text-lg font-PoppinsSemiBold mb-3 ${labelStyle}`}
        >
          {label}
        </Text>
        <View
          className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-2xl border border-neutral-100 focus:border-blue-500 ${containerStyle}`}
        >
          <TextInput
            secureTextEntry={secureTextEntry}
            className={`p-4 rounded-xl text-black text-lg font-PoppinsMedium flex-1 text-left ${inputStyle}`}
            {...props}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

export default Input;
