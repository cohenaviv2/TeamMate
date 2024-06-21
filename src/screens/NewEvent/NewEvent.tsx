import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import EventModel from "../../models/EventModel";
import { IEvent } from "../../common/types";
import SportSelect from "../../components/SportSelect/SportSelect";
import { AuthContext } from "../../context/AuthProvider";
import Loading from "../Loading/Loading";
import Octicons from "@expo/vector-icons/Octicons";
import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MapView, { LatLng, LongPressEvent, Marker } from "react-native-maps";
import styles from "./NewEvent.scss";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import NumberInput from "../../components/NumberInput/NumberInput";
import { launchImagePicker } from "../../utils/initialize";
import CloudinaryService from "../../services/CloudinaryService";
import moment from "moment";
import Spinner from "../../components/Spinner/Spinner";
import WeatherService from "../../services/WeatherService";

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
    location: {
      name: "",
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    },
    participants: {},
    creator: {
      id: user.id!,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
    },
    createdAt: new Date().toISOString(),
    id: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [error, setError] = useState<any>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<any>(null);

  useEffect(()=>console.log(formState),[formState])

  // useEffect(() => {
  //   async function fetchWeather() {
  //     if (location.coords.longitude) {
  //       try {
  //         const weatherData = await WeatherService.getWeatherByDateAndLocation(formState.dateTime, formState.location.latitude, formState.location.longitude);
  //         console.log(weatherData);
  //         setWeather(weatherData);
  //       } catch (error) {
  //         setError(error);
  //       }
  //     }
  //   }
  //   fetchWeather();
  // }, []);

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
    // Omit locationType if value is "None"
    if (field === "locationType" && value === "None") {
      setFormState((prevState) => {
        const updatedState = { ...prevState };
        delete updatedState[field];
        return updatedState;
      });
      return;
    }
    // Omit participantsLimit if value is undefined
    if (field === "participantsLimit" && value === undefined) {
      setFormState((prevState) => {
        const updatedState = { ...prevState };
        delete updatedState[field];
        return updatedState;
      });
      return;
    }
    setFormState((prevState) => setNestedProperty(prevState, field, value));
    if (value) {
      const parts = field.split(".");
      const camelCaseParts = parts.map((part, index) => {
        if (index === 0) {
          return part;
        } else {
          return part.charAt(0).toUpperCase() + part.slice(1);
        }
      });
      const camelCaseKey = camelCaseParts.join("");
      errors[camelCaseKey] = undefined;
    }
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formState.title) newErrors.title = "Title is required";
    if (!formState.location.name) newErrors.locationName = "Location name is required";
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
        const imageUrl = await CloudinaryService.uploadImage(imageUri, "");
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
        <ScrollView style={styles.newEventBox} contentContainerStyle={{ justifyContent: "center", alignItems: "center", gap: 16 }}>
          <View style={[styles.fieldBox, shadowStyles.shadow]}>
            <View style={styles.sportTypeBox}>
              <Text style={styles.titleText}>New Event</Text>
              <SportSelect excludeAllOption theme="primary" onChange={(value) => handleChange("sportType", value)} vibrate />
            </View>
            <TextInput placeholder="Event Title..." style={errors.title !== undefined ? styles.errorInput : styles.input} value={formState.title} onChangeText={(value) => handleChange("title", value)} />
            {/* {errors.title !== undefined && <Text style={styles.error}>{errors.title}</Text>} */}
          </View>

          <View style={[styles.fieldBox, shadowStyles.shadow]}>
            <View style={styles.titleBox}>
              <FontAwesome5 name="map-marker-alt" style={styles.markerIcon} />
              <Text style={styles.titleText}>Loaction</Text>
            </View>
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
            <TextInput
              placeholder="Location name..."
              style={errors.locationName !== undefined ? styles.errorInput : styles.input}
              value={formState.location.name}
              onChangeText={(value) => handleChange("location.name", value === "" ? undefined : value)}
            />
            {/* {errors.locationName !== undefined && <Text style={styles.error}>{errors.locationName}</Text>} */}
          </View>

          <View style={[styles.fieldBox, shadowStyles.shadow]}>
            <View style={styles.titleBox}>
              <Ionicons name="calendar" style={styles.dateIcon} />
              <Text style={styles.titleText}>Date & Time</Text>
            </View>
            <View style={styles.dateTimeBox}>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Text style={[styles.dateText, { fontSize: 18 }]}>{moment(new Date()).format("MMM")}</Text>
                <Text style={[styles.dateText, { fontSize: 38 }]}>{moment(new Date()).format("D")}</Text>
                <Text style={[styles.timeText, { fontSize: 14 }]}>{moment(new Date()).format("YYYY")}</Text>
              </TouchableOpacity>
              {showDatePicker && <DateTimePicker value={new Date(formState.dateTime)} mode="date" display="default" onChange={handleDateChange} />}

              <View style={styles.timeBox}>
                <View style={styles.weatherBox}>
                  {weather ? (
                    <>
                      <Text style={styles.timeText}>{weather.temp}°C</Text>
                    </>
                  ) : (
                    <Spinner size="m" />
                  )}
                </View>
                <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.timeText}>{new Date(formState.dateTime).toTimeString().substring(0, 5)}</Text>
                </TouchableOpacity>
                {showTimePicker && <DateTimePicker value={new Date(formState.dateTime)} mode="time" display="inline" onChange={handleTimeChange} />}
              </View>
            </View>
          </View>

          <Text style={[styles.titleText, { margin: 16, color: "grey" }]}>Optional</Text>

          <View style={[styles.fieldBox, shadowStyles.shadow]}>
            <View style={styles.titleBox}>
              <Ionicons name="people-sharp" style={styles.participantsIcon} />
              <Text style={styles.titleText}>Event Details</Text>
            </View>
            <View style={styles.typeBox}>
              <Text style={styles.smallTitleText}>Num of Participants:</Text>
            </View>
            <View style={{ width: 170,height:40 }}>
              <NumberInput
                min={2}
                max={30}
                initialVal={"No Limit"}
                onChange={(value) => {
                  handleChange("participantsLimit", value);
                }}
              />
            </View>
            <View style={styles.typeBox}>
              <Text style={styles.smallTitleText}>Location Type:</Text>
            </View>
            <View>
              <ToggleSwitch onToggle={(value) => handleChange("locationType", value)} labels={["None", "Outdoor", "Indoor"]} showLabels />
            </View>

            <View style={styles.typeBox}>
              <Text style={styles.smallTitleText}>Loaction Image:</Text>
            </View>
            <TouchableOpacity style={styles.imgButton} onPress={handleImagePicker}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <View style={styles.imgBox}>
                  <Octicons name="image" style={styles.imgIcon} />
                  <Text style={styles.imgBtnText}>Choose image</Text>
                </View>
              )}
            </TouchableOpacity>
            {errors.imageUrl !== undefined && <Text style={styles.error}>{errors.imageUrl}</Text>}
            <TextInput
              placeholder="Description"
              multiline
              numberOfLines={8}
              style={[styles.input, { textAlignVertical: "top" }]}
              value={formState.description}
              onChangeText={(value) => handleChange("description", value === "" ? undefined : value)}
            />
          </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <FontAwesome5 name="plus" style={styles.submitIcon} />
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
        </ScrollView>
    );
};

const shadowStyles = StyleSheet.create({
  shadow: {
    shadowColor: "#555",
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3, // Android-specific property
  },
});

export default NewEventScreen;
