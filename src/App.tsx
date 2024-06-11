import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/Home/Home";
import UpcomingScreen from "./screens/Upcoming/Upcoming";
import EventsScreen from "./screens/MyEvents/Events";
import SettingsScreen from "./screens/Settings/Settings";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "./App.scss";
import { useContext, useEffect } from "react";
import * as Font from "expo-font";
import LoginScreen from "./screens/Login/Login";
import { AuthContext, AuthProvider } from "./context/AuthProvider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./screens/Register/Register";
import Spinner from "./components/Spinner/Spinner";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

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
          case "Settings":
            iconName = focused ? "settings" : "settings-outline";
            break;
        }

        return <Ionicons name={iconName as "key"} size={30} color={color} />;
      },
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarActiveTintColor: "#CE7A39",
      tabBarInactiveTintColor: "white",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Upcoming" component={UpcomingScreen} />
    <Tab.Screen name="MyEvents" component={EventsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const App = () => {
  const authContext = useContext(AuthContext);
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        Caveat: require("./assets/fonts/Caveat.ttf"),
        "Caveat-Bold": require("./assets/fonts/Caveat-Bold.ttf"),
      });
    })();
  }, []);

  if (!authContext) {
    return <Spinner />;
  }

  const { currentUser, loading } = authContext;

  if (loading) {
    return <Spinner />;
  }

  return <NavigationContainer>{currentUser ? <MainTabNavigator /> : <AuthStack />}</NavigationContainer>;
};

export default () => (
  
  <AuthProvider>
    <App />
  </AuthProvider>
);
