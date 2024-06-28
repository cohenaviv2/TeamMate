import { useContext, useEffect, useState } from "react";
import { getImagePickerPermission, getLocationPermission, loadFonts } from "./utils/initialize";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext, AuthProvider } from "./context/AuthProvider";
import { LocationObject } from "expo-location";
import MainTabNavigator from "./navigation/MainTabNavigator";
import { AuthStack } from "./stacks/AuthStack";
import LoadingScreen from "./screens/Loading/Loading";
import CustomAlert from "./components/CustomAlert/CustomAlert";
import "../globals.js";

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imagePermissionGranted, setImagePermissionGranted] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const loadAppResources = async () => {
      try {
        // Load fonts
        await loadFonts();
        setFontsLoaded(true);
        // Get location permission
        const locationData = await getLocationPermission();
        setLocation(locationData);
        setLocationPermissionGranted(true);
        // Get image picker permission
        const imagePermission = await getImagePickerPermission();
        setImagePermissionGranted(imagePermission);
      } catch (error) {
        setAlertTitle("Initialization Error");
        setAlertContent("Please check your permissions and try again.");
        setAlertVisible(true);
      }
    };
    loadAppResources();
  }, []);

  if (!authContext) {
    return <LoadingScreen spinnerSize="l" />;
  }

  const { currentUser, loading, error } = authContext;

  useEffect(() => {
    if (error) {
      setAlertTitle("Authentication Error");
      setAlertContent("There was an error with authentication. Please try again.");
      setAlertVisible(true);
    }
  }, [error]);

  if (!fontsLoaded || !locationPermissionGranted || !imagePermissionGranted || loading) {
    return (
      <>
        <LoadingScreen spinnerSize="l" />
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          content={alertContent}
          onClose={() => setAlertVisible(false)}
          buttons={[]}
        />
      </>
    );
  }

  return (
    <>
      <NavigationContainer>{currentUser ? <MainTabNavigator location={location} /> : <AuthStack />}</NavigationContainer>
    </>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
