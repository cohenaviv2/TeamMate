import { View, TouchableOpacity, Text } from "react-native";
import styles from "./CalendarItem.scss";
import { IEvent, SportType } from "../../../common/types";
import { sportTypeIconMap } from "../../SportSelect/data";
import moment from "moment";

interface CalendarItemProps {
  event: IEvent;
  onPress: (event: IEvent) => void;
}

export default function CalendarItem({ event, onPress }: CalendarItemProps) {
  return (
    <TouchableOpacity style={styles.calendarItemBox} onPress={() => onPress(event)}>
      {sportTypeIconMap[event.sportType]}
      <Text style={styles.titleText}>{event.title}</Text>
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>{moment(event.dateTime).format("HH:mm")}</Text>
      </View>
    </TouchableOpacity>
  );
}
