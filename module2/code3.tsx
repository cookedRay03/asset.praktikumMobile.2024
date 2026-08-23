import {
  Pressable,
  Text,
} from "react-native";

import { buttonStyles } from "@/styles";

type PageButtonProps = {
  title: string;
  onPress: () => void;
};

export default function PageButton({
  title,
  onPress,
}: PageButtonProps) {
  return (
    <Pressable
      style={buttonStyles.button}
      onPress={onPress}
    >
      <Text style={buttonStyles.text}>
        {title}
      </Text>
    </Pressable>
  );
}