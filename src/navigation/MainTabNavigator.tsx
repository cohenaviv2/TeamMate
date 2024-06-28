import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HomeStack } from "../stacks/HomeStack";
import { MyEventsStack } from "../stacks/MyEventsStack";
import { UpcomingStack } from "../stacks/UpcomingStack";
import ProfileScreen from "../screens/Profile/Profle";
import styles from "./MainTabNavigator.scss";

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

export default MainTabNavigator;
