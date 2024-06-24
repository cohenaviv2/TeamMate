import { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getImagePickerPermission, getLocationPermission, loadFonts } from "./utils/initialize";
import { AuthContext, AuthProvider } from "./context/AuthProvider";
import { LocationObject } from "expo-location";
import { AuthStack } from "./stacks/AuthStack";
import { HomeStack } from "./stacks/HomeStack";
import { MyEventsStack } from "./stacks/MyEventsStack";
import { UpcomingStack } from "./stacks/UpcomingStack";
import ProfileScreen from "./screens/Profile/Profle";
import LoadingScreen from "./screens/Loading/Loading";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "./App.scss";
import "../globals.js";
import CustomAlert from "./components/CustomAlert/CustomAlert";

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
          case "UpcomingStack":
            iconName = focused ? "calendar" : "calendar-outline";
            break;
          case "MyEventsStack":
            iconName = focused ? "accessibility" : "accessibility-outline";
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
    <Tab.Screen name="UpcomingStack">{() => <UpcomingStack location={location} />}</Tab.Screen>
    <Tab.Screen name="MyEventsStack">{() => <MyEventsStack location={location} />}</Tab.Screen>
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const loadAppResources = async () => {
      try {
        // Load fonts
        await loadFonts();
        // Get location permission
        const locationData = await getLocationPermission();
        // Get image picker permission
        const imagePermission = await getImagePickerPermission();
        if (!locationData || !imagePermission) {
          setError("Permissions required");
          return;
        }
        setLocation(locationData);
      } catch (error: any) {
        setError(error.message || "Error loading app resources:");
        console.log("Error loading app resources:", error);
      }
    };
    loadAppResources();
  }, []);

  if (!authContext || authContext.loading) {
    return <LoadingScreen spinnerSize="l" />;
  }

  const { currentUser, loading, error: authError } = authContext;

  if (authError) setError(authError.message || "Auth Error");

  if (error) {
    return (
      <NavigationContainer>
        <CustomAlert
          visible={!!error}
          title="Error"
          content={error!}
          onClose={() => setError(null)}
          buttons={[
            {
              text: "Close",
              onPress: () => setError(null),
            },
          ]}
        />
        <LoadingScreen spinnerSize="l" />
      </NavigationContainer>
    );
  }

  return <NavigationContainer>{currentUser ? <MainTabNavigator location={location} /> : <AuthStack />}</NavigationContainer>;
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
