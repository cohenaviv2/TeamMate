import { Text, View } from "react-native";
import Layout from "../../components/Layout/Layout";
import styles from "./MyEvents.scss";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { IEvent } from "../../common/types";
import ScrollableList from "../../components/List/List";
import EventListItem from "../../components/List/EventListItem/EventListItem";
import EventModel from "../../models/EventModel";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome5 } from "@expo/vector-icons";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import { useFocusEffect } from "@react-navigation/native";

export default function MyEventsScreen({ navigation, location }: any) {
  const authContext = useContext(AuthContext);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [showList, setShowList] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  async function handleFetchMyEvents() {
    if (!authContext || !authContext.currentUser) return;
    setLoading(true);
    setError(null);

    try {
      const userId = authContext.currentUser.dbUser.id;
      const fetchedEvents = await EventModel.getEventsByCreatorId(userId);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleFetchMyEvents();
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleFetchMyEvents();
    }, [])
  );

  const renderEventItem = ({ item }: { item: IEvent }) => <EventListItem event={item} onEventPress={(item) => navigation.navigate("Event", { event: item })} />;
  const keyExtractor = (item: IEvent) => item.id || "";

  return (
    <Layout navigation={navigation} loading={loading}>
      <View style={styles.eventsBox}>
        <View style={styles.titleBox}>
          <Text style={styles.titleText}>My Events</Text>
          <View style={styles.listSwitchBox}>
            <ToggleSwitch onToggle={(filter) => setShowList(filter === "List")} labels={["List", "Map"]} showLabels={false} icons={[<FontAwesome5 name="list-ul" size={20} />, <FontAwesome5 name="map-marker-alt" size={20} />]} />
          </View>
        </View>
      </View>
      <View style={showList ? styles.listBox : styles.mapBox}>
        {showList ? (
          events.length === 0 ? (
            <Text style={styles.noEventsText}>No events found</Text>
          ) : (
            <ScrollableList data={events} renderItem={renderEventItem} keyExtractor={keyExtractor} />
          )
        ) : (
          <MapView
            loadingBackgroundColor="#ffc000"
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            {events.map((event) => (
              <Marker key={event.id} coordinate={{ latitude: event.location.latitude, longitude: event.location.longitude }} title={event.title} description={event.sportType} />
            ))}
          </MapView>
        )}
      </View>
    </Layout>
  );
}
