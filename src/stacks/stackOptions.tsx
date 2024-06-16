import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import styles from "./stackOptions.scss";

export function createScreenOptions(navigation:any): NativeStackNavigationOptions {
    return {
      headerStyle: { backgroundColor: "#ffc000" },
      headerTitleStyle: {  color: "white", fontSize: 22 },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconBox}>
          <MaterialIcons name="arrow-back-ios-new" style={styles.backIcon} />
        </TouchableOpacity>
      ),
    };
}
