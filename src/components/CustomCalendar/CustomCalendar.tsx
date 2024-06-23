import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { IEvent } from "../../common/types";
import CalendarItem from "./CalendarItem/CalendarItem";
import styles from "./CustomCalendar.scss";

interface MarkedDate {
  customStyles: {
    container: any;
    text: any;
  };
}

interface CustomCalendarProps {
  events: IEvent[];
  onCalendarItemPress: (event: IEvent) => void;
}

const CustomCalendar = ({ events, onCalendarItemPress }: CustomCalendarProps) => {
  const [eventMarkedDates, setEventMarkedDates] = useState<Record<string, MarkedDate>>({});
  const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});
  const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [selectedDateEvents, setSelectedDateEvents] = useState<IEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(moment().format("YYYY-MM"));

  useEffect(() => {
    const dates: Record<string, MarkedDate> = {};
    events.forEach((event) => {
      const date = moment(event.dateTime).format("YYYY-MM-DD");
      if (!dates[date]) {
        dates[date] = {
          customStyles: {
            container: {
              backgroundColor: "#ffc000",
              borderRadius: 8,
            },
            text: {
              color: "white",
              fontWeight: "bold",
            },
          },
        };
      }
    });
    setEventMarkedDates(dates);
  }, [events, currentMonth]);

  useEffect(() => {
    updateMarkedDates(selectedDate);
  }, [selectedDate, eventMarkedDates]);

  const updateMarkedDates = (date: string) => {
    const newMarkedDates = { ...eventMarkedDates };
    if (date) {
      newMarkedDates[date] = {
        ...newMarkedDates[date],
        customStyles: {
          ...newMarkedDates[date]?.customStyles,
          container: {
            ...(newMarkedDates[date]?.customStyles?.container || {}),
            borderColor: "#ffe083",
            borderWidth: 2,
            borderRadius:10,
          },
        },
      };
    }
    setMarkedDates(newMarkedDates);

    // Set the events for the selected date
    const filteredEvents = events.filter((event) => moment(event.dateTime).isSame(date, "day"));
    setSelectedDateEvents(filteredEvents);
  };

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    updateMarkedDates(day.dateString);
  };

  const handleMonthChange = (month: { dateString: string }) => {
    setCurrentMonth(month.dateString);
  };

  return (
    <View style={styles.calendar}>
      <Calendar markedDates={markedDates} markingType={"custom"} onDayPress={handleDayPress} onMonthChange={handleMonthChange} enableSwipeMonths={true} />

      <ScrollView contentContainerStyle={styles.eventList}>
        {selectedDateEvents.length === 0 ? (
          <Text style={[styles.noEventsText, { textAlignVertical: "center" }]}>No events</Text>
        ) : (
          selectedDateEvents.map((event, index) => <CalendarItem key={index} event={event} onPress={onCalendarItemPress} />)
        )}
      </ScrollView>
    </View>
  );
};

export default CustomCalendar;
