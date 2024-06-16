import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home/Home";
import EventScreen from "../screens/Event/Event";
import NewEventScreen from "../screens/NewEvent/NewEvent";
import { createScreenOptions } from "./stackOptions";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export const HomeStack = ({ location }: any) => {
  const navigation = useNavigation();
  const screenOptions = createScreenOptions(navigation);

  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {(props) => <HomeScreen {...props} location={location} />}
      </Stack.Screen>
      <Stack.Screen name="Event" component={EventScreen} options={screenOptions} />
      <Stack.Screen name="NewEvent" options={screenOptions}>
        {(props) => <NewEventScreen {...props} location={location} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
