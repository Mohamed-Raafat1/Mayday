import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import firebase from "firebase";
import * as geofirestore from "geofirestore";
import { Button, Spinner, Toast } from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Dimensions, Image, Linking, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotification,
  customstyleAcceptedRequests,
  getExpoTokenById,
  sendPushNotification,
} from "../../Components/functions/functions";
import {
  clearAcceptedRequest,
  fetchAcceptedRequest,
  fetchUser,
} from "../../redux/actions";

const geofire = require("geofire-common");
const RESCU_TRACKING = "background-accepted-request-location";
let AcceptedRequest = null;
//______TASK MANAGER__________
TaskManager.defineTask(RESCU_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;

    let latitude = locations[0].coords.latitude;
    let longitude = locations[0].coords.longitude;
    const hash = geofire.geohashForLocation([latitude, longitude]);
    const Geofirestore = geofirestore.initializeApp(firebase.firestore());

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
      }
    });

    if (AcceptedRequest)
      await firebase
        .firestore()
        .collection("requests")
        .doc(AcceptedRequest.id)
        .update({
          DoctorCoordinates: new firebase.firestore.GeoPoint(
            latitude,
            longitude
          ),
          DoctorGeoHash: hash,
        })
        .catch((error) => {
          console.log(
            "Error in Taskmanager when uploading to firestore: ",
            error
          );
        });
  }
});

