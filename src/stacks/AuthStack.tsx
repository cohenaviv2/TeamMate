import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Login/Login";
import RegisterScreen from "../screens/Register/Register";
import { createScreenOptions } from "./options";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  const navigation = useNavigation();
  const screenOptions = createScreenOptions(navigation);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={screenOptions} />
    </Stack.Navigator>
  );
};
