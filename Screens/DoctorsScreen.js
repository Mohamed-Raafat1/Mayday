import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import * as geofirestore from "geofirestore";

import { Button, Spinner, Toast, View } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import {
  CancelCurrentRequest,
  fetchRequest,
  fetchUser,
} from "../redux/actions";
import { Polyline } from "react-native-maps";
import { customMapStyle } from "../Components/functions/functions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

let alreadyAccepted = false;
const RESCU_TRACKING = "background-doctor-screen-location-task";

let Requestid = null;
let users = [];

// To DO: apply the fix from ViewNearestHospital

/* ______________________________
  Task Manager
  -------------------------------
 */
TaskManager.defineTask(RESCU_TRACKING, async ({ data, error }) => {
  const Geofirestore = geofirestore.initializeApp(firebase.firestore());
  if (error) {
    console.log(error);

    return;
  }
  if (data) {
    const { locations } = data;

    let latitude = locations[0].coords.latitude;
    let longitude = locations[0].coords.longitude;
    let location = { latitude, longitude };

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
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
        if (Requestid) {
          await Geofirestore.collection("requests")
            .doc(Requestid)
            .update({
              coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
            });
        }
      }
    });
    // console.log("this is the request id", Requestid);
  }
});

/* ______________________________
  Main Component
  -------------------------------
 */
