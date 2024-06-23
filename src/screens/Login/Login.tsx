import { View, TouchableOpacity, Text, TextInput, Image } from "react-native";
import { useState } from "react";
import styles from "./Login.scss";
import Spinner from "../../components/Spinner/Spinner";
import Loading from "../Loading/Loading";
import AuthService from "../../services/AuthService";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertVisible(true);
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
    setAlertVisible(false);
    setError(null);
  };

  return (
    <>
      {loading ? (
        <Loading spinnerSize="l" />
      ) : (
        <View style={styles.loginLayout}>
          <CustomAlert
            visible={alertVisible || !!error}
            title={error ? "Error" : "Incomplete Information"}
            content={error ? error : "Please fill out all the fields"}
            onClose={handleCloseAlert}
            buttons={[
              {
                text: "OK",
                onPress: handleCloseAlert,
              },
            ]}
          />
          <View style={styles.logoBox}>
            <Text style={styles.welcomeText}>Welcome To</Text>
            <Image source={require("../../assets/images/logo2.png")} style={styles.logo} />
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
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}
