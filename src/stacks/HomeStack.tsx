import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home/Home";
import EventScreen from "../screens/Event/Event";
import NewEventScreen from "../screens/NewEvent/NewEvent";
import { createScreenOptions } from "./options";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export const HomeStack = ({ location }: any) => {
  const navigation = useNavigation();
  const screenOptions = createScreenOptions(navigation,"Home");

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {(props) => <HomeScreen {...props} location={location} />}
      </Stack.Screen>
      <Stack.Screen name="Event" options={screenOptions}>
        {(props) => <EventScreen {...props} location={location} />}
      </Stack.Screen>
      <Stack.Screen name="New Event" options={screenOptions}>
        {(props) => <NewEventScreen {...props} location={location} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
