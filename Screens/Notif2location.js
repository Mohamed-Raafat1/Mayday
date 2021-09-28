import { Button, Spinner, Text, View } from "native-base";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { Linking, StyleSheet, Dimensions, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserbyID, fetchUser } from "../redux/actions/index";
import MapView, { Marker } from "react-native-maps";
import { Polyline } from "react-native-maps";
import { customMapStyle } from "../Components/functions/functions";
import { Ionicons } from "@expo/vector-icons";

function Notif2location({ route, navigation }) {
  const userid = route.params.userid;

  const dispatch = useDispatch();
  //mapview consts
  const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

  //default zoom
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (WIDTH / HEIGHT);
  const [themargin, setthemargin] = useState(0);

  const otherUser = useSelector((state) => state.userState.otherUser);
  const currentUser = useSelector((state) => state.userState.currentUser);
  useLayoutEffect(() => {
    const unsubscribe = dispatch(fetchUserbyID(userid));
    const unsubscribeCurrentUser = dispatch(fetchUser());
    return () => {
      unsubscribe();
      unsubscribeCurrentUser;
    };
  }, []);
  useEffect(() => {
    // console.log("asdasdasd", otherUser, "\nuser iddddddddddd", userid);
    return () => {};
  }, [otherUser]);

  if (currentUser && otherUser)
    return (
      <View style={{ flex: 1, width: "100%" }}>
        <MapView
          customMapStyle={customMapStyle}
          initialRegion={{
            latitude: currentUser.coordinates.latitude,
            longitude: currentUser.coordinates.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          provider="google"
          showsUserLocation={true}
          userLocationUpdateInterval={5000}
          followsUserLocation={true}
          showsCompass={true}
          // showsMyLocationButton={true}
          showsPointsOfInterest={true}
          loadingEnabled={true}
          loadingIndicatorColor="blue"
          onMapReady={() => {
            if (themargin === 0) setthemargin(1);
            else setthemargin(0);
          }}
          style={{
            width: "100%",
            flex: 1,
            marginTop: themargin,
            alignSelf: "center",
          }}
        >
          <Marker
            key={otherUser.uid}
            coordinate={{
              latitude: otherUser.coordinates.latitude,
              longitude: otherUser.coordinates.longitude,
            }}
            title={otherUser.FirstName}
            description={otherUser.LastName}
          >
            <Image
              source={require("../assets/PatientMarker.png")}
              style={{ height: 35, width: 35 }}
            ></Image>
          </Marker>
          <Polyline
            coordinates={[
              {
                latitude: currentUser.coordinates.latitude,
                longitude: currentUser.coordinates.longitude,
              },
              {
                latitude: otherUser.coordinates.latitude,
                longitude: otherUser.coordinates.longitude,
              },
            ]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={6}
          />
        </MapView>
        <Button
          style={[
            styles.button,
            {
              alignSelf: "center",
              position: "absolute",
              bottom: 50,
              padding: 20,
            },
          ]}
          transparent
          primary
          iconRight
          rounded
          onPress={() => {
            Linking.openURL(
              "https://www.google.com/maps/dir/?api=1&destination=" +
                otherUser.coordinates.latitude +
                "," +
                otherUser.coordinates.longitude
            );
          }}
        >
          <Text style={{ color: "white" }}>
            {"Get Directions to " + otherUser.FirstName}
          </Text>
          <Ionicons name="md-location" size={24} color="white" />
        </Button>
      </View>
    );
  return (
    <View>
      <Spinner color="red"></Spinner>
    </View>
  );
}

export default Notif2location;

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "rgb(250,91,90)",
    borderColor: "blue",
    borderWidth: 0,
    shadowColor: "rgba(0, 0, 0, 0)",
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 100, height: 100 },
    elevation: 10,
    bottom: 20,
  },
  View: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
});
