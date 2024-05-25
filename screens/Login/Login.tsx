import { View, Text, Image } from "react-native";
import styles from "./Login.scss";

export default function LoginScreen() {
  return (
    <View style={styles.loginLayout}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      ></Image>
    </View>
  );
}
