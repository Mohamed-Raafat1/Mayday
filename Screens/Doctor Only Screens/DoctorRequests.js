import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  Container,
  Content,
  List,
  Icon,
  ListItem,
  Left,
  Button,
  Right,
  Body,
  View,
  Thumbnail,
  Item,
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import RequestAcceptedScreen from "./RequestAcceptedScreen";
import {
  fetchRequest,
  fetchUser,
  fetchStaticRequests,
  fetchAcceptedRequest,
} from "../../redux/actions";
let sharedChatid;

import firebase from "firebase";
import * as geofirestore from "geofirestore";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Geofirestore } from "../../App";

let Requests = [];

//variable that will carry a usestate function inside taskmanager
let updateRequestsFn = () => {
  console.log("State not yet initialized");
};

const geofire = require("geofire-common");
const RESCU_TRACKING = "background-doctor-requests-location"
////////////////////////  TASK MANAGER  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
TaskManager.defineTask(RESCU_TRACKING, async ({ data, error }) => {
  // console.log("im in doctor Requestssssss taskmanager");
  if (error) {
    console.log(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    // console.log(data);
    const { locations } = data;

    let latitude = locations[0].coords.latitude;
    let longitude = locations[0].coords.longitude;

    let location = { latitude, longitude };
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
        radius: 10,
      })
      .where("State", "==", "Pending")
      .get()
      .then((snapshot) => {
        // console.log('current requests:ssssssssssssssssss', Requests.length)
        Requests = snapshot.docs.map((doc) => {
          // console.log('the nearby users FOUND TANN  TAN  TNAN  NNNNNNN', doc.id)
          const data = doc.data();
          const id = doc.id;
          const distance = doc.distance;
          return {
            ...data,
            Requestid: id,
            distance: distance,
          };
        });
        // console.log('after snapshot:----------------', Requests.length)
      });

    updateRequestsFn(Requests)




  }
});
// ==============================================================

