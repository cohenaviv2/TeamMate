import React, { useContext, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import EventModel from "../../models/EventModel";
import { IEvent } from "../../common/types";
import SportSelect from "../../components/SportSelect/SportSelect";
import { AuthContext } from "../../context/AuthProvider";
import Loading from "../Loading/Loading";
import Octicons from "@expo/vector-icons/Octicons";
import MapView, { LatLng, LongPressEvent, Marker } from "react-native-maps";
import styles from "./NewEvent.scss";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import NumberInput from "../../components/NumberInput/NumberInput";
import { launchImagePicker } from "../../utils/initialize";
import { uploadImage } from "../../services/cloudinaryService";
import Spinner from "../../components/Spinner/Spinner";

const NewEventScreen = ({ navigation, location }: any) => {
  const authContext = useContext(AuthContext);
  if (!authContext || !authContext.currentUser) {
    return <Loading spinnerSize="l" />;
  }
  const user = authContext.currentUser.dbUser;
  const [formState, setFormState] = useState<IEvent>({
    title: "",
    dateTime: new Date().toISOString(),
    sportType: "Basketball",
    imageUrl: "",
    location: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
    participants: {},
    creator: {
      id: user.id!,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
    },
    createdAt: new Date().toISOString(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [error, setError] = useState<any>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentDateTime = new Date(formState.dateTime);
      currentDateTime.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setFormState((prevState) => ({
        ...prevState,
        dateTime: currentDateTime.toISOString(),
      }));
    }
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const currentDateTime = new Date(formState.dateTime);
      currentDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setFormState((prevState) => ({
        ...prevState,
        dateTime: currentDateTime.toISOString(),
      }));
    }
  };

  const handleImagePicker = async () => {
    const uri = await launchImagePicker([5, 4]);
    setImageUri(uri);
  };

  const setNestedProperty = (obj: any, path: string, value: any) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const lastObj = keys.reduce((acc, key) => (acc[key] = acc[key] || {}), obj);
    if (lastKey) lastObj[lastKey] = value;
    return { ...obj };
  };

  const handleChange = (field: string, value: any) => {
    setFormState((prevState) => setNestedProperty(prevState, field, value));
    if (value) errors[field] = undefined;
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formState.title) newErrors.title = "Title is required";
    if (!formState.location.longitude) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).find((error) => error !== undefined) === undefined;
  };

  function handleMapLongPress(event: LongPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newMarker = { latitude, longitude };
    setMarker(newMarker);
    handleChange("location.latitude", latitude);
    handleChange("location.longitude", longitude);
    if (errors.location) errors.location = undefined;
  }

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      if (imageUri) {
        // Upload event image
        const imageUrl = await uploadImage(imageUri, "");
      }
      const newEvent: IEvent = {
        ...formState,
        imageUrl: imageUri ? imageUri : "",
        createdAt: new Date().toISOString(),
      };

      await EventModel.createEvent(newEvent);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
        navigation.goBack();
      }, 700);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.error("Error creating event:", error);
    }
  };

  if (loading)
    return (
      <View style={styles.spinnerBox}>
        <Image source={require("../../assets/images/logo2.png")} style={styles.logo} />
        {success ? <Octicons name="check-circle-fill" style={styles.successIcon} /> : <Spinner size="l" theme="primary" />}
      </View>
    );
  else
    return (
      <View style={styles.eventsBox}>
        <ScrollView style={styles.newEventBox} contentContainerStyle={{ justifyContent: "center", alignItems: "center", gap: 16 }}>
          <View style={[styles.sportTypeBox, shadowStyles.shadow]}>
            <Text style={styles.newEventText}>New</Text>
            <SportSelect excludeAllOption theme="secondary" onChange={(value) => handleChange("sportType", value)} vibrate />
            <Text style={styles.newEventText}>Event</Text>
          </View>

          <TextInput placeholder="Event Title" style={[errors.title !== undefined ? styles.errorInput : styles.input, shadowStyles.shadow]} value={formState.title} onChangeText={(value) => handleChange("title", value)} />
          {errors.title !== undefined && <Text style={styles.error}>{errors.title}</Text>}

          <View style={errors.location ? styles.errorMapBox : styles.mapBox}>
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
                onLongPress={handleMapLongPress}
              >
                {marker && <Marker coordinate={marker} title={formState.title} />}
              </MapView>
            )}
          </View>
          {errors.location !== undefined && <Text style={styles.error}>{errors.location}</Text>}

          <View style={styles.dateTimeBox}>
            <TouchableOpacity style={[styles.dateButton, shadowStyles.shadow]} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{new Date(formState.dateTime).toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker value={new Date(formState.dateTime)} mode="date" display="default" onChange={handleDateChange} />}

            <TouchableOpacity style={[styles.timeButton, shadowStyles.shadow]} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.dateText}>{new Date(formState.dateTime).toTimeString().substring(0, 5)}</Text>
            </TouchableOpacity>
            {showTimePicker && <DateTimePicker value={new Date(formState.dateTime)} mode="time" display="inline" onChange={handleTimeChange} />}
          </View>

          <Text style={styles.labelText}>Optional?:</Text>
          <View style={styles.typeBox}>
            <Text>Location Type:</Text>
            <View style={{ width: "70%" }}>
              <ToggleSwitch onToggle={(value) => handleChange("locationType", value)} labels={["Outdoor", "Indoor"]} showLabels />
            </View>
          </View>
          <TextInput placeholder="Location name" style={[styles.input, shadowStyles.shadow]} value={formState.location.name} onChangeText={(value) => handleChange("location.name", value === "" ? undefined : value)} />
          <View style={errors.imageUrl !== undefined ? styles.errorImgBox : styles.imgBox}>{imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}</View>
          {errors.imageUrl !== undefined && <Text style={styles.error}>{errors.imageUrl}</Text>}
          <TouchableOpacity style={styles.imgButton} onPress={handleImagePicker}>
            <Octicons name="image" style={styles.imgIcon} />
            <Text style={styles.imgBtnText}>Choose image</Text>
          </TouchableOpacity>

          <View style={styles.typeBox}>
            <Text>Num of Participants:</Text>
            <View style={{ width: "50%", marginLeft: 16 }}>
              <NumberInput
                min={2}
                max={30}
                initialVal={"No Limit"}
                onChange={(value) => {
                  handleChange("participantsLimit", value);
                }}
              />
            </View>
          </View>

          <TextInput
            placeholder="Description"
            multiline
            numberOfLines={8}
            style={[styles.input, shadowStyles.shadow, { textAlignVertical: "top" }]}
            value={formState.description}
            onChangeText={(value) => handleChange("description", value === "" ? undefined : value)}
          />

        </ScrollView>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Create Event</Text>
          </TouchableOpacity>
      </View>
    );
};

const shadowStyles = StyleSheet.create({
  shadow: {
    shadowColor: "#555",
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1, // Android-specific property
  },
});

export default NewEventScreen;
