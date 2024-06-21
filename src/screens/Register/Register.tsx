import React, { useState } from "react";
import { Text, TextInput, Image, TouchableOpacity, View, Alert, KeyboardAvoidingView, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

import styles from "./Register.scss";
import Spinner from "../../components/Spinner/Spinner";
import SportSelect from "../../components/SportSelect/SportSelect";
import { IUser, SportType, sportTypeList } from "../../common/types";

import Octicons from '@expo/vector-icons/Octicons';
import { launchImagePicker } from "../../utils/initialize";
import CloudinaryService from "../../services/CloudinaryService";
import AuthService from "../../services/AuthService";

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [user, setUser] = useState<IUser>({
    fullName: "",
    email: "",
    password: "",
    imageUrl: "",
    id:"",
    favoriteSport: sportTypeList[0],
  });
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleError = (text: string) => {
    Alert.alert("Error", text, [{ text: "OK", onPress: () => console.log("OK Pressed") }], { cancelable: false });
  };

  async function handleRegister() {
    if (user.email == "" || user.password == "" || user.fullName == "" || !imageUri) {
      Alert.alert("Error", "Please fill in all fields and select an image.");
      return;
    }
    setLoading(true);
    try {
      const imageUrl = await CloudinaryService.uploadImage(imageUri, "");
      await AuthService.register({
        ...user,
        imageUrl,
      });
      // navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const handleImagePicker = async () => {
    const uri = await launchImagePicker([4,4]);
    setImageUri(uri);
  };

  function handleSportTypeChange(sportType: SportType) {
    setUser({ ...user, favoriteSport: sportType });
  }

  return (
    <>
      {loading ? (
        <Spinner size="l" />
      ) : (
        <ScrollView style={styles.scrollBox}>
          <View style={styles.registerBox}>
            <View style={styles.formBox}>
              <View style={styles.imageBox}>{imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}</View>
              <TouchableOpacity style={styles.imgButton} onPress={handleImagePicker}>
                <Octicons name="image" style={styles.imgIcon} />
                <Text style={styles.imgBtnText}>Choose image</Text>
              </TouchableOpacity>
              <TextInput style={styles.input} placeholder="Full Name" value={user.fullName} onChangeText={(val) => setUser({ ...user, fullName: val })} />
              <TextInput style={styles.input} placeholder="Email" value={user.email} onChangeText={(val) => setUser({ ...user, email: val })} autoCapitalize="none" keyboardType="email-address" />
              <TextInput style={styles.input} placeholder="Password" value={user.password} onChangeText={(val) => setUser({ ...user, password: val })} secureTextEntry />
              <Text style={styles.favText}>Your Favorite Sport</Text>
              <SportSelect theme="secondary" onChange={handleSportTypeChange} vibrate/>
              <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
}
