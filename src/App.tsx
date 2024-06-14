import { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext, AuthProvider } from "./context/AuthProvider";
import HomeScreen from "./screens/Home/Home";
import UpcomingScreen from "./screens/Upcoming/Upcoming";
import EventsScreen from "./screens/MyEvents/Events";
import ProfileScreen from "./screens/Profile/Profle";
import styles from "./App.scss";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Font from "expo-font";
import Spinner from "./components/Spinner/Spinner";
import { AuthStack } from "./stacks/AuthStack";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case "Home":
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
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Upcoming" component={UpcomingScreen} />
    <Tab.Screen name="MyEvents" component={EventsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const authContext = useContext(AuthContext);
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        Caveat: require("./assets/fonts/Caveat.ttf"),
        "Caveat-Bold": require("./assets/fonts/Caveat-Bold.ttf"),
        "Lato": require("./assets/fonts/Lato-Regular.ttf"),
        "Lato-Bold": require("./assets/fonts/Lato-Black.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  useEffect(()=>console.log("App: authContext changed"),[authContext])
  

  if (!authContext || !fontsLoaded || authContext.loading) {
    return <Spinner size="l" />;
  }

  const { currentUser, loading } = authContext;

  // if (loading) {
  //   return <Spinner size="l" />;
  // }

  return <NavigationContainer>{currentUser ? <MainTabNavigator /> : <AuthStack />}</NavigationContainer>;
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
