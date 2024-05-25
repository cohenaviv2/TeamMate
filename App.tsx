import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/Home/Home";
import UpcomingScreen from "./screens/Upcoming/Upcoming";
import EventsScreen from "./screens/MyEvents/Events";
import SettingsScreen from "./screens/Settings/Settings";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "./App.scss";
import { useState } from "react";
import LoginScreen from "./screens/Login/Login";

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <NavigationContainer>
      {user ? <Tab.Navigator
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

            return (
              <Ionicons name={iconName as "key"} size={30} color={color} />
            );
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
      </Tab.Navigator> : <LoginScreen />}
    </NavigationContainer>
  );
}
