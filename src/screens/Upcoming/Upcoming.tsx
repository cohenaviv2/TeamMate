import { Text, View } from "react-native";
import Layout from "../../components/Layout/Layout";
import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "./Upcoming.scss";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import { useState } from "react";

export default function UpcomingScreen({ navigation }: { navigation: any }) {
  const [showList, setShowList] = useState(false);
  return (
    <Layout navigation={navigation}>
      <View style={styles.upcomingBox}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>Upcoming Events</Text>
          <View style={styles.listSwitchBox}>
            <ToggleSwitch onToggle={(filter) => setShowList(filter === "List")} labels={["Calendar", "List"]} showLabels={false} icons={[<Ionicons name="calendar" size={26} />, <FontAwesome5 name="list-ul" size={20} />]} />
          </View>
        </View>
      </View>
    </Layout>
  );
}
