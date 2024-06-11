import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { IUser } from "../../common/types";
import Layout from "../../components/Layout/Layout";
import styles from "./Signin.scss";
import { AuthService } from "../../utils/AuthService";
import { FirebaseError } from "firebase/app";

interface SigninProps {
  setAuthUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  setShowScreen: React.Dispatch<
    React.SetStateAction<"register" | "signin" | null>
  >;
}

export default function Signin({ setAuthUser, setShowScreen }: SigninProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FirebaseError | null>(null);

  const handleError = (error: any) => {
    Alert.alert(
      "Error",
      error.message || "An unexpected error occurred.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };

  async function handleSignin() {
    setLoading(true);
    try {
      const user = await AuthService.login(email, password);
      setAuthUser(user);
    } catch (error) {
      if (error instanceof FirebaseError) setError(error);
      handleError(error);
      console.error("Error registering user:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleGoBack() {
    setShowScreen(null);
  }

  return (
    <Layout>
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.signinBox}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(val) => setPassword(val)}
          secureTextEntry
        />
        <TouchableOpacity style={styles.signinButton} onPress={handleSignin}>
          <Text style={{ fontSize: 20 }}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text>Back</Text>
      </TouchableOpacity>
    </Layout>
  );
}
