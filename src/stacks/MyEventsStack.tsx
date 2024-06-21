import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventScreen from "../screens/Event/Event";
import { createScreenOptions } from "./options";
import { useNavigation } from "@react-navigation/native";
import MyEventsScreen from "../screens/MyEvents/MyEvents";

const Stack = createNativeStackNavigator();

export const MyEventsStack = ({ location }: any) => {
  const navigation = useNavigation();
  const screenOptions = createScreenOptions(navigation);

  return (
    <Stack.Navigator>
      <Stack.Screen name="MyEvents" options={{ headerShown: false }}>
        {(props) => <MyEventsScreen {...props} location={location} />}
      </Stack.Screen>
      <Stack.Screen name="MyEvent" options={screenOptions}>
        {(props) => <EventScreen {...props} location={location} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
