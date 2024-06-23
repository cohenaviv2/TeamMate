import React, { useState } from "react";
import { Text, TextInput, Image, TouchableOpacity, View, Alert, StyleSheet, ScrollView } from "react-native";
import styles from "./Register.scss";
import Spinner from "../../components/Spinner/Spinner";
import SportSelect from "../../components/SportSelect/SportSelect";
import { IUser, SportType, sportTypeList } from "../../common/types";
import Octicons from "@expo/vector-icons/Octicons";
import { launchImagePicker } from "../../utils/initialize";
import CloudinaryService from "../../services/CloudinaryService";
import AuthService from "../../services/AuthService";
import NumberInput from "../../components/NumberInput/NumberInput";
import Loading from "../Loading/Loading";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [user, setUser] = useState<IUser>({
    fullName: "",
    email: "",
    password: "",
    imageUrl: "",
    id: "",
    age: 14,
    city: "",
    favoriteSport: sportTypeList[0],
  });
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);

  async function handleRegister() {
    if (user.email == "" || user.password == "" || user.fullName == "" || !imageUri) {
      setAlertVisible(true);
      return;
    }
    setLoading(true);
    try {
      const imageUrl = await CloudinaryService.uploadImage(imageUri, "");
      await AuthService.register({
        ...user,
        imageUrl,
      });
      setLoading(false);
      navigation.navigate("Login");
    } catch (error:any) {
      setLoading(false);
      setError(error.message || "An error occurred");
    }
  }

  const handleImagePicker = async () => {
    const uri = await launchImagePicker([4, 4]);
    setImageUri(uri);
  };

  function handleSportTypeChange(sportType: SportType) {
    setUser({ ...user, favoriteSport: sportType });
  }

  const handleCloseAlert = () => {
    setAlertVisible(false);
    setError(null);
  };

  if (loading) return <Loading spinnerSize="l" />;
  else
    return (
      <ScrollView style={styles.scrollBox}>
        <CustomAlert
          visible={alertVisible}
          title={error ? "Error" : "Incomplete Information"}
          content={error ? error : "Please make sure to fill out all the fields"}
          onClose={handleCloseAlert}
          buttons={[
            {
              text: "OK",
              onPress: handleCloseAlert,
            },
          ]}
        />
        <View style={styles.registerBox}>
          <View style={styles.formBox}>
            {/* <View style={styles.imageBox}>{imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}</View> */}
            <TouchableOpacity style={styles.imgButton} onPress={handleImagePicker}>
              {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : <Octicons name="image" style={styles.imgIcon} />}
            </TouchableOpacity>
            <TextInput style={[styles.input, shadowStyles.shadow]} placeholder="Full Name" value={user.fullName} onChangeText={(val) => setUser({ ...user, fullName: val })} />
            <TextInput style={[styles.input, shadowStyles.shadow]} placeholder="Email" value={user.email} onChangeText={(val) => setUser({ ...user, email: val })} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={[styles.input, shadowStyles.shadow]} placeholder="Password" value={user.password} onChangeText={(val) => setUser({ ...user, password: val })} secureTextEntry />
            <TextInput style={[styles.input, shadowStyles.shadow]} placeholder="City" value={user.city} onChangeText={(val) => setUser({ ...user, city: val })} />
            <View style={[styles.ageBox, shadowStyles.shadow]}>
              <Text style={styles.titleText}>Age</Text>
              <View style={styles.numberInputBox}>
                <NumberInput min={14} max={99} initialVal={14} onChange={(val) => val && setUser({ ...user, age: val })} />
              </View>
            </View>
            <Text style={[styles.favText, { textAlignVertical: "center" }]}>Your Favorite Sport</Text>
            <SportSelect theme="secondary" onChange={handleSportTypeChange} vibrate />
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
}

const shadowStyles = StyleSheet.create({
  shadow: {
    shadowColor: "#555",
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3, // Android-specific property
  },
});
