import { GestureResponderEvent, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type TButtonProps = {
  label: string;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
  disabled?: boolean | undefined;
  color?: ButtonColor;
};

export enum ButtonColor {
  ORANGE = "orange",
  BLUE = "blue",
}

const gradientColors = {
  [ButtonColor.ORANGE]: ["#ffc0a0", "#ffdeba"] as const,
  [ButtonColor.BLUE]: ["#a0cbff", "#a0b9ff"] as const,
};

const ButtonGradient: React.FC<TButtonProps> = ({
  label,
  onPress,
  color = ButtonColor.ORANGE,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          paddingHorizontal: 32,
          paddingVertical: 14,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        colors={gradientColors[color]}
      >
        <Text>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default ButtonGradient;
