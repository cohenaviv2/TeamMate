import { View, TouchableOpacity, Vibration, Text } from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import Layout from "../../components/Layout/Layout";
import MapView, { Marker } from "react-native-maps";
import { IEvent, SportType } from "../../common/types";
import { FontAwesome5 } from "@expo/vector-icons";
import SportSelect from "../../components/SportSelect/SportSelect";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import styles from "./Home.scss";
import { AuthContext } from "../../context/AuthProvider";
import EventModel from "../../models/EventModel";
import ScrollableList from "../../components/List/List";
import EventListItem from "../../components/List/EventListItem/EventListItem";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation, location }: any) {
  const authContext = useContext(AuthContext);
  const favoriteSportType = authContext!.currentUser!.dbUser.favoriteSport;
  const [events, setEvents] = useState<IEvent[]>([]);
  const [sportTypeFilter, setSportTypeFilter] = useState<SportType>(favoriteSportType);
  const [dateFilter, setDateFilter] = useState<"Month" | "Week" | "Today">("Month");
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  const handleFetchEvents = useCallback(async (sportTypeFilter: SportType, dateFilter: "Month" | "Week" | "Today") => {
    setLoading(true);
    setError(null);

    try {
      const fetchedEvents = await EventModel.getFilteredEvents(sportTypeFilter, dateFilter);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetchEvents(sportTypeFilter, dateFilter);
  }, [sportTypeFilter, dateFilter, handleFetchEvents]);

  useFocusEffect(
    useCallback(() => {
      handleFetchEvents(sportTypeFilter, dateFilter);
    }, [sportTypeFilter, dateFilter, handleFetchEvents])
  );

  const renderEventItem = ({ item }: { item: IEvent }) => <EventListItem event={item} onEventPress={(event) => navigation.navigate("Event", { event: item })} />;
  const keyExtractor = (item: IEvent) => item.id;

  return (
    <Layout navigation={navigation} loading={loading}>
      <View style={styles.homeBox}>
        <View style={styles.menuBox}>
          <View style={styles.listSwitchBox}>
            <ToggleSwitch onToggle={(filter) => setShowList(filter === "List")} labels={["Map", "List"]} showLabels={false} icons={[<FontAwesome5 name="map-marker-alt" size={20} />, <FontAwesome5 name="list-ul" size={20} />]} />
          </View>
          <SportSelect initialVal={favoriteSportType} theme="secondary" onChange={(filter) => setSportTypeFilter(filter)} vibrate />
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
        <View style={styles.menuBox}>
          <View style={styles.dateSwitchBox}>
            <ToggleSwitch onToggle={(filter) => setDateFilter(filter as "Month" | "Week" | "Today")} labels={["Month", "Week", "Today"]} showLabels />
          </View>
          <TouchableOpacity
            style={styles.newEventButton}
            onPress={() => {
              // Vibration.vibrate(10);
              navigation.navigate("NewEvent");
            }}
          >
            <FontAwesome5 name="plus" size={20} style={styles.buttonText} />
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}
