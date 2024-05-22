import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import styles from "./App.scss";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TeamMate!</Text>
      <StatusBar style="auto" />
    </View>
  );
}