import { Text, StyleSheet, Dimensions, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import styles from "./Home.scss";
import fakeEvents from "./data";

const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

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
        <Text>gfgfg</Text>
        <View style={styles.mapBox}>
          {location && <MapView
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
          </MapView>}
        </View>
      </View>
    </Layout>
  );
}
