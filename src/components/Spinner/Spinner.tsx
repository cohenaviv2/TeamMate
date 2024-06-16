import { View, Image, ActivityIndicator } from "react-native";
import styles from "./Spinner.scss";

interface SpinnerProps {
  size: "s" | "m" | "l";
  theme:"primary"|"secondary";
}

const Spinner = ({ size, theme }: SpinnerProps) => {
  return (
    <View style={styles.spinnerBox} accessibilityRole="progressbar">
      <ActivityIndicator size={size === "s" ? 20 : size === "m" ? 30 : 40} color={theme == "primary" ? "#f3b909" : "#ce7a39"} />
    </View>
  );
};

export default Spinner;
