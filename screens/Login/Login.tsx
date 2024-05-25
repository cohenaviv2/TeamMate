import { View, Image, Button, TouchableOpacity,Text } from "react-native";
import styles from "./Login.scss";

export default function LoginScreen() {
  return (
    <View style={styles.loginLayout}>
      <Text style={styles.welcomeText}>Welcome To</Text>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      ></Image>
      <View style={styles.buttonsBox}>
        <TouchableOpacity style={styles.loginButton}>
          <Text>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton}>
          <Text>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.facebookButton}>
          <Text>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.registerText}>Don't have an account yet?</Text>
      <View style={styles.buttonsBox}>
        <TouchableOpacity style={styles.registerButton}>
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
