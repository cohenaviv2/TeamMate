import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventScreen from "../screens/Event/Event";
import { createScreenOptions } from "./options";
import { useNavigation } from "@react-navigation/native";
import UpcomingScreen from "../screens/Upcoming/Upcoming";

const Stack = createNativeStackNavigator();

export const UpcomingStack = ({ location }: any) => {
  const navigation = useNavigation();
  const screenOptions = createScreenOptions(navigation);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Upcoming" options={{ headerShown: false }}>
        {(props) => <UpcomingScreen {...props} />}
      </Stack.Screen>
      <Stack.Screen name="UpcomingEvent" options={screenOptions}>
        {(props) => <EventScreen {...props} location={location} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
