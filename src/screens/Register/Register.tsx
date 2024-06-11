import React, { useState } from "react";
import { Text, TextInput, Image, TouchableOpacity, View, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthService } from "../../utils/AuthService";
import Layout from "../../components/Layout/Layout";
import { FirebaseError } from "firebase/app";
import styles from "./Register.scss";
import Spinner from "../../components/Spinner/Spinner";
import SportSelect from "../../components/SportSelect/SportSelect";
import { IUser, SportType, sportTypeList } from "../../common/types";
import { uploadImage } from "../../utils/cloudinaryService";

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [user, setUser] = useState<IUser>({
    fullName: "",
    email: "",
    password: "",
    imageUrl: "",
    favoriteSport: sportTypeList[0],
  });
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleError = (text: string) => {
    Alert.alert("Error", text, [{ text: "OK", onPress: () => console.log("OK Pressed") }], { cancelable: false });
  };

  async function handleRegister() {
    if (!user.email || !user.password || !user.fullName || !imageUri) {
      Alert.alert("Error", "Please fill in all fields and select an image.");
      return;
    }
    setLoading(true);
    try {
      const imageUrl = await uploadImage(imageUri, "");
      await AuthService.register({
        ...user,
        imageUrl,
      });
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
      Alert.alert("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });
    if (pickerResult.canceled) return;
    const uri = pickerResult.assets[0].uri;
    setImageUri(uri);
  };

  function handleSportTypeChange(sportType: SportType) {
    setUser({ ...user, favoriteSport: sportType });
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <View style={styles.formBox}>
              <View style={styles.imageBox}>{user.imageUrl != "" && <Image source={{ uri: user.imageUrl }} style={styles.image} />}</View>
              <TouchableOpacity style={styles.imgButton} onPress={handleImagePicker}>
                <Text>Choose image</Text>
              </TouchableOpacity>
              <TextInput style={styles.input} placeholder="Full Name" value={user.fullName} onChangeText={(val) => setUser({ ...user, fullName: val })} />
              <TextInput style={styles.input} placeholder="Email" value={user.email} onChangeText={(val) => setUser({ ...user, email: val })} keyboardType="email-address" />
              <TextInput style={styles.input} placeholder="Password" value={user.password} onChangeText={(val) => setUser({ ...user, password: val })} secureTextEntry />
              <Text>Your Favorite Sport</Text>
              <SportSelect onChange={handleSportTypeChange} />
              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={{ fontSize: 20 }}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   input: {
//     width: "80%",
//     height: 40,
//     borderWidth: 1,
//     borderColor: "gray",
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     marginVertical: 10,
//   },
// });
