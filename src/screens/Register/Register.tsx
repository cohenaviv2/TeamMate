import React, { useState } from "react";
import { Text, TextInput, Image, TouchableOpacity, View, Alert, KeyboardAvoidingView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthService } from "../../services/AuthService";
import styles from "./Register.scss";
import Spinner from "../../components/Spinner/Spinner";
import SportSelect from "../../components/SportSelect/SportSelect";
import { IUser, SportType, sportTypeList } from "../../common/types";
import { uploadImage } from "../../services/cloudinaryService";
import Octicons from '@expo/vector-icons/Octicons';

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
      aspect: [4, 4],
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
        <Spinner size="l" />
      ) : (
        <KeyboardAvoidingView style={styles.registerBox} behavior="height">
          <View style={styles.formBox}>
            <View style={styles.imageBox}>{imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}</View>
            <TouchableOpacity style={styles.imgButton} onPress={handleImagePicker}>
              <Octicons name="image" style={styles.imgIcon} />
              <Text style={styles.imgBtnText}>Choose image</Text>
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Full Name" value={user.fullName} onChangeText={(val) => setUser({ ...user, fullName: val })} />
            <TextInput style={styles.input} placeholder="Email" value={user.email} onChangeText={(val) => setUser({ ...user, email: val })} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" value={user.password} onChangeText={(val) => setUser({ ...user, password: val })} secureTextEntry />
            <Text style={styles.favText}>Your Favorite Sport</Text>
            <SportSelect onChange={handleSportTypeChange} />
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={{ fontSize: 20 }}>Register</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
