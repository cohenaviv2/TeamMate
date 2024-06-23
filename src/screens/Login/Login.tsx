import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, TextInput, Image, Keyboard } from "react-native";
import styles from "./Login.scss";
import Loading from "../Loading/Loading";
import AuthService from "../../services/AuthService";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInputPressed, setIsInputPressed] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setIsInputPressed(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsInputPressed(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill out all the fields");
      return;
    }
    setLoading(true);
    try {
      await AuthService.login(email, password);
    } catch (error: any) {
      console.log(error);
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setError(null);
  };

  return (
    <>
      {loading ? (
        <Loading spinnerSize="l" />
      ) : (
        <View style={styles.loginLayout}>
          <CustomAlert
            visible={!!error}
            title="Error"
            content={error!}
            onClose={handleCloseAlert}
            buttons={[
              {
                text: "Close",
                onPress: handleCloseAlert,
              },
            ]}
          />
          <View style={[styles.logoBox,{marginBottom: isInputPressed ? 32 : 0,marginTop:isInputPressed?64:0}]}>
            <Text style={styles.welcomeText}>Welcome To</Text>
            <Image source={require("../../assets/images/logo2.png")} style={styles.logo} />
          </View>
          {!isInputPressed && (
            <View style={styles.registerBox}>
              <Text style={styles.registerText}>Don't have an account yet?</Text>
              <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
                <Text style={styles.buttonText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.loginBox}>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" onFocus={() => setIsInputPressed(true)} onBlur={() => setIsInputPressed(false)} />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry onFocus={() => setIsInputPressed(true)} onBlur={() => setIsInputPressed(false)} />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}
