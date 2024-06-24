import { ScrollView, Text, TouchableOpacity, View, StyleSheet, Image, TextInput } from "react-native";
import styles from "./Event.scss";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import { IEvent, IUserDetails } from "../../common/types";
import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { sportTypeIconMap } from "../../components/SportSelect/data";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import MapView, { LatLng, LongPressEvent, Marker } from "react-native-maps";
import moment from "moment";
import UserTag from "../../components/UserTag/UserTag";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import Loading from "../Loading/Loading";
import ScrollableList from "../../components/List/List";
import EventModel from "../../models/EventModel";
import Spinner from "../../components/Spinner/Spinner";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchImagePicker } from "../../utils/initialize";
import CloudinaryService from "../../services/CloudinaryService";
import NumberInput from "../../components/NumberInput/NumberInput";
import LoadingBox from "../../components/LoadingBox/LoadingBox";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import WeatherService, { TempForcast } from "../../services/WeatherService";

type RouteParams = {
  params: {
    event: IEvent;
  };
};

export default function EventScreen({ navigation, location }: any) {
  const authContext = useContext(AuthContext);
  const route = useRoute<RouteProp<RouteParams, "params">>();
  const { id: eventId } = route.params.event;
  const [event, setEvent] = useState<IEvent | null>(null);
  const [numOfParticipants, setNumOfParticipants] = useState<number>(0);
  const [isAdditionalInfo, setIsAdditionalInfo] = useState<boolean | null>(null);
  const [isMyEvent, setIsMyEvent] = useState<boolean | null>(null);
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marker, setMarker] = useState<LatLng | null>(null);
  const [formState, setFormState] = useState<IEvent | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [weather, setWeather] = useState<TempForcast | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const userDetails: IUserDetails = {
    fullName: authContext!.currentUser!.dbUser.fullName,
    imageUrl: authContext!.currentUser!.dbUser.imageUrl,
    id: authContext!.currentUser!.dbUser.id,
  };

  useEffect(() => {
    async function fetchWeather() {
      if (event) {
        setWeatherLoading(true);
        try {
          const weatherData = await WeatherService.getTempForcast(event.location.latitude, event.location.longitude);
          setWeather(weatherData);
        } catch (error: any) {
          setWeatherError(error.message || "An error occurred");
        } finally {
          setWeatherLoading(false);
        }
      }
    }
    fetchWeather();
  }, [event]);

  async function handleFetchEvent() {
    setLoading(true);
    try {
      const eventDetails = await EventModel.getEventById(eventId);
      if (eventDetails) {
        setEvent(eventDetails);
        setFormState(eventDetails);
        setMarker({ longitude: eventDetails.location.longitude, latitude: eventDetails.location.latitude });
        setNumOfParticipants(eventDetails.participants ? Object.keys(eventDetails.participants).length : 0);
        const hasAdditionalFields: boolean = Boolean(eventDetails.description !== undefined || eventDetails.locationType !== undefined || (eventDetails.imageUrl !== undefined && eventDetails.imageUrl !== ""));
        setIsAdditionalInfo(hasAdditionalFields);
        setIsMyEvent(userDetails.id === eventDetails.creator.id);
        setIsAttending(eventDetails.participants && !!eventDetails.participants[userDetails.id]);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleFetchEvent();
  }, []);

  async function handleDeleteEvent() {
    setLoading(true);
    try {
      await EventModel.deleteEvent(eventId);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
        navigation.navigate("Home");
      }, 700);
    } catch (error: any) {
      setError(error.message || "An error occurred");
      setLoading(false);
    }
  }

  async function updateEventDetails() {
    try {
      const eventDetails = await EventModel.getEventById(eventId);
      if (eventDetails) {
        setEvent(eventDetails);
        setFormState(eventDetails);
        setMarker({ longitude: eventDetails.location.longitude, latitude: eventDetails.location.latitude });
        setNumOfParticipants(eventDetails.participants ? Object.keys(eventDetails.participants).length : 0);
        const hasAdditionalFields: boolean = Boolean(eventDetails.description !== undefined || eventDetails.locationType !== undefined || (eventDetails.imageUrl !== undefined && eventDetails.imageUrl !== ""));
        setIsAdditionalInfo(hasAdditionalFields);
        setIsMyEvent(userDetails.id === eventDetails.creator.id);
        setIsAttending(eventDetails.participants && !!eventDetails.participants[userDetails.id]);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred");
    }
  }

  async function handleAttendEvent() {
    setLoading(true);
    try {
      await EventModel.attendEvent(eventId, userDetails);
      await updateEventDetails();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
      }, 700);
    } catch (error: any) {
      setError(error.message || "An error occurred");
      setLoading(false);
    }
  }

  async function handleUnattendEvent() {
    setLoading(true);
    try {
      await EventModel.unAttendEvent(eventId, userDetails.id);
      await updateEventDetails();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
      }, 700);
    } catch (error: any) {
      setError(error.message || "An error occurred");
      setLoading(false);
    }
  }

  function handleEditButtonPress() {
    setEdit((prev) => !prev);
    scrollToTop();
  }

  function handleMapLongPress(event: LongPressEvent) {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newMarker = { latitude, longitude };
    setMarker(newMarker);
    handleChange("location.latitude", latitude);
    handleChange("location.longitude", longitude);
    if (errors.location) errors.location = undefined;
  }

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (!formState) return;
    setShowDatePicker(false);
    if (selectedDate) {
      const currentDateTime = new Date(formState.dateTime);
      currentDateTime.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setFormState({
        ...formState,
        dateTime: currentDateTime.toISOString(),
      });
    }
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (!formState) return;
    setShowTimePicker(false);
    if (selectedTime) {
      const currentDateTime = new Date(formState.dateTime);
      currentDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setFormState({
        ...formState,
        dateTime: currentDateTime.toISOString(),
      });
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

  // useEffect(() => console.log(formState), [formState]);

  const handleChange = (field: string, value: any) => {
    // Omit locationType if value is "None"
    if (field === "locationType" && value === "None") {
      setFormState((prevState) => {
        if (!prevState) return null; // Handle null case
        const updatedState = { ...prevState };
        delete updatedState[field];
        return updatedState;
      });
      return;
    }
    // Omit participantsLimit if value is undefined
    if (field === "participantsLimit" && value === undefined) {
      setFormState((prevState) => {
        if (!prevState) return null; // Handle null case
        const updatedState = { ...prevState };
        delete updatedState[field];
        return updatedState;
      });
      return;
    }
    // Update formState with new values
    setFormState((prevState) => {
      if (!prevState) return null; // Handle null case
      return setNestedProperty(prevState, field, value);
    });
    // Clear errors if value is truthy
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
    if (!formState) return;
    const newErrors: any = {};
    if (!formState.title) newErrors.title = "Title is required";
    if (!formState.location.name) newErrors.locationName = "Location name is required";
    if (!formState.location.longitude) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).find((error) => error !== undefined) === undefined;
  };

  const handleUpdateEvent = async () => {
    if (!validate() || !formState) {
      return;
    }

    setLoading(true);
    try {
      if (imageUri) {
        // Upload event image
        const imageUrl = await CloudinaryService.uploadImage(imageUri, "");
      }
      const updatedEvent: IEvent = {
        ...formState,
        imageUrl: imageUri ? imageUri : formState.imageUrl,
      };

      await EventModel.updateEvent(eventId, updatedEvent);
      setEdit(false);
      await updateEventDetails();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
      }, 700);
    } catch (error: any) {
      setError(error.message || "An error occurred");
      setLoading(false);
      console.error("Error creating event:", error);
    }
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  function getWeatherIconPath(icon: string): any {
    switch (icon) {
      case "cold-icon":
        return require("../../assets/icons/cold-icon.png");
      case "moderate-icon":
        return require("../../assets/icons/moderate-icon.png");
      case "warm-icon":
        return require("../../assets/icons/warm-icon.png");
      default:
        return null;
    }
  }

  const handleCloseAlert = () => {
    setError(null);
  };

  if (loading) return <LoadingBox success={success} />;
  else
    return (
      <View style={styles.eventsBox}>
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
        {event && (
          <ScrollView style={styles.newEventBox} contentContainerStyle={styles.scrollBox} ref={scrollViewRef}>
            {isMyEvent && edit && (
              <View style={styles.editButtonBox}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleEditButtonPress}>
                  <Ionicons name="close" style={styles.attendButtonIcon} />
                  {/* <Text style={styles.buttonText}>{"Cancel"}</Text> */}
                </TouchableOpacity>
              </View>
            )}
            <View style={[styles.fieldBox, shadowStyles.shadow]}>
              <View style={edit && formState ? styles.titleBox : styles.eventTitleBox}>
                {edit && formState ? <TextInput style={styles.input} value={formState.title} onChangeText={(value) => handleChange("title", value)} /> : <Text style={styles.eventTitleText}>{event.title}</Text>}
              </View>
              <View style={styles.userBox}>
                <View style={[styles.userTagBox, shadowStyles.shadow]}>
                  <UserTag user={{ id: event.creator.id, fullName: event.creator.fullName, imageUrl: event.creator.imageUrl }} />
                </View>
                {sportTypeIconMap[event.sportType]}
                <Text style={styles.titleText}>{event.sportType}</Text>
              </View>
            </View>
            <View style={[styles.fieldBox, shadowStyles.shadow]}>
              <View style={styles.titleBox}>
                <FontAwesome5 name="map-marker-alt" style={styles.markerIcon} />
                {edit && formState ? (
                  <TextInput style={[styles.input, { minWidth: "90%" }]} value={formState.location.name} onChangeText={(value) => handleChange("location.name", value === "" ? undefined : value)} />
                ) : (
                  <Text style={styles.titleText}>{event.location.name}</Text>
                )}
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
                    onLongPress={handleMapLongPress}
                  >
                    {marker && <Marker coordinate={marker} title={event.title} />}
                  </MapView>
                )}
              </View>
            </View>

            <View style={[styles.fieldBox, shadowStyles.shadow]}>
              <View style={styles.titleBox}>
                <Ionicons name="calendar-outline" style={styles.dateIcon} />
                <Text style={styles.titleText}>Date & Time</Text>
              </View>
              <View style={styles.dateTimeBox}>
                <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)} disabled={!edit}>
                  <Text style={[styles.dateText, { fontSize: 18 }]}>{moment(edit && formState ? new Date(formState.dateTime) : new Date(event.dateTime)).format("MMM")}</Text>
                  <Text style={[styles.dateText, { fontSize: 38 }]}>{moment(edit && formState ? new Date(formState.dateTime) : new Date(event.dateTime)).format("D")}</Text>
                  <Text style={[styles.timeText, { fontSize: 14 }]}>{moment(edit && formState ? new Date(formState.dateTime) : new Date(event.dateTime)).format("YYYY")}</Text>
                </TouchableOpacity>
                {showDatePicker && <DateTimePicker value={edit && formState ? new Date(formState.dateTime) : new Date(event.dateTime)} mode="date" display="default" onChange={handleDateChange} />}
                <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)} disabled={!edit}>
                  <Text style={[styles.dateText, { fontSize: 24 }]}>{edit && formState ? new Date(formState.dateTime).toTimeString().substring(0, 5) : new Date(event.dateTime).toTimeString().substring(0, 5)}</Text>
                </TouchableOpacity>
                {showTimePicker && <DateTimePicker value={edit && formState ? new Date(formState.dateTime) : new Date(event.dateTime)} mode="time" display="inline" onChange={handleTimeChange} />}
                <View style={styles.weatherBox}>
                  {weatherLoading ? (
                    <View style={styles.weatherInfoBox}>
                      <Spinner size="m" />
                      <Text style={styles.weatherErrorText}>Loading Weather</Text>
                    </View>
                  ) : weatherError ? (
                    <View style={styles.weatherInfoBox}>
                      <Text style={styles.weatherErrorText}>{weatherError}</Text>
                    </View>
                  ) : (
                    weather &&
                    Object.keys(weather).map((date, index) => (
                      <View style={styles.tempBox} key={index}>
                        <View style={styles.weatherDateBox}>
                          <Text style={[styles.dateText, { fontSize: 16 }]}>{moment(new Date(date)).format("D")}</Text>
                        </View>
                        <Image source={getWeatherIconPath(weather[date].icon)} style={styles.weatherImage} />
                        <Text style={[styles.weatherText, { fontSize: 16 }]}>{weather[date].temperature.toString() + "°"}</Text>
                      </View>
                    ))
                  )}
                </View>
              </View>
            </View>

            {!edit && (
              <View style={[!isAdditionalInfo && !isMyEvent ? styles.endFieldBox : styles.fieldBox, shadowStyles.shadow]}>
                <View style={styles.titleBox}>
                  <Ionicons name="people-sharp" style={styles.participantsIcon} />
                  <Text style={styles.titleText}>Participants</Text>
                </View>
                <View style={styles.participantsBox}>
                  <View style={styles.participantsCountBox}>
                    <View style={styles.numOfParticipantsBox}>
                      <Text style={[styles.dateText, { fontSize: 38 }]}>{numOfParticipants > 0 ? numOfParticipants.toString() : "0"}</Text>
                      {event.participantsLimit && <Text style={[styles.participantsLimitText, { fontSize: 20 }]}>{`/ ${event.participantsLimit}`}</Text>}
                    </View>
                    <Text style={[styles.timeText, { fontSize: 14 }]}>Participants</Text>
                  </View>
                  <View style={styles.participantsListBox}>
                    {numOfParticipants > 0 ? (
                      Object.values(event.participants).map((participant, index) => (
                        <View style={[styles.participantTagBox, shadowStyles.shadow]} key={index}>
                          <UserTag user={{ fullName: participant.user.fullName, id: participant.user.id, imageUrl: participant.user.imageUrl }} />
                        </View>
                      ))
                    ) : (
                      <Text style={[styles.noParticipantsText, { textAlignVertical: "center" }]}>{isMyEvent ? "No one attended yet" : "Be the first to attend!"}</Text>
                    )}
                  </View>
                </View>
              </View>
            )}
            {isAdditionalInfo && (
              <View style={[isMyEvent ? styles.fieldBox : styles.endFieldBox, shadowStyles.shadow]}>
                <View style={styles.titleBox}>
                  <Feather name="info" style={styles.infoIcon} />
                  <Text style={styles.titleText}>Details</Text>
                </View>
                {event.locationType && (
                  <View style={styles.infoBox}>
                    <Text style={styles.smallTitleText}>Location type</Text>
                    {edit ? (
                      <ToggleSwitch initValue={event.locationType} onToggle={(value) => handleChange("locationType", value)} labels={["None", "Outdoor", "Indoor"]} showLabels />
                    ) : (
                      <Text style={styles.titleText}>{event.locationType}</Text>
                    )}
                  </View>
                )}
                {event.participantsLimit && edit && (
                  <View style={styles.infoBox}>
                    <Text style={styles.smallTitleText}>Participants limit</Text>
                    <View style={{ width: 170, height: 40, margin: 8 }}>
                      <NumberInput
                        min={2}
                        max={30}
                        initialVal={event.participantsLimit}
                        onChange={(value) => {
                          handleChange("participantsLimit", value);
                        }}
                      />
                    </View>
                  </View>
                )}
                {event.imageUrl && event.imageUrl !== "" && (
                  <TouchableOpacity style={styles.imgButton} onPress={handleImagePicker} disabled={!edit}>
                    <Image source={{ uri: imageUri ? imageUri : event.imageUrl }} style={styles.image} />
                    {edit && (
                      <View style={styles.imgBox}>
                        <Octicons name="image" style={styles.imgIcon} />
                      </View>
                    )}
                  </TouchableOpacity>
                )}
                {event.description && (
                  <View style={styles.infoBox}>
                    <Text style={styles.smallTitleText}>Description</Text>
                    {edit && formState ? (
                      <TextInput
                        placeholder="Description"
                        multiline
                        numberOfLines={8}
                        style={[styles.input, { textAlignVertical: "top" }]}
                        value={formState.description}
                        onChangeText={(value) => handleChange("description", value === "" ? undefined : value)}
                      />
                    ) : (
                      <Text style={styles.titleText}>{event.description}</Text>
                    )}
                  </View>
                )}
              </View>
            )}
            {isMyEvent && (
              <View style={styles.deleteButtonBox}>
                {edit ? (
                  <TouchableOpacity style={styles.saveButton} onPress={handleUpdateEvent}>
                    <FontAwesome name="check" style={styles.attendButtonIcon} />
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity style={styles.editButton} onPress={handleEditButtonPress}>
                      <FontAwesome6 name="edit" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Edit Event</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteEvent}>
                      <FontAwesome6 name="trash-can" style={styles.buttonIcon} />
                      <Text style={styles.buttonText}>Delete Event</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </ScrollView>
        )}
        {!isMyEvent &&
          (!isAttending ? (
            <TouchableOpacity style={styles.attendButton} onPress={handleAttendEvent}>
              <FontAwesome name="check" style={styles.attendButtonIcon} />
              <Text style={styles.buttonText}>Attend Event</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.unattendBox}>
              <Feather name="info" style={styles.unattendInfoIcon} />
              <Text style={styles.smallTitleText}>You are attending to this event</Text>
              <TouchableOpacity style={styles.unattendButton} onPress={handleUnattendEvent}>
                {/* <FontAwesome name="close" style={styles.attendButtonIcon} /> */}
                <Text style={styles.buttonText}>Unattend</Text>
              </TouchableOpacity>
            </View>
          ))}
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