function DoctorsScreen({ navigation }) {
  //*_*_*_*_*_constants*_*_*_*_*_*_*
  let usersunsubsrcibe = () => {};
  //state of request (is button pressed or not?)
  const [isRequested, setisRequested] = useState(false);
  const [Err, setErr] = useState(null);
  //currently tracking ?
  const [TrackingStatus, setTrackingStatus] = useState(false);
  //foreground and background permissions granted?
  const [PermissionGranted, setPermissionGranted] = useState(false);

  const currentUser = useSelector((state) => state.userState.currentUser);
  const currentRequest = useSelector(
    (state) => state.requestState.currentRequest
  );
  //mapview consts
  const dispatch = useDispatch();
  const [location, setlocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

  //default zoom
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (WIDTH / HEIGHT);
  const [themargin, setthemargin] = useState(0);
  const [count, setcount] = useState(0);

  //for unsubscribing
  let UnsubscribeRequest = () => {};

  //Request Permissions
  const requestPermissions = async () => {
    try {
      const { status: ForegroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (ForegroundStatus !== "granted") {
        throw Error("Foreground Location permission not granted! ");
      }
      const { status: BackgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (BackgroundStatus !== "granted") {
        throw Error("Background Location permission not granted!");
      }
      await Location.enableNetworkProviderAsync();

      setPermissionGranted(true);
    } catch (e) {
      // console.log("Permission Error:\n ", e);
      setErr("Permission Error!\n" + e.message);
    }
  };

  //Retrieve function background and foreground
  const _getLocationAsync = async () => {
    try {
      const TaskStarted = await Location.hasStartedLocationUpdatesAsync(
        RESCU_TRACKING
      );
      if (TaskStarted) {
        Location.stopLocationUpdatesAsync(RESCU_TRACKING);
      }

      //to stop tracking from nearby hospital when starting tracking from here
      const nearbyhospitaltracking =
        await Location.hasStartedLocationUpdatesAsync(
          "background-nearest-hospital-task"
        );
      if (nearbyhospitaltracking) {
        await Location.stopLocationUpdatesAsync(
          "background-nearest-hospital-task"
        );
      }

      //starting fn to fetch location in the background
      await Location.startLocationUpdatesAsync(RESCU_TRACKING, {
        accuracy: Location.Accuracy.BestForNavigation,
        showsBackgroundLocationIndicator: true,
        timeInterval: 3000,
      });

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
    if (tracking)
      await Location.stopLocationUpdatesAsync(RESCU_TRACKING)
        .then(() => {
          setTrackingStatus(false);
        })
        .catch((err) => setErr("StopTracking Error\n" + err));
  };

  //Create and send request
  async function SendRequest() {
    const Geofirestore = geofirestore.initializeApp(firebase.firestore());
    // await firebase;
    await Geofirestore.collection("requests")
      .add({
        AccidentType: "",
        DoctorID: "",
        DoctorGeoHash: "",
        Condition: "",
        coordinates: new firebase.firestore.GeoPoint(
          location.latitude,
          location.longitude
        ),
        PatientGeoHash: currentUser.g.geohash,
        PatientID: currentUser.uid,
        PatientFirstName: currentUser.FirstName,
        PatientLastName: currentUser.LastName,
        PatientGender: currentUser.Gender,
        PatientMedicalID: currentUser.MedicalID,
        PatientNumber: currentUser.PhoneNumber,
        PatientEmail: currentUser.Email,
        chatid: "",
        PatientPhotoURI: currentUser.PhotoURI,
        RequestType: "Location",
        State: "Pending",
      })
      .then((result) => {
        Requestid = result.id;

        setisRequested(true);
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .update({
            currentRequestID: result.id,
          });

        UnsubscribeRequest = dispatch(fetchRequest(result.id));
      })
      .catch((error) => {
        Toast.show({
          text: error.message,
          duration: 2000,
        });
        console.log(error);
      });
  }

  const gotoChat = (uid, chatid) => {
    navigation.navigate("Chat", {
      userid: uid,
      chatid: chatid,
    });
  };

  const getNearByUsers = () => {
    const Geofirestore = geofirestore.initializeApp(firebase.firestore());

    usersunsubsrcibe = Geofirestore.collection("users")
      .near({
        center: new firebase.firestore.GeoPoint(
          currentUser.coordinates.latitude,
          currentUser.coordinates.longitude
        ),
        radius: 15,
      })
      .where("medicalProfessional", "==", true)
      .onSnapshot((snapshot) => {
        users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return {
            ...data,
            id,
          };
        });
      });
    // users = users.filter((x) => x.uid != firebase.auth().currentUser.uid);
    // console.log("this is the first user....\n", users[0]);
    setcount(count + 1);

    // users = users.filter((user) => user.id != currentUser.uid);

    return users;
  };

  //  USE EFFECTS

  //Done on mount + cleanup
  useLayoutEffect(() => {
    const UnsubscribeUser = dispatch(fetchUser());

    return async () => {
      UnsubscribeUser();
      await UnsubscribeRequest();
      usersunsubsrcibe();
      await dispatch(CancelCurrentRequest());
    };
  }, []);

  useEffect(() => {
    if (Err) {
      console.log("there is ERROR\n", Err);
      StopTracking();
    } else {
      if (PermissionGranted == true && TrackingStatus == false) {
        _getLocationAsync();
      } else if (PermissionGranted == false && TrackingStatus == true) {
        StopTracking();
      }
    }
  }, [PermissionGranted, isRequested, Err]);
  const cancelRequest = async () => {
    await StopTracking();

    await UnsubscribeRequest();

    await dispatch(CancelCurrentRequest());

    await firebase
      .firestore()
      .collection("requests")
      .doc(Requestid)
      .update({ State: "Cancelled" });

    Requestid = null;
  };

  //focusing and unfocusing Screen
  useFocusEffect(
    React.useCallback(() => {
      requestPermissions();

      return () => {
        setisRequested(false);
        setPermissionGranted(0);
        setErr(null);
      };
    }, [])
  );

  useEffect(() => {
    if (currentRequest && currentRequest.State == "Accepted") {
      alreadyAccepted = true;
      Toast.show({
        text: "Your Request has been accepted\n A Medical professional is on the way",
        type: "success",
      });
    }

    return () => {};
  }, [currentRequest]);
  //on mount
  useEffect(() => {
    if (currentUser && currentUser.currentRequestID !== "") {
      UnsubscribeRequest = dispatch(fetchRequest(currentUser.currentRequestID));
      Requestid = currentUser.currentRequestID;
      requestPermissions();
    }
    return () => {
      UnsubscribeRequest();
    };
  }, []);
  //rendering
  let screen;
  if (!currentUser) {
    screen = (
      <View style={{ justifyContent: "space-evenly" }}>
        <Text>user undefined</Text>
      </View>
    );
  } else {
    if (currentRequest) {
      if (location.latitude === 0 && location.longitude === 0) {
        screen = (
          <View>
            <Spinner color="red" />
          </View>
        );
        // console.log("in settimeout now");
        setTimeout(() => {
          setlocation(currentUser.coordinates);
        }, 500);
      } else {
        screen = (
          <View style={{ flex: 1, width: "100%" }}>
            <MapView
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
              // loadingEnabled={true}
              // loadingIndicatorColor="blue"
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
              {currentRequest.State == "Pending" &&
                users.length > 0 &&
                users.map((marker) => (
                  <Marker
                    onPress={() => {}}
                    key={marker.id}
                    coordinate={{
                      latitude: marker.g.geopoint.latitude,
                      longitude: marker.g.geopoint.longitude,
                    }}
                    title={marker.FirstName}
                    description={marker.LastName}
                  >
                    <Image
                      source={require("../assets/doctor.png")}
                      style={{ height: 35, width: 35 }}
                    ></Image>
                  </Marker>
                ))}
              {currentRequest.State == "Accepted" && (
                <Marker
                  coordinate={{
                    latitude: currentRequest.DoctorCoordinates.latitude,
                    longitude: currentRequest.DoctorCoordinates.longitude,
                  }}
                  title="batee5"
                ></Marker>
              )}
              {currentRequest.State == "Accepted" && (
                <Polyline
                  coordinates={[
                    {
                      latitude: currentUser.coordinates.latitude,
                      longitude: currentUser.coordinates.longitude,
                    },
                    {
                      latitude: currentRequest.DoctorCoordinates.latitude,
                      longitude: currentRequest.DoctorCoordinates.longitude,
                    },
                  ]}
                  strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                  strokeWidth={10}
                />
              )}
            </MapView>
            {currentRequest.State == "Accepted" && (
              <Button
                onPress={() => {
                  gotoChat(currentRequest.DoctorID, currentRequest.chatid);
                }}
                style={{
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,

                  padding: 10,

                  position: "absolute",
                  top: 10,
                  left: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    marginRight: 10,
                    marginBottom: 2,
                    fontSize: 20,
                  }}
                >
                  Chat with Dr. {currentRequest.DoctorFirstName}
                </Text>
                <Ionicons
                  style={{ marginTop: 3 }}
                  name="ios-chatbox-ellipses"
                  size={35}
                  color="#00b3ff"
                />
              </Button>
            )}
            <Button
              rounded
              bordered
              style={[styles.button, { alignSelf: "center" }]}
              onPress={async () => {
                Alert.alert(
                  "Discard changes?",
                  "You have an ongoing request are you sure you want to cancel?",
                  [
                    {
                      text: "Don't cancel Request",
                      style: "cancel",
                      onPress: () => {},
                    },
                    {
                      text: "Cancel Request",
                      style: "destructive",
                      // If the user confirmed, then we dispatch the action we blocked earlier
                      // This will continue the action that had triggered the removal of the screen

                      onPress: async () => {
                        //stop locationn tracking
                        cancelRequest();
                        firebase
                          .firestore()
                          .collection("users")
                          .doc(firebase.auth().currentUser.uid)
                          .update({
                            currentRequestID: "",
                          });
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={{ color: "white" }}>Cancel Request</Text>
            </Button>
          </View>
        );
      }
    } else if (!Err) {
      screen = (
        <View style={styles.View}>
          <Button
            onPress={() => {
              console.log("pressed");
              SendRequest();
              getNearByUsers();
            }}
            style={[
              styles.button,
              { position: "relative", alignSelf: "center" },
            ]}
            primary
            iconRight
            rounded
          >
            <Text>Request Doctor</Text>
          </Button>
        </View>
      );
    } else {
      screen = (
        <View style={[styles.View, { flexDirection: "column" }]}>
          <Text>Please Enable Location Tracking</Text>
          <Button
            onPress={() => {
              requestPermissions();
            }}
            style={[
              styles.button,
              { position: "relative", alignSelf: "center" },
            ]}
            primary
            iconRight
            rounded
          >
            <Text>Enable Tracking</Text>
          </Button>
        </View>
      );
    }
  }

  return <View style={styles.container}>{screen}</View>;
}

export default DoctorsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    alignItems: "center",
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 3,
    marginBottom: 5,
    textAlign: "center",
  },
  button: {
    position: "absolute",
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "rgb(250,91,90)",
    shadowColor: "rgba(0, 0, 255, 255)",
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
