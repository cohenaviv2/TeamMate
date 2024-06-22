import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { IEvent } from "../../common/types";

interface MarkedDate {
  marked: boolean;
  dots: { color: string }[];
}

interface CustomCalendarProps {
  events: IEvent[];
}

const CustomCalendar = ({ events }: CustomCalendarProps) => {
  const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});
  const [selectedDateEvents, setSelectedDateEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    const dates: Record<string, MarkedDate> = {};
    events.forEach((event) => {
      const date = moment(event.dateTime).format("YYYY-MM-DD");
      if (!dates[date]) {
        dates[date] = { marked: true, dots: [] };
      }
      dates[date].dots.push({ color: "blue" });
    });
    setMarkedDates(dates);
  }, [events]);

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = day.dateString;
    const filteredEvents = events.filter((event) => moment(event.dateTime).isSame(selectedDate, "day"));
    setSelectedDateEvents(filteredEvents);
  };

  const customStyles = {
    marked: {
      backgroundColor: "red", // Light gray background color
      borderRadius: 16, // Optional: Rounded corners
      elevation: 2, // Optional: Android elevation for shadow
    },
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={"multi-dot"}
        onDayPress={handleDayPress}
        customStyles={customStyles} // Apply custom styles here
      />
      <View style={styles.eventList}>
        {selectedDateEvents.map((event) => (
          <Text key={event.id} style={styles.eventText}>
            {event.title} - {moment(event.dateTime).format("HH:mm")}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  eventList: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  eventText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default CustomCalendar;
