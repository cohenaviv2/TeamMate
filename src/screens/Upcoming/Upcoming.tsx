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
import CustomAlert from "../../components/CustomAlert/CustomAlert";

export default function UpcomingScreen({ navigation }: { navigation: any }) {
  const authContext = useContext(AuthContext);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFetchUpcomingEvents() {
    if (!authContext || !authContext.currentUser) return;
    setLoading(true);
    try {
      const userId = authContext.currentUser.dbUser.id;
      const fetchedEvents = await EventModel.getEventsByParticipantId(userId);
      setEvents(fetchedEvents);
    } catch (error: any) {
      setError(error.message || "An error occurred");
      console.error("Error fetching events:", error);
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

  const handleCloseAlert = () => {
    setError(null);
  };

  return (
    <Layout navigation={navigation} loading={loading}>
      <CustomAlert
        visible={!!error}
        title="Error"
        content={error!}
        onClose={handleCloseAlert}
        buttons={[
          {
            text: "Close",
            onPress: handleCloseAlert,
          },
        ]}
      />
      <View style={styles.upcomingBox}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>Upcoming</Text>
          <View style={styles.listSwitchBox}>
            <ToggleSwitch onToggle={(filter) => setShowList(filter === "List")} labels={["Calendar", "List"]} showLabels={false} icons={[<Ionicons name="calendar-outline" size={26} />, <FontAwesome5 name="list-ul" size={20} />]} />
          </View>
        </View>
      </View>
      <View style={showList ? styles.listBox : styles.calendarBox}>
        {showList ? (
          events.length === 0 ? (
            <Text style={styles.noEventsText}>You are not attending any events</Text>
          ) : (
            <ScrollableList data={events} renderItem={renderEventItem} keyExtractor={keyExtractor} />
          )
        ) : (
          <CustomCalendar events={events} onCalendarItemPress={(event) => navigation.navigate("UpcomingEvent", { event })} />
        )}
      </View>
    </Layout>
  );
}