function RequestAcceptedScreen({ route, navigation }) {
  //constants
  const [Err, setErr] = useState(null);
  const [TrackingStatus, setTrackingStatus] = useState(false); //currently tracking ?
  const [PermissionGranted, setPermissionGranted] = useState(false); //foreground and background permissions granted?

  const dispatch = useDispatch();
  const currentAcceptedRequest = useSelector(
    (state) => state.userState.AcceptedRequest
  );
  AcceptedRequest = useSelector((state) => state.userState.AcceptedRequest);

  const requestid = route.params.requestid;
  const chatid = route.params.chatid;
  const currentUser = useSelector((state) => state.userState.currentUser);

  const hasUnsavedChanges = true;

  const [location, setlocation] = useState({
    longitude: 0,
    latitude: 0,
  });

  //---------mapview CONSTANTS
  const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.02; //This controls default zoom
  const LONGITUDE_DELTA = LATITUDE_DELTA * (WIDTH / HEIGHT);
  const [themargin, setthemargin] = useState(0);

  //_____Functions______

  //function to unsubscribe
  let UnsubscribeAcceptedRequest = () => {};

  //request location permissions
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
  //retrieve location in the foreground and the background------------
  const _getLocationAsync = async () => {
    try {
      //Checking if Task Already Running
      const TaskStarted = await Location.hasStartedLocationUpdatesAsync(
        RESCU_TRACKING
      );
      if (TaskStarted) {
        Location.stopLocationUpdatesAsync(RESCU_TRACKING);
      }

      //!!!!!!!!!!!!!!!to stop tracking from nearby hospital & doctors screen & doctor request when starting tracking from here
      const nearbyhospitaltracking =
        await Location.hasStartedLocationUpdatesAsync(
          "background-nearest-hospital-task"
        );
      if (nearbyhospitaltracking) {
        // console.log('stopping nearby hospital tracking')
        await Location.stopLocationUpdatesAsync(
          "background-nearest-hospital-task"
        );
      }

      const doctorscreentracking =
        await Location.hasStartedLocationUpdatesAsync(
          "background-doctor-screen-location-task"
        );
      if (doctorscreentracking) {
        await Location.stopLocationUpdatesAsync(
          "background-doctor-screen-location-task"
        );
      }

      const doctorrequesttracking =
        await Location.hasStartedLocationUpdatesAsync(
          "background-doctor-requests-location"
        );
      if (doctorrequesttracking) {
        await Location.stopLocationUpdatesAsync(
          "background-doctor-requests-location"
        );
      }

      //starting fn to fetch location in the background
      await Location.startLocationUpdatesAsync(RESCU_TRACKING, {
        accuracy: Location.Accuracy.BestForNavigation,
        showsBackgroundLocationIndicator: true,
        timeInterval: 3000,
      });

      // console.log("Background location tracking has started");
      setTrackingStatus(true);
    } catch (e) {
      setErr("Location Fetch Error\n" + e.message);
    }
  };

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
  const gotoChat = (uid, chatid) => {
    navigation.navigate("DoctorChat", {
      userid: uid,
      chatid: chatid,
    });
  };

  const CancelRequest = async () => {
    //-----------------Notification----------
    // let Message =
    //   "Dr. " +
    //   currentUser.FirstName +
    //   " " +
    //   currentUser.LastName +
    //   " cancelled your request";
    // getExpoTokenById(currentAcceptedRequest.PatientID).then((result) => {
    //   console.log(
    //     "This is notification patient id" + currentAcceptedRequest.PatientID
    //   );
    //   sendPushNotification(result, "🚨RESCU", Message, "Request");
    //   addNotification(
    //     currentAcceptedRequest.PatientID,
    //     Message,
    //     "🚨RESCU",
    //     false,
    //     "Request"
    //   );
    // });
    //-----------------------------------------------------------------
    await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .update({
        currentRequest: {
          chatid: "",
          requestid: "",
        },
      });
    AcceptedRequest = null;
  };
  //useeffects
  //Done on mount and for cleanup
  useLayoutEffect(() => {
    const unsubscribe = dispatch(fetchUser());
    if (
      currentUser &&
      currentUser.currentRequest.chatid &&
      currentUser.currentRequest.requestid
    )
      UnsubscribeAcceptedRequest = dispatch(
        fetchAcceptedRequest(currentUser.currentRequest.requestid)
      );
    else UnsubscribeAcceptedRequest = dispatch(fetchAcceptedRequest(requestid));

    return async () => {
      unsubscribe();
      await StopTracking();
      await UnsubscribeAcceptedRequest();
      await dispatch(clearAcceptedRequest());
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
    (async () => {
      if (
        currentAcceptedRequest &&
        currentAcceptedRequest.State === "Cancelled"
      ) {
        Toast.show({
          text: "The request has been cancelled by the user",
          duration: 3000,
          position: "bottom",
        });

        await CancelRequest();

        navigation.popToTop();
      }
    })();
    return () => {};
  }, [currentAcceptedRequest]);

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

  //for putting the received accepted request from redux into
  //the global variable (acceptedrequest) to be used in taskmanager
  // useEffect(() => {
  //   if (currentAcceptedRequest) AcceptedRequest = currentAcceptedRequest;
  // }, [currentAcceptedRequest]);

  //for preventing back button functionality
  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      if (AcceptedRequest) {
        if (
          AcceptedRequest.State === "Cancelled" ||
          AcceptedRequest.State === "Done"
        ) {
          AcceptedRequest = null;
          // If the user was cancelled on the userside
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          "Discard changes?",
          "You have unsaved changes. Are you sure you want to discard them and leave the screen?",
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
                // ---------------------send notification ---------------------------------
                await console.log(
                  "This is notification patient id" + AcceptedRequest.PatientID
                );
                let Message =
                  "Dr. " +
                  currentUser.FirstName +
                  " " +
                  currentUser.LastName +
                  " cancelled your request";
                getExpoTokenById(AcceptedRequest.PatientID).then((result) => {
                  console.log(
                    "This is notification patient id" +
                      AcceptedRequest.PatientID
                  );
                  sendPushNotification(result, "🚨RESCU", Message, "Request");
                  addNotification(
                    AcceptedRequest.PatientID,
                    Message,
                    "🚨RESCU",
                    false,
                    "Request"
                  );
                });
                //-----------------------------------------------------------------
                //stop locationn tracking
                await firebase
                  .firestore()
                  .collection("requests") // set the request to cancelled to remove it
                  .doc(AcceptedRequest.id)
                  .update({
                    State: "Pending",
                  })
                  .catch((error) => {
                    console.log(
                      "Error in Taskmanager when uploading to firestore: ",
                      error
                    );
                  });

                await CancelRequest();

                navigation.dispatch(e.data.action);
              },
            },
          ]
        );
      }
    });
  }, [navigation, hasUnsavedChanges]);
  const onRequestFinish = async () => {
    await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .update({
        currentRequest: {
          chatid: "",
          requestid: "",
        },
      });
    await firebase.firestore().collection("requests").doc(requestid).update({
      State: "Done",
    });
    navigation.popToTop();
  };

  let screen;
  if (
    (location.latitude === 0 && location.longitude === 0) ||
    currentAcceptedRequest == null
  ) {
    screen = (
      <View>
        <Spinner color="red" />
      </View>
    );
    setTimeout(() => {
      setlocation(currentUser.coordinates);
    }, 500);
  } else {
    screen = (
      <View style={{ flex: 1, width: "100%" }}>
        <MapView
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          customMapStyle={customstyleAcceptedRequests}
          provider="google"
          showsUserLocation={true}
          userLocationUpdateInterval={5000}
          followsUserLocation={true}
          showsCompass={true}
          showsMyLocationButton={true}
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
        >
          <Marker
            coordinate={{
              latitude: currentAcceptedRequest.coordinates.latitude,
              longitude: currentAcceptedRequest.coordinates.longitude,
            }}
            title={currentAcceptedRequest.PatientFirstName}
            description={currentAcceptedRequest.PatientFirstName}
          >
            <Image
              source={require("../../assets/PatientMarker.png")}
              style={{ height: 35, width: 35 }}
            ></Image>
          </Marker>
        </MapView>
        <Button
          onPress={() => {
            gotoChat(currentAcceptedRequest.PatientID, chatid);
            // navigation.navigate("CurrentReport", {
            //   reportid: currentAcceptedRequest.id,
            // });
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
          <Text style={{ marginRight: 10, marginBottom: 2, fontSize: 20 }}>
            Chat with {currentAcceptedRequest.PatientFirstName}
          </Text>
          <Ionicons
            style={{ marginTop: 3 }}
            name="ios-chatbox-ellipses"
            size={35}
            color="#00b3ff"
          />
        </Button>
        <Button
          onPress={() => {
            // gotoChat(currentAcceptedRequest.PatientID, chatid);
            navigation.navigate("CurrentReport", {
              reportid: currentAcceptedRequest.id,
            });
          }}
          style={{
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,

            padding: 10,

            position: "absolute",
            top: 130,
            left: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            flexDirection: "row",
            flex: 1,
          }}
        >
          <Text style={{ marginRight: 10, marginBottom: 2, fontSize: 20 }}>
            Go to current report
          </Text>
        </Button>

        <Button
          onPress={() => {
            Linking.openURL(
              "https://www.google.com/maps/dir/?api=1&destination=" +
                currentAcceptedRequest.coordinates.latitude +
                "," +
                currentAcceptedRequest.coordinates.longitude
            );
          }}
          style={{
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,

            padding: 10,

            position: "absolute",
            top: 70,
            left: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            flexDirection: "row",
            flex: 1,
          }}
        >
          <Text style={{ marginRight: 10, marginBottom: 2, fontSize: 20 }}>
            Get Directions to {currentAcceptedRequest.PatientFirstName}
          </Text>
          <Ionicons name="md-location" size={24} color="red" />
        </Button>
        <Button
          onPress={() => {
            onRequestFinish();
          }}
          style={{
            alignSelf: "center",
            position: "absolute",
            bottom: 50,
            padding: 20,
          }}
          rounded
          success
        >
          <Text style={{ color: "white" }}> Finish the request</Text>
        </Button>
      </View>
    );
  }
  if (!currentAcceptedRequest)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text> Fetching current Request</Text>
        <Spinner style={{ alignContent: "center" }} color="red"></Spinner>
      </View>
    );
  else
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {screen}
      </View>
    );
}

export default RequestAcceptedScreen;
