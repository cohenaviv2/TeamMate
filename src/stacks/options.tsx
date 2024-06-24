import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import styles from "./options.scss";

export function createScreenOptions(navigation:any,mainPath:string): NativeStackNavigationOptions {
    return {
      headerStyle: { backgroundColor: "#ffc000" },
      headerTitleStyle: {  color: "white", fontSize: 22 },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate(mainPath)} style={styles.backIconBox}>
          <MaterialIcons name="arrow-back-ios-new" style={styles.backIcon} />
        </TouchableOpacity>
      ),
    };
}
