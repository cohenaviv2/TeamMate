import { Dimensions, View, Alert, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import fakeEvents from "./data";
import { FontAwesome5 } from "@expo/vector-icons";
import SportSelect from "../../components/SportSelect/SportSelect";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import styles from "./Home.scss";
import { AuthContext } from "../../context/AuthProvider";

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
   const authContext = useContext(AuthContext);

  const getLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Error", "Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  useEffect(() => {
    getLocationPermission();
  }, []);

  
  return (
    <Layout navigation={navigation}>
      <View style={styles.homeBox}>
        <View style={styles.headerBox}>
          <ToggleSwitch onToggle={() => {}} firstIcon={<FontAwesome5 name="map-marker-alt" size={20} />} secondIcon={<FontAwesome5 name="list" size={20} />} />
          <SportSelect initialVal={authContext!.currentUser!.dbUser.favoriteSport} theme="secondary" onChange={() => {}} />
        </View>
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
            >
              {fakeEvents.map((event) => (
                <Marker key={event.id} coordinate={{ latitude: event.latitude, longitude: event.longitude }} title={event.title} description={event.description} />
              ))}
            </MapView>
          )}
        </View>
        <TouchableOpacity style={styles.newEventButton} onPress={() => {}}>
          <FontAwesome5 name="plus" size={20} style={styles.buttonText} />
          <Text style={styles.buttonText}>Create New Event</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
