import { Image, Text, TouchableOpacity, View } from "react-native";
import  AuthService  from "../../services/AuthService";
import Layout from "../../components/Layout/Layout";
import styles from "./Profle.scss";
import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import Spinner from "../../components/Spinner/Spinner";
import SportSelect from "../../components/SportSelect/SportSelect";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const authContext = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.log(error);
    }
  };

  if (!authContext || !authContext.currentUser) return <Spinner size="l" />;

  const user = authContext.currentUser.dbUser;

  return (
    <Layout navigation={navigation}>
      <View style={styles.profileBox}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>My Profile</Text>
          <View style={styles.listSwitchBox}>
            <ToggleSwitch onToggle={(filter) =>{}} labels={["Calendar", "List"]} showLabels={false} icons={[<Ionicons name="calendar-outline" size={26} />, <FontAwesome5 name="list-ul" size={20} />]} />
          </View>
        </View>
      </View>
      {/* <View style={styles.profileBox}>
        <View style={styles.nameImageBox}>
          <View style={styles.imageBox}>
            <Image source={{ uri: user.imageUrl }} style={styles.image} />
          </View>
          <View style={styles.nameBox}>
            <Text style={styles.nameText}>{user.fullName}</Text>
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
        </View>
        <View style={styles.favBox}>
          <Text style={styles.favText}>My Favorite Sport</Text>
          <SportSelect theme="secondary" onChange={() => {}} initialVal={user.favoriteSport} />
        </View>
        <Text style={styles.myEventsText}>My Events</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View> */}
    </Layout>
  );
}
