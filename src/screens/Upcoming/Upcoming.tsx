import { Text, View } from "react-native";
import Layout from "../../components/Layout/Layout";
import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import styles from "./Upcoming.scss";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import { useCallback, useContext, useEffect, useState } from "react";
import { IEvent } from "../../common/types";
import { AuthContext } from "../../context/AuthProvider";
import ScrollableList from "../../components/List/List";
import EventModel from "../../models/EventModel";
import { useFocusEffect } from "@react-navigation/native";
import EventListItem from "../../components/List/EventListItem/EventListItem";
import CustomCalendar from "../../components/CustomCalendar/CustomCalendar";

export default function UpcomingScreen({ navigation }: { navigation: any }) {
  const authContext = useContext(AuthContext);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  async function handleFetchUpcomingEvents() {
    if (!authContext || !authContext.currentUser) return;
    setLoading(true);
    setError(null);

    try {
      const userId = authContext.currentUser.dbUser.id;
      const fetchedEvents = await EventModel.getEventsByParticipantId(userId);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleFetchUpcomingEvents();
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleFetchUpcomingEvents();
    }, [])
  );

  const renderEventItem = ({ item }: { item: IEvent }) => <EventListItem event={item} onEventPress={(item) => navigation.navigate("UpcomingEvent", { event: item })} />;
  const keyExtractor = (item: IEvent) => item.id || "";

  return (
    <Layout navigation={navigation}>
      <View style={styles.upcomingBox}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>Upcoming</Text>
          <View style={styles.listSwitchBox}>
            <ToggleSwitch onToggle={(filter) => setShowList(filter === "List")} labels={["Calendar", "List"]} showLabels={false} icons={[<Ionicons name="calendar-outline" size={26} />, <FontAwesome5 name="list-ul" size={20} />]} />
          </View>
        </View>
      </View>
      <View style={showList ? styles.listBox : styles.calendarBox}>
        {showList ? events.length === 0 ? <Text style={styles.noEventsText}>You are not attending any event</Text> : <ScrollableList data={events} renderItem={renderEventItem} keyExtractor={keyExtractor} /> : <CustomCalendar events={events} />}
      </View>
    </Layout>
  );
}
