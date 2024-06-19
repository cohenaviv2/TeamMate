import * as Font from "expo-font";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

export async function loadFonts() {
  await Font.loadAsync({
    Caveat: require("../assets/fonts/Caveat.ttf"),
    "Caveat-Bold": require("../assets/fonts/Caveat-Bold.ttf"),
    Lato: require("../assets/fonts/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato-Black.ttf"),
  });
}

export async function getLocationPermission() {
  try {
    const response = await Location.requestForegroundPermissionsAsync();
    if (response.status === "granted") {
      return await Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.High });
    } else {
      throw new Error("Location permission not granted");
    }
  } catch (error) {
    console.error("Error requesting location permissions:", error);
    throw error;
  }
}

export async function getImagePickerPermission() {
  try {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      throw new Error("Permission to access camera roll is required!");
    }
    return true;
  } catch (error) {
    console.error("Error requesting image picker permissions:", error);
    throw error;
  }
}

export async function launchImagePicker(aspect:[number,number]) {
  try {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect,
      base64: true,
    });
    if (pickerResult.canceled) return null;
    const uri = pickerResult.assets[0].uri;
    return uri;
  } catch (error) {
    console.error("Error launching image picker:", error);
    throw error;
  }
}