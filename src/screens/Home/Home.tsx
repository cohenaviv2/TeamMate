import { View, TouchableOpacity, Vibration } from "react-native";
import React, { useContext, useState } from "react";
import Layout from "../../components/Layout/Layout";
import MapView, { Marker } from "react-native-maps";
import fakeEvents from "./data";
import { FontAwesome5 } from "@expo/vector-icons";
import SportSelect from "../../components/SportSelect/SportSelect";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import styles from "./Home.scss";
import { AuthContext } from "../../context/AuthProvider";

export default function HomeScreen({ navigation, location }: any) {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  function simulateLoading() {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }

  return (
    <Layout navigation={navigation} loading={loading}>
      <View style={styles.homeBox}>
        <View style={styles.menuBox}>
          <View style={styles.listSwitchBox}>
            <ToggleSwitch onToggle={simulateLoading} labels={["Map", "List"]} showLabels={false} icons={[<FontAwesome5 name="map-marker-alt" size={20} />, <FontAwesome5 name="list" size={20} />]} />
          </View>
          <SportSelect initialVal={authContext!.currentUser!.dbUser.favoriteSport} theme="secondary" onChange={simulateLoading} vibrate />
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
        <View style={styles.menuBox}>
          <View style={styles.dateSwitchBox}>
            <ToggleSwitch onToggle={simulateLoading} labels={["Today", "Week", "Month"]} showLabels />
          </View>
          <TouchableOpacity
            style={styles.newEventButton}
            onPress={() => {
              // Vibration.vibrate(10);
              navigation.navigate("NewEvent");
            }}
          >
            <FontAwesome5 name="plus" size={20} style={styles.buttonText} />
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}
