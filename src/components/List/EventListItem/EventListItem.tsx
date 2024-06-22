import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { IEvent } from "../../../common/types";
import { sportTypeIconMap } from "../../SportSelect/data";
import UserTag from "../../UserTag/UserTag";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import moment from "moment";
import styles from "./EventListItem.scss";
import { AuthContext } from "../../../context/AuthProvider";

interface EventListItemProps {
  event: IEvent;
  onEventPress: (event: IEvent) => void;
}

export default function EventListItem({ event, onEventPress }: EventListItemProps) {
  const authContext = useContext(AuthContext);
  const isMyEvent = authContext?.currentUser?.dbUser.id === event.creator.id;
  const numOfParticipants = event.participants ? Object.keys(event.participants).length : 0;
  const sportTypeIcon = React.cloneElement(sportTypeIconMap[event.sportType], {
    style: { ...sportTypeIconMap[event.sportType].props.style, fontSize: 22, marginLeft: -2 },
  });
  return (
    <TouchableOpacity style={[isMyEvent ? styles.myEventListItem : styles.eventListItem, shadowStyles.shadow]} activeOpacity={0.8} onPress={() => onEventPress(event)}>
      <View style={styles.dateTimeBox}>
        <View style={styles.dateBox}>
          <Text style={[styles.dateText, { fontSize: 16 }]}>{moment(event.dateTime).format("MMM")}</Text>
          <Text style={[styles.dateText, { fontSize: 36 }]}>{moment(event.dateTime).format("D")}</Text>
        </View>
        <View style={styles.timeBox}>
          <Text style={[styles.dateText, { fontSize: 16 }]}>{moment(event.dateTime).format("HH:mm")}</Text>
        </View>
      </View>
      <View style={styles.eventInfoBox}>
        <View style={styles.titleBox}>
          {sportTypeIcon}
          <Text style={styles.eventTitleText}>{event.title}</Text>
        </View>
        <View style={styles.titleBox}>
          <FontAwesome5 name="map-marker-alt" style={styles.markerIcon} />
          <Text style={styles.titleText}>{event.location.name}</Text>
        </View>
        <View style={styles.userTitleBox}>
          <Ionicons name="people-sharp" style={styles.participantsIcon} />
          <Text style={styles.participantsText}> {numOfParticipants.toString()}</Text>
          {event.participantsLimit && <Text style={styles.seperatorText}>/</Text>}
          {event.participantsLimit && <Text style={styles.seperatorText}>{event.participantsLimit}</Text>}
          {authContext && authContext.currentUser?.dbUser.id !== event.creator.id && (
            <View style={styles.userTagBox}>
              <UserTag user={event.creator} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const shadowStyles = StyleSheet.create({
  shadow: {
    shadowColor: "#555",
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1, // Android-specific property
  },
});
