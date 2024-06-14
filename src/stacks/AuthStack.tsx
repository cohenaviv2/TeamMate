import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Login/Login";
import RegisterScreen from "../screens/Register/Register";
const Stack = createNativeStackNavigator();


export const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerStyle: { backgroundColor: "#ffc000" } }} />
  </Stack.Navigator>
);
