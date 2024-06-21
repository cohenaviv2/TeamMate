import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import styles from "./Event.scss";
import { RouteProp, useRoute } from "@react-navigation/native";
import { IEvent, IUserDetails } from "../../common/types";
import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import { sportTypeIconMap } from "../../components/SportSelect/data";
import MapView, { Marker } from "react-native-maps";
import moment from "moment";
import UserTag from "../../components/UserTag/UserTag";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import Loading from "../Loading/Loading";
import ScrollableList from "../../components/List/List";

type RouteParams = {
  params: {
    event: IEvent;
  };
};

export default function EventScreen({ navigation, location }: any) {
  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.currentUser) {
    return <Loading spinnerSize="l" />;
  }
  const userDetails: IUserDetails = {
    fullName: authContext.currentUser.dbUser.fullName,
    imageUrl: authContext.currentUser.dbUser.imageUrl,
    id: authContext.currentUser.dbUser.id,
  };
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { event } = route.params;
  const numOfParticipants = event.participants ? Object.keys(event.participants).length : 0;
  const isAdditionalInfo = event.description || event.locationType || event.imageUrl;

  const renderEventItem = ({ item }: { item: IUserDetails }) => <UserTag user={item} />;
  const keyExtractor = (item: IUserDetails) => item.id;

  return (
    <View style={styles.eventsBox}>
      <ScrollView style={styles.newEventBox} contentContainerStyle={{ justifyContent: "center", alignItems: "center", gap: 16 }}>
        <View style={[styles.fieldBox, shadowStyles.shadow]}>
          <View style={styles.titleBox}>
            {sportTypeIconMap[event.sportType]}
            <Text style={styles.eventTitleText}>{event.title}</Text>
          </View>
          <View style={styles.userTagBox}>
            <UserTag user={userDetails} />
          </View>
        </View>
        <View style={[styles.fieldBox, shadowStyles.shadow]}>
          <View style={styles.titleBox}>
            <FontAwesome5 name="map-marker-alt" style={styles.markerIcon} />
            <Text style={styles.titleText}>{event.location.name}</Text>
          </View>
          <View style={styles.mapBox}>
            {location && (
              <MapView
                loadingBackgroundColor="#ffc000"
                style={styles.map}
                initialRegion={{
                  latitude: event.location.latitude,
                  longitude: event.location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
              >
                <Marker coordinate={{ latitude: event.location.latitude, longitude: event.location.longitude }} title={event.title} />
              </MapView>
            )}
          </View>
        </View>

        <View style={[styles.fieldBox, shadowStyles.shadow]}>
          <View style={styles.titleBox}>
            <Ionicons name="calendar" style={styles.dateIcon} />
            <Text style={styles.titleText}>Date & Time</Text>
          </View>
          <View style={styles.dateTimeBox}>
            <View style={styles.dateButton}>
              <Text style={[styles.dateText, { fontSize: 18 }]}>{moment(new Date(event.dateTime)).format("MMM")}</Text>
              <Text style={[styles.dateText, { fontSize: 38 }]}>{moment(new Date(event.dateTime)).format("D")}</Text>
              <Text style={[styles.timeText, { fontSize: 14 }]}>{moment(new Date(event.dateTime)).format("YYYY")}</Text>
            </View>

            <View style={styles.timeBox}>
              <View style={styles.timeButton}>
                <Text style={styles.timeText}>{new Date(event.dateTime).toTimeString().substring(0, 5)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[!isAdditionalInfo ? styles.endFieldBox : styles.fieldBox, shadowStyles.shadow]}>
          <View style={styles.titleBox}>
            <Ionicons name="people-sharp" style={styles.participantsIcon} />
            <Text style={styles.titleText}>Participants</Text>
          </View>
          <View style={styles.dateTimeBox}>
            <View style={styles.participantsCountBox}>
              <Text style={[styles.dateText, { fontSize: 38 }]}>{numOfParticipants > 0 ? numOfParticipants.toString() : "0"}</Text>
              <Text style={[styles.timeText, { fontSize: 14 }]}>Participans</Text>
            </View>
            <View style={styles.participantsListBox}>
              {numOfParticipants > 0 ? (
                <ScrollableList data={Object.values(event.participants).map((participant) => participant.user)} renderItem={renderEventItem} keyExtractor={keyExtractor} />
              ) : (
                <Text style={styles.noParticipantsText}>No participans found</Text>
              )}
            </View>
          </View>
        </View>
        {isAdditionalInfo && (
          <View style={[styles.endFieldBox, shadowStyles.shadow]}>
            <View style={styles.titleBox}>
              <Feather name="info" style={styles.infoIcon} />
              <Text style={styles.titleText}>Details</Text>
            </View>
            {event.locationType && (
              <View style={styles.infoBox}>
                <Text style={styles.smallTitleText}>Location type:</Text>
                <Text style={styles.titleText}>{event.locationType}</Text>
              </View>
            )}
            {event.description && (
              <View style={styles.infoBox}>
                <Text style={styles.smallTitleText}>Location type:</Text>
                <Text style={styles.titleText}>{event.locationType}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.attendButton} onPress={() => {}}>
        <Text style={styles.buttonText}>Attend Event</Text>
      </TouchableOpacity>
    </View>
  );
}

const shadowStyles = StyleSheet.create({
  shadow: {
    shadowColor: "#555",
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3, // Android-specific property
  },
});
