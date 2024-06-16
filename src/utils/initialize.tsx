import * as Font from "expo-font";
import * as Location from "expo-location";

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
