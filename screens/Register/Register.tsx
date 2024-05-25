import React, { useState } from "react";
import { Text, TextInput, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserService } from "../../utils/UserService";
import Layout from "../../components/Layout/Layout";
import { Cloudinary } from "@cloudinary/url-gen";
import { UploadApiOptions, upload } from "cloudinary-react-native";

const cloudinary = new Cloudinary({
  cloud: { cloudName: "dvh4yrwb6" },
  url: { secure: true },
});

const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dvh4yrwb6/upload`;

export default function RegisterScreen() {
  const [user, setUser] = useState<IUser>({
    fullName: "",
    email: "",
    password: "",
    imageUrl: "",
  });

  const handleRegister = async () => {
    try {
      const newUser = await UserService.register(user);

      if (newUser) {
        console.log("User created in DB");
        await uploadImage();
        console.log(user)
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error);
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
          console.log(response);
          setUser({ ...user, imageUrl: response.url });
        }
      },
    });
  };

  return (
    <Layout>
      <Text>Register</Text>
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
      <Button title="Choose Image" onPress={handleImagePicker} />
      {user.imageUrl != "" && (
        <Image source={{ uri: user.imageUrl }} style={styles.image} />
      )}
      <Button title="Register" onPress={handleRegister} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});
