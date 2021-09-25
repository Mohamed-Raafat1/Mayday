import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import firebase from "firebase";
import { Button, Spinner } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Dimensions, Linking, StyleSheet, Text, View } from "react-native";
import MapView, { Callout } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { Geofirestore } from "../App";
import { customMapStyle } from "../Components/functions/functions";
import { fetchUser } from "../redux/actions";

const RESCU_TRACKING = "background-nearest-hospital-task";
//TASK MANAGER
TaskManager.defineTask(RESCU_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log(error);
    return;
  }
  if (data) {
    const { locations } = data;

    let latitude = locations[0].coords.latitude;
    let longitude = locations[0].coords.longitude;
    await Geofirestore.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
      })
      .catch((error) => {
        console.log(
          "Error in Taskmanager when uploading to firestore: ",
          error
        );
      });
  }
});

// MAIN COMPONENT
export default function ViewNearestHospital({ navigation, route }) {
  // Constants
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);
  if (currentUser == undefined)
    return (
      <View style={{ justifyContent: "space-evenly" }}>
        <Text>user undefined</Text>
      </View>
    );

  const [Err, setErr] = useState(null);
  const [TrackingStatus, setTrackingStatus] = useState(false);
  const [PermissionGranted, setPermissionGranted] = useState(false);

  //constants for mapview
  const [location, setlocation] = useState({
    longitude: currentUser.coordinates.longitude,
    latitude: currentUser.coordinates.latitude,
  });
  const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");
  //This controls default zoom
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (WIDTH / HEIGHT);
  //this is just for a workaround to mapview issue
  const [themargin, setthemargin] = useState(0);
  const [MarkerName, setMarkerName] = useState();
  const [MarkerPosition, setMarkerPosition] = useState();
  const [MarkerID, setMarkerID] = useState();
  //  Functions
  // fn to request permissions
  const requestPermissions = async () => {
    try {
      const { status: ForegroundStatus } =
        await Location.requestForegroundPermissionsAsync();

      //if foregroundpermission not granted exit the whole function
      if (ForegroundStatus !== "granted") {
        throw Error("Foreground Location permission not granted! ");
      }

      const { status: BackgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();

      //if backgroundpermission not granted exit the whole function
      if (BackgroundStatus !== "granted") {
        throw Error("Background Location permission not granted!");
      }

      //opening location services
      await Location.enableNetworkProviderAsync();
      setPermissionGranted(true);
    } catch (e) {
      setErr("Permission Error!\n" + e.message);
    }
  };

  //Fn to retrieve location in the foreground and the background
  const _getLocationAsync = async () => {
    try {
      //Checking if Task Already Running
      const TaskStarted = await Location.hasStartedLocationUpdatesAsync(
        RESCU_TRACKING
      );
      if (TaskStarted) {
        await Location.stopLocationUpdatesAsync(RESCU_TRACKING);
      }

      const doctorscreentracking =
        await Location.hasStartedLocationUpdatesAsync(
          "background-doctor-screen-location-task"
        );

      if (!doctorscreentracking) {
        //starting fn to fetch location in the background
        await Location.startLocationUpdatesAsync(RESCU_TRACKING, {
          accuracy: Location.Accuracy.BestForNavigation,
          showsBackgroundLocationIndicator: true,
          timeInterval: 3000,
        });
      }

      setTrackingStatus(true);
    } catch (e) {
      setErr("Location Fetch Error\n" + e.message);
    }
  };

  //to stop location updates
  const StopTracking = async () => {
    const tracking = await Location.hasStartedLocationUpdatesAsync(
      RESCU_TRACKING
    );
    if (tracking) {
      await Location.stopLocationUpdatesAsync(RESCU_TRACKING).catch((err) =>
        setErr("StopTracking Error\n" + err)
      );
    }
    setTrackingStatus(false);
  };

  //____ USE EFFECTS___

  //Done on Mount + cleanup
  useLayoutEffect(() => {
    //Fetch user regardless of permission granted or not
    const Unsubscribe = dispatch(fetchUser());
    return () => {
      Unsubscribe();
    };
  }, []);

  //for focusing and unfocusing Screen
  useFocusEffect(
    React.useCallback(() => {
      requestPermissions();
      return () => {
        setPermissionGranted(0);
        setErr(null);
      };
    }, [])
  );

  useEffect(() => {
    if (Err) {
      console.log("there is ERROR\n", Err);
      if (TrackingStatus == true) StopTracking();
    } else {
      if (PermissionGranted == true && TrackingStatus == false) {
        _getLocationAsync();
      } else if (PermissionGranted == false && TrackingStatus == true) {
        StopTracking();
      }
    }
  }, [PermissionGranted, Err]);

  const onMarkerPress = async () => {
    return (
      <MapView>
        <Callout
          alphaHitTest
          tooltip
          onPress={(e) => {
            if (
              e.nativeEvent.action === "marker-inside-overlay-press" ||
              e.nativeEvent.action === "callout-inside-press"
            ) {
              return;
            }

            console.log("callout pressed");
          }}
          style={styles.customView}
        ></Callout>
      </MapView>
    );
  };

  //Conditions to decide what to show in the screen
  let screen;
  if (Err) {
    screen = (
      <View>
        <Text>Please Turn On Your Location Services</Text>
        <Button
          style={styles.button}
          onPress={() => {
            requestPermissions();
            setErr(false);
          }}
        >
          <Text>Enable Tracking</Text>
        </Button>
      </View>
    );
  } else if (TrackingStatus == false) {
    screen = (
      <View>
        <Text>Tracking Disabled</Text>
        <Button
          style={styles.button}
          onPress={() => {
            setPermissionGranted(0);
            requestPermissions();
          }}
        >
          <Text>Enable Tracking</Text>
        </Button>
      </View>
    );
  } else if (location.latitude === 0 && location.longitude === 0) {
    screen = (
      <View>
        <Spinner color="red" />
      </View>
    );

    setTimeout(() => {
      setlocation(currentUser.coordinates);
    }, 500);
  } else if (MarkerName) {
    screen = (
      <View style={{ flex: 1, width: "100%" }}>
        <MapView
          onPoiClick={(e) => {
            console.log(e.nativeEvent)
            setMarkerName(e.nativeEvent.name);
            setMarkerPosition(e.nativeEvent.coordinate);
            setMarkerID(e.nativeEvent.placeId)
          }}
          customMapStyle={customMapStyle}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
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
        />
        <Button
          style={[styles.button, { alignSelf: "center" }]}
          onPress={() => {
            console.log("------------------pressed-------------");
            StopTracking();
          }}
        >
          <Text>Stop Tracking</Text>
        </Button>
        <Button
          onPress={() => {
            console.log(MarkerPosition);
            Linking.openURL(
              "https://www.google.com/maps/dir/?api=1&destination=" + MarkerPosition
              + "&destination_place_id=" + MarkerID
            );
          }}
        >
          <Text>Get Direction To {MarkerName}</Text>
        </Button>
      </View>
    );
  } else {
    screen = (
      <View style={{ flex: 1, width: "100%" }}>
        <MapView
          onPoiClick={(e) => {
            console.log(e.nativeEvent)

            setMarkerName(e.nativeEvent.name);
            setMarkerPosition(e.nativeEvent.coordinate);
            setMarkerID(e.nativeEvent.placeId)
          }}
          customMapStyle={customMapStyle}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
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
          loadingIndicatorColor="red"
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
        />
        <Button
          style={[styles.button, { alignSelf: "center" }]}
          onPress={() => {
            console.log("------------------pressed-------------");
            StopTracking();
          }}
        >
          <Text>Stop Tracking</Text>
        </Button>
      </View>
    );
  }

  return <View style={styles.container}>{screen}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 10
  },

  button: {
    marginTop: 50,
    marginBottom: 10,
    alignContent: "center",
    alignSelf: "center",
    backgroundColor: "rgb(250,91,90)",
  },
});
