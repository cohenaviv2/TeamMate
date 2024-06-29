import { View, TouchableOpacity, Vibration, Text } from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import Layout from "../../components/Layout/Layout";
import MapView, { Callout, Marker } from "react-native-maps";
import { DateFilter, IEvent, SportType, dateFilters, sportTypeList } from "../../common/types";
import { FontAwesome5 } from "@expo/vector-icons";
import SportSelect from "../../components/SportSelect/SportSelect";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import styles from "./Home.scss";
import { AuthContext } from "../../context/AuthProvider";
import EventModel from "../../models/EventModel";
import ScrollableList from "../../components/List/List";
import EventListItem from "../../components/List/EventListItem/EventListItem";
import { useFocusEffect } from "@react-navigation/native";
import MapTooltip from "../../components/MapTooltip/MapTooltip";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

export default function HomeScreen({ navigation, location }: any) {
  const authContext = useContext(AuthContext);
  const favoriteSportType = authContext!.currentUser!.dbUser.favoriteSport;
  const [events, setEvents] = useState<IEvent[]>([]);
  const [sportTypeFilter, setSportTypeFilter] = useState<SportType>(favoriteSportType);
  const [dateFilter, setDateFilter] = useState<DateFilter>("Month");
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchEvents = useCallback(async (sportTypeFilter: SportType, dateFilter: DateFilter) => {
    setLoading(true);
    try {
      const fetchedEvents = await EventModel.getFilteredEvents(sportTypeFilter, dateFilter);
      setEvents(fetchedEvents);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarkerPress = (event: IEvent) => {
    navigation.navigate("Event", { event });
  };

  useEffect(() => {
    handleFetchEvents(sportTypeFilter, dateFilter);
  }, [sportTypeFilter, dateFilter, handleFetchEvents]);

  useFocusEffect(
    useCallback(() => {
      handleFetchEvents(sportTypeFilter, dateFilter);
    }, [sportTypeFilter, dateFilter, handleFetchEvents])
  );

  const handleCloseAlert = () => {
    setError(null);
  };

  const renderEventItem = ({ item }: { item: IEvent }) => <EventListItem event={item} onEventPress={(event) => navigation.navigate("Event", { event: item })} />;
  const keyExtractor = (item: IEvent) => item.id;

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
                <Marker key={event.id} coordinate={{ latitude: event.location.latitude, longitude: event.location.longitude }} title={event.title} description={event.sportType}>
                  <Callout onPress={() => handleMarkerPress(event)}>
                    <MapTooltip sportType={event.sportType} title={event.title} />
                  </Callout>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
        <View style={styles.menuBox}>
          <View style={styles.dateSwitchBox}>
            <ToggleSwitch onToggle={(filter) => setDateFilter(filter as DateFilter)} labels={dateFilters} showLabels />
          </View>
          <TouchableOpacity
            style={styles.newEventButton}
            onPress={() => {
              Vibration.vibrate(5);
              navigation.navigate("New Event", { defaultSportType: sportTypeFilter === "All" ? (favoriteSportType === "All" ? sportTypeList[1] : favoriteSportType) : sportTypeFilter });
            }}
          >
            <FontAwesome5 name="plus" size={20} style={styles.buttonText} />
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}
