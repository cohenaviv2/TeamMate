import {  Text, View } from 'react-native'
import Layout from "../../components/Layout/Layout";
import styles from "./Events.scss"

export default function EventsScreen({ navigation }: { navigation: any }) {
  return (
    <Layout navigation={navigation}>
      <View style={styles.eventsBox}>
        <Text style={{ fontSize: 30 }}>My Events</Text>
      </View>
    </Layout>
  );
}