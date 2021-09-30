import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import firebase from "firebase";
import {
  Body,
  Button,
  Container,
  Content,
  Icon,
  Left,
  List,
  ListItem,
  Text,
  Thumbnail,
  View,
} from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  addNotification,
  createChat,
  getExpoTokenById,
  sendPushNotification,
} from "../../Components/functions/functions";
import { fetchUser } from "../../redux/actions";
let sharedChatid;
import * as geofirestore from "geofirestore";
let Requests = [];

//variable that will carry a usestate function inside taskmanager
let updateRequestsFn = () => {
  console.log("State not yet initialized");
};

const RESCU_TRACKING = "background-doctor-requests-location";
//  TASK MANAGER
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
        // doctor querying for nearby requests
        await Geofirestore.collection("requests")
          .near({
            center: new firebase.firestore.GeoPoint(latitude, longitude),
            radius: 5,
          })
          .where("State", "==", "Pending")
          .get()
          .then((snapshot) => {
            Requests = snapshot.docs.map((doc) => {
              const data = doc.data();
              const id = doc.id;
              const distance = doc.distance;
              return {
                ...data,
                Requestid: id,
                distance: distance,
              };
            });
          });
        Requests = Requests.filter(
          (request) => request.PatientID !== firebase.auth().currentUser.uid
        );
        updateRequestsFn(Requests);
      }
    });
  }
});
const DoctorRequests = ({ navigation }) => {
  //constants
  const [Err, setErr] = useState(null);
  const [TrackingStatus, setTrackingStatus] = useState(false); //currently tracking ?
  const [PermissionGranted, setPermissionGranted] = useState(false); //foreground and background permissions granted?
  //**************don't delete********
  const [AvailableRequests, setAvailableRequests] = useState(Requests);
  updateRequestsFn = setAvailableRequests;
  //********************************** */

  const currentUser = useSelector((state) => state.userState.currentUser);
  const dispatch = useDispatch();

  //________functions__________
  //request location permissions
  const requestPermissions = async () => {
    try {
      //request foregroundlocationpermission
      const { status: ForegroundStatus } =
        await Location.requestForegroundPermissionsAsync();

      //if foregroundpermission not granted exit the whole function
      if (ForegroundStatus !== "granted") {
        throw Error("Foreground Location permission not granted! ");
      }

      //---------------- request backgroundlocationpermission
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

  //Fn to retrieve location
  const _getLocationAsync = async () => {
    try {
      const TaskStarted = await Location.hasStartedLocationUpdatesAsync(
        RESCU_TRACKING
      );
      if (TaskStarted) {
        Location.stopLocationUpdatesAsync(RESCU_TRACKING);
      }

      //to stop tracking from nearby hospital & doctors screen when starting tracking from here
      const nearbyhospitaltracking =
        await Location.hasStartedLocationUpdatesAsync(
          "background-nearest-hospital-task"
        );
      if (nearbyhospitaltracking) {
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

      //starting fn to fetch location in the background
      //after checking that acceptedrequest tracking is disabled
      const acceptedrequesttracking =
        await Location.hasStartedLocationUpdatesAsync(
          "background-accepted-request-location"
        );
      if (!acceptedrequesttracking) {
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

  const AcceptRequest = async (request) => {
    firebase.firestore().collection("requests").doc(request.Requestid).update({
      State: "Accepted",
      DoctorID: currentUser.uid,
      DoctorGeoHash: currentUser.g.geohash,
      DoctorCoordinates: currentUser.coordinates,
      DoctorFirstName: currentUser.FirstName,
      DoctorLastName: currentUser.LastName,
      DoctorPhotoURI: currentUser.PhotoURI,
      chatid: sharedChatid,
    });
    firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .update({
        currentRequest: { requestid: request.Requestid, chatid: sharedChatid },
      });
    navigation.navigate("CurrentRequest", {
      requestid: request.Requestid,
      chatid: sharedChatid,
    });

    //need to notify other user that their request has been accepted
    let Message =
      "Dr. " +
      currentUser.FirstName +
      " " +
      currentUser.LastName +
      " accepted your request";
    getExpoTokenById(request.PatientID).then((result) => {
      sendPushNotification(result, "🚨RESCU", Message, "Request");
      addNotification(request.PatientID, Message, "🚨RESCU", false, "Request");
    });
  };

  const RequestsList = () => {
    if (Requests.length > 0)
      return Requests.map((request) => {
        return (
          <ListItem thumbnail key={request.Requestid}>
            <Left>
              <Thumbnail
                style={{ marginTop: -40 }}
                source={{
                  uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
                }}
              />
            </Left>
            <Body style={{ flexDirection: "column" }}>
              <Text style={{ fontWeight: "bold" }}>
                {request.PatientFirstName + " " + request.PatientLastName}
              </Text>
              <Text>Distance: {request.distance.toFixed(3)} KM</Text>
              <Text note numberOfLines={1}>
                Accident Type: {request.AccidentType}
              </Text>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <Button
                  rounded
                  style={{
                    marginTop: -40,
                    marginRight: 10,
                    backgroundColor: "rgba(40,40,40,1)",
                  }}
                  onPress={async () => {
                    sharedChatid = await createChat(
                      request.PatientID,
                      currentUser
                    );
                    AcceptRequest(request);
                  }}
                >
                  <Text>Accept</Text>
                </Button>
              </View>
            </Body>
          </ListItem>
        );
      });
  };

  //USE EFFECTS
  //for onmount and cleanup
  useEffect(() => {
    const unsubscribeUser = dispatch(fetchUser());
    console.log("in the scurrent user use effect");
    if (
      currentUser &&
      currentUser.currentRequest.requestid &&
      currentUser.currentRequest.chatid
    ) {
      console.log("7amraaaaaaaaaaaaaaa", currentUser.currentRequest.requestid);
      navigation.navigate("CurrentRequest", {
        requestid: currentUser.currentRequest.requestid,
        chatid: currentUser.currentRequest.chatid,
      });
    }

    return () => {
      unsubscribeUser();
    };
  }, []);

  useEffect(() => {
    return () => {};
  }, []);

  //-------------------for focusing and unfocusing Screen
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

  let screen;

  if (Err || !PermissionGranted) {
    screen = (
      <View style={[styles.View, { flexDirection: "column" }]}>
        <Text>Please Enable Location Tracking</Text>
        <Button
          onPress={() => {
            setErr(null);
            requestPermissions();
          }}
          style={[styles.button, { position: "relative", alignSelf: "center" }]}
          primary
          iconRight
          rounded
        >
          <Text>Enable Tracking</Text>
        </Button>
      </View>
    );
  } else {
    screen = (
      <Container>
        {Requests.length === 0 ? (
          <View style={[styles.View, { flexDirection: "column" }]}>
            <Text style={{ alignSelf: "center" }}>
              There are no currently available requests{" "}
            </Text>
          </View>
        ) : (
          <Content>
            <List>
              <ListItem itemHeader first style={{ marginBottom: -30 }}>
                <Text> Nearby Location Requests</Text>
              </ListItem>
              {RequestsList()}
            </List>
          </Content>
        )}
      </Container>
    );
  }
  return <Container>{screen}</Container>;
};

export default DoctorRequests;

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
    backgroundColor: "rgb(250,91,90)",
    shadowColor: "rgba(0, 0, 255, 255)",
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 100, height: 100 },
    elevation: 10,
  },
  View: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
});
