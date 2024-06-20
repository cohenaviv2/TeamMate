import { View, Text } from "react-native";
import React from "react";
import { IEvent } from "../../../common/types";
import styles from "./EventListItem.scss";
import { sportTypeIconMap } from "../../SportSelect/data";
import UserTag from "../../UserTag/UserTag";

interface EventListItemProps {
  event: IEvent;
}

export default function EventListItem({ event }: EventListItemProps) {
  const { fullName, imageUrl, id } = event.creator;
  return (
    <View style={styles.eventListItem}>
      <View style={styles.titleBox}>
        <View style={styles.userTagBox}>
        <UserTag fullName={fullName} imageUrl={imageUrl} id={id} />
        </View>
        <View style={styles.sportTypeBox}>
          {sportTypeIconMap[event.sportType]}
          <Text>{event.sportType}</Text>
        </View>
      </View>
      <Text>{event.title}</Text>
      <Text>{event.dateTime}</Text>
    </View>
  );
}
