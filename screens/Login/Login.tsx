import { View, Image, TouchableOpacity, Text } from "react-native";
import styles from "./Login.scss";
import { useState } from "react";
import RegisterScreen from "../Register/Register";
import { IUser } from "../../common/types";
import Signin from "../Signin/Signin";

interface LoginProps {
  setAuthUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export default function LoginScreen({ setAuthUser }: LoginProps) {
  const [showScreen, setShowScreen] = useState<"register" | "signin" | null>(
    null
  );

  function handleRegisterPress() {
    setShowScreen("register");
  }

  function handleSigninPress() {
    setShowScreen("signin");
  }

  if (showScreen == "register") {
    return (
      <RegisterScreen setAuthUser={setAuthUser} setShowScreen={setShowScreen} />
    );
  } else if (showScreen == "signin") {
    return <Signin setAuthUser={setAuthUser} setShowScreen={setShowScreen} />;
  } else
    return (
      <View style={styles.loginLayout}>
        <Text style={styles.welcomeText}>Welcome To</Text>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        ></Image>
        <View style={styles.buttonsBox}>
          <TouchableOpacity style={styles.loginButton} onPress={handleSigninPress}>
            <Text style={{ fontSize: 16 }}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.googleButton}>
            <Text style={{ fontSize: 16 }}>Continue with Google</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.facebookButton}>
            <Text>Continue with Facebook</Text>
          </TouchableOpacity> */}
        </View>
        <Text style={styles.registerText}>Don't have an account yet?</Text>
        <View style={styles.buttonsBox}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegisterPress}
          >
            <Text style={{ fontSize: 16 }}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
}
