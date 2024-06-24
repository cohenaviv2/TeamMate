import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventScreen from "../screens/Event/Event";
import { createScreenOptions } from "./options";
import { useNavigation } from "@react-navigation/native";
import MyEventsScreen from "../screens/MyEvents/MyEvents";
import NewEventScreen from "../screens/NewEvent/NewEvent";

const Stack = createNativeStackNavigator();

export const MyEventsStack = ({ location }: any) => {
  const navigation = useNavigation();
  const screenOptions = createScreenOptions(navigation, "MyEvents");

  return (
    <Stack.Navigator>
      <Stack.Screen name="MyEvents" options={{ headerShown: false }}>
        {(props) => <MyEventsScreen {...props} location={location} />}
      </Stack.Screen>
      <Stack.Screen name="My Event" options={screenOptions}>
        {(props) => <EventScreen {...props} location={location} />}
      </Stack.Screen>
      <Stack.Screen name="My New Event" options={screenOptions}>
        {(props) => <NewEventScreen {...props} location={location} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
