import { View, TouchableOpacity, Text, TextInput, Image, KeyboardAvoidingView, Alert } from "react-native";
import { useState } from "react";
import { AuthService } from "../../services/AuthService";
import styles from "./Login.scss";
import Spinner from "../../components/Spinner/Spinner";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      await AuthService.login(email, password);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner size="l" />
      ) : (
        <View style={styles.loginLayout} >
          <View style={styles.logoBox}>
            <Text style={styles.welcomeText}>Welcome To</Text>
            <Image source={require("../../assets/images/logo2.png")} style={styles.logo}></Image>
          </View>
          <View style={styles.registerBox}>
            <Text style={styles.registerText}>Don't have an account yet?</Text>
            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.loginBox}>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            {error ? <Text>{error}</Text> : null}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}
