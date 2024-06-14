import { Text, View } from "react-native";
import Layout from "../../components/Layout/Layout";
import styles from "./Upcoming.scss";

export default function UpcomingScreen({ navigation }: { navigation: any }) {
  return (
    <Layout navigation={navigation}>
      <View style={styles.upcomingBox}>
        <Text style={{fontSize:30}}>Upcoming Events</Text>
      </View>
    </Layout>
  );
}
