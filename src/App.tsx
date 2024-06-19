import { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext, AuthProvider } from "./context/AuthProvider";
import UpcomingScreen from "./screens/Upcoming/Upcoming";
import MyEventsScreen from "./screens/MyEvents/MyEvents";
import ProfileScreen from "./screens/Profile/Profle";
import styles from "./App.scss";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthStack } from "./stacks/AuthStack";
import { HomeStack } from "./stacks/HomeStack";
import { getImagePickerPermission, getLocationPermission, loadFonts } from "./utils/initialize";
import { LocationObject } from "expo-location";
import Loading from "./screens/Loading/Loading";

const Tab = createBottomTabNavigator();

const MainTabNavigator = ({ location }: any) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color }) => {
        let iconName;
        switch (route.name) {
          case "HomeStack":
            iconName = focused ? "home" : "home-outline";
            break;
          case "Upcoming":
            iconName = focused ? "calendar" : "calendar-outline";
            break;
          case "MyEvents":
            iconName = focused ? "body" : "body-outline";
            break;
          case "Profile":
            iconName = focused ? "person" : "person-outline";
            break;
        }
        return <Ionicons name={iconName as "key"} size={32} color={color} />;
      },
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarActiveTintColor: "#f3b909",
      tabBarInactiveTintColor: "#ffc000",
      tabBarShowLabel: false,
      headerShown: false,
    })}
  >
    <Tab.Screen name="HomeStack">{() => <HomeStack location={location} />}</Tab.Screen>
    <Tab.Screen name="Upcoming" component={UpcomingScreen} />
    <Tab.Screen name="MyEvents" component={MyEventsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [imagePermissionGranted, setImagePermissionGranted] = useState(false);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const loadAppResources = async () => {
      try {
        await loadFonts();
        // Get location permission
        const locationData = await getLocationPermission();
        setLocation(locationData);
        setLocationPermissionGranted(true);
        // Get image picker permission
        const imagePermission = await getImagePickerPermission();
        setImagePermissionGranted(imagePermission);

        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading app resources:", error);
        setLocationPermissionGranted(false);
        setFontsLoaded(true);
      }
    };

    loadAppResources();
  }, []);

  if (!authContext) {
    return <Loading spinnerSize="l" />
  }

  const { currentUser, loading, error } = authContext;

  useEffect(() => {}, [loading, currentUser]);

  if (!fontsLoaded || !locationPermissionGranted || !imagePermissionGranted || loading) {
    return <Loading spinnerSize="l" />;
  }

  return (
    <NavigationContainer>
      <AuthContext.Provider value={{ currentUser, loading, error }}>{currentUser ? <MainTabNavigator location={location} /> : <AuthStack />}</AuthContext.Provider>
    </NavigationContainer>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
