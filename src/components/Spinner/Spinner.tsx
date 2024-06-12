import { View, Image, ActivityIndicator } from "react-native";
import styles from "./Spinner.scss";

interface SpinnerProps {
  size: "s" | "m" | "l";
  color?: string;
}

const Spinner = ({ size, color }: SpinnerProps) => {
  return (
    <View style={styles.spinnerBox} accessibilityRole="progressbar">
      <Image source={require("../../assets/images/logo.png")} style={styles.logo}></Image>
      <ActivityIndicator size={size === "s" ? 20 : size === "m" ? 30 : 40} color={"#ce7a39"} />
    </View>
  );
};

export default Spinner;
