import { View, TouchableOpacity, Text, TextInput, Image,KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import { AuthService } from "../../utils/AuthService";
import styles from "./Login.scss";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<any>();

  const handleLogin = async () => {
    try {
      await AuthService.login(email, password);
    } catch (error) {
      setError(error);
    }
  };
  return (
    <KeyboardAvoidingView style={styles.loginLayout} enabled behavior="padding">
      <View style={styles.logoBox}>
        <Text style={styles.welcomeText}>Welcome To</Text>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo}></Image>
      </View>
      <View style={styles.loginBox}>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {error ? <Text>{error}</Text> : null}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.registerBox}>
        <Text style={styles.registerText}>Don't have an account yet?</Text>
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.btnText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
