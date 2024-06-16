import { View, Image, ActivityIndicator } from "react-native";
import styles from "./Loading.scss";

interface SpinnerProps {
  spinnerSize: "s" | "m" | "l";
  color?: string;
}

const Loading = ({ spinnerSize, color }: SpinnerProps) => {
  return (
    <View style={styles.spinnerBox} accessibilityRole="progressbar">
      <Image source={require("../../assets/images/logo2.png")} style={styles.logo}></Image>
      <ActivityIndicator size={spinnerSize === "s" ? 20 : spinnerSize === "m" ? 30 : 40} color={"#ce7a39"} />
    </View>
  );
};

export default Loading;
