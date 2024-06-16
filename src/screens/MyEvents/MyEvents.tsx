import {  Text, View } from 'react-native'
import Layout from "../../components/Layout/Layout";
import styles from "./MyEvents.scss"

export default function MyEventsScreen({ navigation }: { navigation: any }) {
  return (
    <Layout navigation={navigation}>
      <View style={styles.eventsBox}>
        <Text style={{ fontSize: 30 }}>My Events</Text>
      </View>
    </Layout>
  );
}