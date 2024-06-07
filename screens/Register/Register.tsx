import React, { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserService } from "../../utils/UserService";
import Layout from "../../components/Layout/Layout";
import { Cloudinary } from "@cloudinary/url-gen";
import { UploadApiOptions, upload } from "cloudinary-react-native";
import { FirebaseError } from "firebase/app";
import styles from "./Register.scss";
import Spinner from "../../components/Spinner/Spinner";
import SportSelect from "../../components/SportSelect/SportSelect";
import { IUser, SportType, sportTypeList } from "../../common/types";

interface RegisterProps {
  setAuthUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  setShowScreen: React.Dispatch<
    React.SetStateAction<"register" | "signin" | null>
  >;
}

const cloudinary = new Cloudinary({
  cloud: { cloudName: "dvh4yrwb6" },
  url: { secure: true },
});

const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dvh4yrwb6/upload`;

export default function RegisterScreen({ setAuthUser, setShowScreen }: RegisterProps) {
  const [user, setUser] = useState<IUser>({
    fullName: "",
    email: "",
    password: "",
    imageUrl: "",
    favoriteSport: sportTypeList[0],
  });
  const [error, setError] = useState<FirebaseError | null>(null);
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");

  const handleError = (error: any) => {
    Alert.alert(
      "Error",
      error.message || "An unexpected error occurred.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await uploadImage();
      console.log("imgUrl: ", imgUrl);
      setUser({ ...user, imageUrl: imgUrl });
      const newUser = await UserService.register(user);
      if (newUser) {
        setAuthUser(newUser);
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      if (error instanceof FirebaseError) setError(error);
      handleError(error);
      console.error("Error registering user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
    });

    if (pickerResult.canceled === true) {
      return;
    }
    const imgUri = pickerResult.assets[0].uri;
    setUser({ ...user, imageUrl: imgUri });
  };

  const uploadImage = async () => {
    const cldOptions: UploadApiOptions = {
      upload_preset: "uul26ucc",
      unsigned: true,
    };

    await upload(cloudinary, {
      file: user.imageUrl,
      options: cldOptions,
      callback: (error: any, response: any) => {
        if (error) {
          console.error("Cloudinary upload error", error);
        } else {
          console.log("couldinary: ", response);
          setImgUrl(response.secure_url);
        }
      },
    });
  };

  function handleSportTypeChange(sportType: SportType) {
    setUser({ ...user, favoriteSport: sportType });
  }

  function handleGoBack() {
    setShowScreen(null);
  }

  return (
    <Layout>
      {loading ? (
        <Spinner />
      ) : (
        <>
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
          <View style={styles.formBox}>
            <View style={styles.imageBox}>
              {user.imageUrl != "" && (
                <Image source={{ uri: user.imageUrl }} style={styles.image} />
              )}
            </View>
            <TouchableOpacity
              style={styles.imgButton}
              onPress={handleImagePicker}
            >
              <Text>Choose image</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={user.fullName}
              onChangeText={(val) => setUser({ ...user, fullName: val })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={user.email}
              onChangeText={(val) => setUser({ ...user, email: val })}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={user.password}
              onChangeText={(val) => setUser({ ...user, password: val })}
              secureTextEntry
            />
            <Text>Your Favorite Sport</Text>
            <SportSelect onChange={handleSportTypeChange} />
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={{ fontSize: 20 }}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text>Back</Text>
      </TouchableOpacity>
      </>
      )}
    </Layout>
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