const DoctorRequests = ({ navigation }) => {

  //=============================CONSTANTS=========================================================

  const [Err, setErr] = useState(null);
  const [TrackingStatus, setTrackingStatus] = useState(false); //currently tracking ?
  const [PermissionGranted, setPermissionGranted] = useState(false); //foreground and background permissions granted?
  const [AvailableRequests, setAvailableRequests] = useState(Requests)
  updateRequestsFn = setAvailableRequests;
  // Create a Firestore reference
  const firestore = firebase.firestore();



  const currentUser = useSelector((state) => state.userState.currentUser);
  // Requests = useSelector((state) => state.userState.Requests);
  const dispatch = useDispatch();
  // useFocusEffect(
  //   React.useCallback(() => {
  //     dispatch(
  //       fetchStaticRequests(
  //         currentUser.g.geopoint.latitude,
  //         currentUser.g.geopoint.longitude,
  //         1000
  //       )
  //     );

  //     return () => { };
  //   }, [])
  // );


  //========================Functions==========================

  //--------------------------------fn to request permissions----------------------------------------------------
  const requestPermissions = async () => {
    try {
      //---------------- request foregroundlocationpermission
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

      // console.log("Background permission granted");
      //opening location services
      await Location.enableNetworkProviderAsync();

      // console.log("location services enabled");
      setPermissionGranted(true);
    } catch (e) {
      // console.log("Permission Error:\n ", e);
      setErr("Permission Error!\n" + e.message);
    }
  };
  //--------------------------------------------------------------------------------------------------

  //-------------Fn to retrieve location in the foreground and the background------------
  const _getLocationAsync = async () => {
    try {
      // console.log("entering get location");

      //---------------------------Checking if Task Already Running
      const TaskStarted = await Location.hasStartedLocationUpdatesAsync(
        RESCU_TRACKING
      );
      if (TaskStarted) {
        Location.stopLocationUpdatesAsync(RESCU_TRACKING);
      }

      //-----------------to stop tracking from nearby hospital & doctors screen when starting tracking from here
      const nearbyhospitaltracking = await Location.hasStartedLocationUpdatesAsync(
        "background-nearest-hospital-task"
      );
      if (nearbyhospitaltracking) {
        // console.log('stopping nearby hospital tracking')
        await Location.stopLocationUpdatesAsync("background-nearest-hospital-task");
      }

      const doctorscreentracking = await Location.hasStartedLocationUpdatesAsync(
        "background-doctor-screen-location-task"
      );
      if (doctorscreentracking) {
        // console.log('stopping nearby hospital tracking')
        await Location.stopLocationUpdatesAsync("background-doctor-screen-location-task");
      }



      //---------------------------starting fn to fetch location in the background
      //------------------------after checking that acceptedrequest tracking is disabled
      const acceptedrequesttracking = await Location.hasStartedLocationUpdatesAsync(
        "background-accepted-request-location"
      );
      // console.log('tghis is the4 doctor screen haslocatin started------------------', acceptedrequesttracking)
      if (!acceptedrequesttracking) {
        await Location.startLocationUpdatesAsync(RESCU_TRACKING, {
          accuracy: Location.Accuracy.BestForNavigation,
          showsBackgroundLocationIndicator: true,
          timeInterval: 3000,
        });
      }


      // console.log("Background location tracking has started");
      setTrackingStatus(true);
    } catch (e) {
      setErr("Location Fetch Error\n" + e.message);
    }
  };
  //--------------------------------------------------------

  //------------------------------------to stop location updates----------------------------------------------
  const StopTracking = async () => {
    const tracking = await Location.hasStartedLocationUpdatesAsync(
      RESCU_TRACKING);
    if (tracking)
      await Location.stopLocationUpdatesAsync(RESCU_TRACKING)
        .then(() => {
          setTrackingStatus(false);
        })
        .catch((err) => setErr("StopTracking Error\n" + err));
  };

  //----------------------------------------------------------


  const AcceptRequest = async (request) => {
    await firebase
      .firestore()
      .collection("requests")
      .doc(request.Requestid)
      .update({
        State: "Accepted",
        DoctorID: currentUser.uid,
        DoctorGeoHash: currentUser.g.geohash,
        DoctorCoordinates: currentUser.coordinates,
        chatid: sharedChatid,
      });
    await firebase.firestore().collection("users").doc(currentUser.uid).update({
      currentRequest: request,
    });
    await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .collection("requests")
      .doc(request.Requestid)
      .set({ ...request, State: "Accepted", current: true });
    await dispatch(fetchAcceptedRequest(request.Requestid));
    navigation.navigate("CurrentRequest", {
      requestid: request.Requestid,
      chatid: sharedChatid,
    });

    //need to notify other user that their request has been accepted
  };
  async function createChat(uid) {
    let chatAvailable = false;
    await firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("conversations")
      .where("userid", "==", currentUser.uid)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          chatAvailable = true;
          snapshot.docs.map((chat) => {
            sharedChatid = chat.id;
          });
        }
      });

    await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .collection("conversations")
      .where("userid", "==", uid)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          chatAvailable = true;
          snapshot.docs.map((chat) => {
            sharedChatid = chat.id;
          });
        }
      });
    //if there is no chat already created create one
    if (!chatAvailable) {
      let user = [];
      let chatid;
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            user = snapshot.data();
          } else {
            console.log("does not exist");
          }
        });
      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("conversations")
        .add({
          talkingto: user.FirstName + " " + user.LastName,
          userid: uid,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          userOne: {
            firsName: currentUser.FirstName,
            lastName: currentUser.LastName,
            email: currentUser.Email,
          },
          userTwo: {
            firsName: user.FirstName,
            lastName: user.LastName,
            email: user.Email,
          },
          latestMessage: {
            _id: "",
            createdAt: "",
            text: "",
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            chatid: "",
            user: "",
            chatRecepient: "",
            uid: "",
          },
        })
        .then((snapshot) => {
          chatid = snapshot.id;
          sharedChatid = snapshot.id;
        });
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("conversations")
        .doc(chatid)
        .set({
          talkingto: currentUser.FirstName + " " + currentUser.LastName,
          userid: firebase.auth().currentUser.uid,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          userOne: {
            firsName: currentUser.FirstName,
            lastName: currentUser.LastName,
            email: currentUser.Email,
          },
          userTwo: {
            firsName: user.FirstName,
            lastName: user.LastName,
            email: user.Email,
          },
          latestMessage: {
            _id: "",
            createdAt: "",
            text: "",
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            chatid: "",
            user: "",
            chatRecepient: "",
            uid: "",
          },
        });
      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update(
          "chats",
          firebase.firestore.FieldValue.arrayUnion({
            chatid: chatid,
            Recepient: uid,
          })
        );
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update(
          "chats",
          firebase.firestore.FieldValue.arrayUnion({
            chatid: chatid,
            Recepient: firebase.auth().currentUser.uid,
          })
        );
    }
  }

  const RequestsList = () => {
    if (Requests.length > 0)
      return Requests.map((request) => {
        return (
          <ListItem thumbnail key={request.Requestid}>
            <Left>
              <Thumbnail
                source={{
                  uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
                }}
              />
            </Left>
            <Body style={{ flexDirection: "column" }}>
              <Text style={{ fontWeight: "bold" }}>
                {request.PatientFirstName + " " + request.PatientLastName}
              </Text>
              <Text>Distance: {request.distance}</Text>
              <Text note numberOfLines={1}>
                Accident Type: {request.AccidentType}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Button transparent>
                  <Icon style={{ marginRight: -10 }} active name="location" />
                  <Text>Location</Text>
                </Button>
                <Button
                  onPress={async () => {
                    await createChat(request.PatientID);
                    AcceptRequest(request);
                  }}
                  transparent
                >
                  <Text>Accept</Text>
                </Button>
                <Button transparent>
                  <Text style={{ color: "red" }}>Decline</Text>
                </Button>
              </View>
            </Body>
          </ListItem>
          /*  <View key={request.Requestid}>
            <Text>
              {" "}
              {request.PatientFirstName + " " + request.PatientLastName}
            </Text>
          </View> */
        );
      });
  };

  

  //=====================================  USE EFFECTS  ========================================

  //for onmount and cleanup
  useEffect(() => {
    dispatch(fetchUser());
    
    return () => { };
  }, []);

  //-------------------for focusing and unfocusing Screen
  useFocusEffect(
    React.useCallback(() => {
      requestPermissions();

      return () => {
        
        // setisRequested(false);
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
        // console.log("entering useeffect after permission granted");
        _getLocationAsync();
      } else if (PermissionGranted == false && TrackingStatus == true) {
        // console.log("3: was tracking but permission now denied so stopping");
        StopTracking();
      }
    }
  }, [PermissionGranted, Err]);




  let screen

  if (Err || !PermissionGranted) {
    screen = (
      <View style={[styles.View, { flexDirection: 'column' }]}>
        <Text>Please Enable Location Tracking</Text>
        <Button
          onPress={() => {
            setErr(null)
            requestPermissions()
          }}
          style={[styles.button, { position: 'relative', alignSelf: 'center' }]}
          primary
          iconRight
          rounded
        >
          <Text>Enable Tracking</Text>
        </Button>
      </View>
    )
  }


  // else if (Requests.length === 0) screen = (
  //   <View style={[styles.View, { flexDirection: 'column' }]}>
  //     <Text>There are no currently available requests FUCKKCKCKKCKCKCKKC</Text>
  //   </View>
  // )

  else {
    screen = (

      <Container>
        {Requests.length === 0 ?
          <View style={[styles.View, { flexDirection: 'column' }]}>
            <Text>There are no currently available requests FUCKKCKCKKCKCKCKKC</Text>
          </View>
          :
          <Content>
            <List>
              <ListItem itemHeader first style={{ marginBottom: -30 }}>
                <Text> Nearby Location Requests</Text>
              </ListItem>
              {RequestsList()}
            </List>
          </Content>
        }

      </Container>
    );
  }
  return <Container>
    {screen}
    {/* <View>
    <Button onPress={async () => { await TaskManager.unregisterAllTasksAsync() }}>
      <Text>a8787a7a77a7a</Text>
    </Button></View> */}
  </Container>
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
