import React, { useContext, useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import EventModel from "../../models/EventModel";
import { IEvent } from "../../common/types";
import styles from "./NewEvent.scss";
import SportSelect from "../../components/SportSelect/SportSelect";
import { AuthContext } from "../../context/AuthProvider";
import Loading from "../Loading/Loading";
import MapView from "react-native-maps";

const NewEventScreen = ({ navigation, location }: any) => {
  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.currentUser) {
    return <Loading spinnerSize="l" />;
  }
  const user = authContext.currentUser.dbUser;
  const [formState, setFormState] = useState<IEvent>({
    title: "",
    date: new Date(),
    sportType: "Basketball",
    imageUrl: "",
    location: {
      name: "",
      latitude: location.latitude,
      longitude: location.longitude,
    },
    participants: [],
    creator: {
      id: user.id!,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
    },
    createdAt: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormState((prevState) => ({
        ...prevState,
        date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), prevState.date.getHours(), prevState.date.getMinutes()),
      }));
    }
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormState((prevState) => ({
        ...prevState,
        date: new Date(prevState.date.getFullYear(), prevState.date.getMonth(), prevState.date.getDate(), selectedTime.getHours(), selectedTime.getMinutes()),
      }));
    }
  };

  const handleChange = (field: keyof IEvent, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formState.title) newErrors.title = "Title is required";
    if (!formState.location.name) newErrors.locationName = "Location name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    const newEvent: IEvent = {
      ...formState,
      location: {
        ...formState.location,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      createdAt: new Date(),
    };

    try {
      await EventModel.createEvent(newEvent);
      navigation.goBack();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <ScrollView style={styles.newEventBox} contentContainerStyle={{ justifyContent: "center", alignItems: "center", gap: 16 }}>
      <View style={styles.sportTypeBox}>
        <Text style={styles.newEventText}>New</Text>
        <SportSelect excludeAllOption theme="secondary" onChange={(value) => handleChange("sportType", value)} vibrate />
        <Text style={styles.newEventText}>Event</Text>
      </View>

      {/* <Text style={styles.text}>Location:</Text> */}
      <View style={styles.mapBox}>
        {location && (
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
          ></MapView>
        )}
      </View>

      {/* <Text style={styles.text}>Date and Time:</Text> */}
      <View style={styles.dateTimeBox}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>{formState.date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && <DateTimePicker value={formState.date} mode="date" display="default" onChange={handleDateChange} />}

        <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.buttonText}>{formState.date.toTimeString().substring(0, 5)}</Text>
        </TouchableOpacity>
        {showTimePicker && <DateTimePicker value={formState.date} mode="time" display="inline" onChange={handleTimeChange} />}
      </View>

      {/* <Text style={styles.text}>Event Title:</Text> */}
      <TextInput placeholder="Title" style={styles.input} value={formState.title} onChangeText={(value) => handleChange("title", value)} />
      {errors.title && <Text style={styles.error}>{errors.title}</Text>}
      
      <Text>Location Type</Text>
      <TextInput style={styles.input} value={formState.locationType} onChangeText={(value) => handleChange("locationType", value)} />

      <Text>Participants Limit</Text>
      <TextInput style={styles.input} value={formState.participantsLimit ? formState.participantsLimit.toString() : ""} onChangeText={(value) => handleChange("participantsLimit", parseInt(value))} keyboardType="numeric" />

      <Text>Description</Text>
      <TextInput style={styles.input} value={formState.description} onChangeText={(value) => handleChange("description", value)} />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewEventScreen;
