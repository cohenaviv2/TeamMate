import { Image, Text, TouchableOpacity, View, StyleSheet, ScrollView, TextInput } from "react-native";
import AuthService from "../../services/AuthService";
import Layout from "../../components/Layout/Layout";
import styles from "./Profle.scss";
import { FontAwesome } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { FontAwesome6 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import SportSelect from "../../components/SportSelect/SportSelect";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import { IUser } from "../../common/types";
import { sportTypeIconMap } from "../../components/SportSelect/data";
import NumberInput from "../../components/NumberInput/NumberInput";
import UserModel from "../../models/UserModel";
import { useFocusEffect } from "@react-navigation/native";
import LoadingBox from "../../components/LoadingBox/LoadingBox";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { launchImagePicker } from "../../utils/initialize";
import CloudinaryService from "../../services/CloudinaryService";

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const authContext = useContext(AuthContext);
  const user = authContext!.currentUser!.dbUser;
  const [dbUser, setDbUser] = useState<IUser | null>(null);
  const [formState, setFormState] = useState<IUser | null>(user);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  function handleFetchUser() {
    // setLoading(true);
    // try {
    //   const dbUser = await UserModel.getUserById(user.id);
    //   setDbUser(dbUser);
    //   setFormState(dbUser);
    // } catch (error: any) {
    //   setError(error.message || "An error occurred");
    // } finally {
    //   setLoading(false);
    // }
    if (user) {
      setDbUser(user);
      setFormState(user);
    }
  }

  useEffect(() => {
    handleFetchUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleFetchUser();
      setEdit(false);
    }, [])
  );

  async function handleLogout() {
    try {
      await AuthService.logout();
    } catch (error: any) {
      setError(error.message || "An error occurred");
      console.log(error);
    }
  }

  async function handleUpdateUser() {
    if (formState) {
      setLoading(true);
      try {
        let imageUrl = null;
        if (imageUri) imageUrl = await CloudinaryService.uploadImage(imageUri, "");
        await UserModel.updateUser(user.id, imageUrl ? { ...formState, imageUrl } : formState);
        const updatedDbUser = await UserModel.getUserById(user.id);
        setEdit(false);
        setDbUser(updatedDbUser);
        setSuccess(true);
        authContext!.setCurrentUser((prev) => {
          if (prev) {
            return { ...prev, dbUser: updatedDbUser };
          }
          return prev;
        });
        setTimeout(() => {
          setSuccess(false);
          setLoading(false);
          setImageUri(null);
        }, 700);
      } catch (error: any) {
        setError(error.message || "An error occurred");
        setLoading(false);
      }
    }
  }

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  function handleEditButtonPress() {
    setEdit((prev) => !prev);
    setImageUri(null);
    scrollToTop();
  }

  const handleChange = (field: string, value: any) => {
    setFormState((prevState) => {
      if (!prevState) return null;
      return { ...prevState, [field]: value };
    });
  };

  const handleImagePicker = async () => {
    const uri = await launchImagePicker([4, 4]);
    setImageUri(uri);
  };

  const handleCloseAlert = () => {
    setError(null);
  };

  return (
    <Layout navigation={navigation} loading={loading}>
      <CustomAlert
        visible={!!error}
        title="Error"
        content={error!}
        onClose={handleCloseAlert}
        buttons={[
          {
            text: "Close",
            onPress: handleCloseAlert,
          },
        ]}
      />
      <View style={styles.profileBox}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>My Profile</Text>
          <View style={styles.listSwitchBox}>
            <ToggleSwitch onToggle={(filter) => {}} labels={["Profile", "Settings"]} showLabels={false} icons={[<Ionicons name="person" size={26} />, <FontAwesome6 name="gear" size={20} />]} />
          </View>
        </View>
        {loading ? (
          <LoadingBox success={success} />
        ) : (
          dbUser && (
            <ScrollView style={styles.profileScrollBox} contentContainerStyle={styles.scrollBox} ref={scrollViewRef}>
              {edit && (
                <View style={styles.editButtonBox}>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleEditButtonPress}>
                    <Ionicons name="close" style={styles.attendButtonIcon} />
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.listBox}>
                <View style={styles.fieldBox}>
                  {/* <View style={styles.imageBox}>
                    <Image source={{ uri: dbUser.imageUrl }} style={styles.image} />
                  </View> */}
                  <TouchableOpacity style={styles.imgButton} onPress={handleImagePicker} disabled={!edit}>
                    {!edit || imageUri ? <Image source={{ uri: imageUri ? imageUri : dbUser.imageUrl }} style={styles.image} /> : <Octicons name="image" style={styles.imgIcon} />}
                  </TouchableOpacity>
                  <View style={styles.nameBox}>
                    {edit && formState ? (
                      <TextInput style={[styles.input, { minWidth: "90%" }]} value={formState.fullName} onChangeText={(value) => handleChange("fullName", value)} />
                    ) : (
                      <Text style={[styles.nameText, shadowStyles.shadow]}>{dbUser.fullName}</Text>
                    )}
                    {edit && formState ? <TextInput style={[styles.input, { minWidth: "90%" }]} value={formState.email} onChangeText={(value) => handleChange("email", value)} /> : <Text style={styles.emailText}>{user.email}</Text>}
                  </View>
                </View>
                <View style={styles.fieldBox}>
                  <Text style={styles.labelText}>Favorite Sport</Text>
                  {edit && formState ? (
                    <SportSelect vibrate theme="primary" onChange={(value) => handleChange("favoriteSport", value)} initialVal={dbUser.favoriteSport} />
                  ) : (
                    <View style={[styles.favSportBox, shadowStyles.shadow]}>
                      {sportTypeIconMap[dbUser.favoriteSport]}
                      <Text style={styles.labelText}>{dbUser.favoriteSport}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.fieldBox}>
                  <Text style={styles.labelText}>Age</Text>
                  {edit && formState ? (
                    <View style={styles.numberInputBox}>
                      <NumberInput initialVal={dbUser.age} min={dbUser.age} max={99} onChange={(value) => handleChange("age", !value ? dbUser.age : value)} />
                    </View>
                  ) : (
                    <Text style={styles.infoText}>{dbUser.age}</Text>
                  )}
                </View>
                <View style={styles.fieldBox}>
                  <Text style={styles.labelText}>City</Text>
                  {edit && formState ? (
                    <TextInput style={[styles.input, { minWidth: "90%" }]} value={formState.city} onChangeText={(value) => handleChange("city", !value ? dbUser.age : value)} />
                  ) : (
                    <Text style={styles.infoText}>{dbUser.city}</Text>
                  )}
                </View>
                {edit ? (
                  <>
                    <TouchableOpacity style={styles.saveButton} onPress={handleUpdateUser}>
                      <FontAwesome name="check" style={styles.attendButtonIcon} />
                      <Text style={styles.buttonText}>Save Changes</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity style={styles.editButton} onPress={handleEditButtonPress}>
                      <FontAwesome6 name="edit" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                      <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </ScrollView>
          )
        )}
      </View>
    </Layout>
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
