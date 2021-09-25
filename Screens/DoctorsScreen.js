import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { StyleSheet, Dimensions, Image } from "react-native";
import { Marker } from "react-native-maps";
import {
  Container,
  Header,
  Button,
  View,
  Text,
  Content,
  Spinner,
  Left,
  Body,
  Right,
  Toast,
} from "native-base";
import { Avatar, Title } from "react-native-paper";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, fetchRequest } from "../redux/actions";
import { Geofirestore } from "../App";
const RESCU_TRACKING = "background-doctor-screen-location-task";
const geofire = require("geofire-common");
let RequestCreated = false;
let Requestid = null;
let users = [];

// To DO: apply the fix from ViewNearestHospital

////////////////////////  TASK MANAGER  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
TaskManager.defineTask(RESCU_TRACKING, async ({ data, error }) => {
  // console.log("im in doctor screen taskmanager");
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
    // console.log("this is the request id", Requestid);

    if (Requestid) {
      await Geofirestore.collection("requests")
        .doc(Requestid)
        .update({
          coordinates: new firebase.firestore.GeoPoint(latitude, longitude),
        });
    }
  }
});
// ==============================================================

////////////////////////////  MAIN COMPONENT   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function DoctorsScreen() {

  //=============================CONSTANTS=========================================================
  const [RequestCreated, setRequestCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // do we show spinner or show screen
  const [isRequested, setisRequested] = useState(false); //state of request (is button pressed or not?)
  const [RequestID, setRequestID] = useState(false);

  const [Err, setErr] = useState(null);
  const [TrackingStatus, setTrackingStatus] = useState(false); //currently tracking ?
  const [PermissionGranted, setPermissionGranted] = useState(false); //foreground and background permissions granted?

  const currentUser = useSelector((state) => state.userState.currentUser);
  const state = useSelector((state) => state);
  // console.log("this is the state-------------------------------", state);
  const currentRequest = useSelector(
    (state) => state.requestState.currentRequest
  );
  // console.log("this is the current request", currentUser.uid, currentRequest);
  const dispatch = useDispatch();

  //----------------------constants for mapview
  const [location, setlocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.02; //This controls default zoom
  const LONGITUDE_DELTA = LATITUDE_DELTA * (WIDTH / HEIGHT);
  const [themargin, setthemargin] = useState(0);
  const [count, setcount] = useState(0); //this is just for a workaround to mapview issue
  //=====================================================================================================


  //========================Functions==========================

  //for unsubscribing
  let UnsubscribeRequest = () => { }

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

      //-----------------to stop tracking from nearby hospital when starting tracking from here
      const nearbyhospitaltracking = await Location.hasStartedLocationUpdatesAsync(
        "background-nearest-hospital-task"
      );
      if (nearbyhospitaltracking) {
        // console.log('stopping nearby hospital tracking')
        await Location.stopLocationUpdatesAsync("background-nearest-hospital-task");
      }

      //---------------------------starting fn to fetch location in the background
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



  //-------------------this is big part of create request and send it----------------
  async function SendRequest() {
    // await firebase;
    await Geofirestore.collection("requests")
      .add({
        AccidentType: "",
        DoctorID: "",
        DoctorGeoHash: "",
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

        RequestType: "Location",
        State: "Pending",
      })
      .then((result) => {
        Requestid = result.id;

        setRequestID(Requestid);

        setisRequested(true);



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


  const getNearByUsers = async () => {
    const query = await Geofirestore.collection("users").near({
      center: new firebase.firestore.GeoPoint(
        currentUser.coordinates.latitude,
        currentUser.coordinates.longitude
      ),
      radius: 15,
    });

    await query
      .where("medicalProfessional", "==", false)
      .get()
      .then((snapshot) => {
        users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return {
            ...data,
            id,
          };

        });
      })
      .catch((error) => {
        console.log(error);
      });
    // users = users.filter((x) => x.uid != firebase.auth().currentUser.uid);
    // console.log("this is the first user....\n", users[0]);
    setcount(count + 1);

    users = users.filter((user) => user.id != currentUser.uid);

    return users;
  };

  //=====================================  USE EFFECTS  ========================================

  //Done on mount
  useLayoutEffect(() => {
    const UnsubscribeUser =
      dispatch(fetchUser());

    return () => {
      UnsubscribeUser()
      UnsubscribeRequest()
    };
  }, []);

  useEffect(() => {
    if (Err) {
      console.log("there is ERROR\n", Err);
      StopTracking();
    } else {
      if (PermissionGranted == true && TrackingStatus == false) {
        // console.log("entering useeffect after permission granted");
        _getLocationAsync();
      } else if (PermissionGranted == false && TrackingStatus == true) {
        // console.log("3: was tracking but permission now denied so stopping");
        StopTracking();
      }
    }
  }, [PermissionGranted, isRequested, Err]);

  //-------------------for focusing and unfocusing Screen
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

  // checking if current request got accepted to view map
  // useEffect(() => {
  //   // console.log("i am here", currentRequest);
  //   if (currentRequest ) {
  //     console.log('NOW IM REQWUESTISOANGONAISONFG')
  //     setIsLoading(false);
  //   }
  // }, [currentRequest]);


  let screen;
  if (!currentUser) {
    screen = (
      <View style={{ justifyContent: "space-evenly" }}>
        <Text>user undefined</Text>
      </View>
    );
  } else {
    if (isRequested) {
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
                      onPress={() => {
                        console.log(
                          marker.g.geopoint.latitude,
                          marker.g.geopoint.longitude
                        );
                      }}
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
                {/* {users.length > 0 &&
                    users.map((marker) => (
                      <Marker
                        onPress={() => {
                          console.log(
                            marker.g.geopoint.latitude,
                            marker.g.geopoint.longitude
                          );
                        }}
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
                    ))} */}
              </MapView>
              <Button
                style={[styles.button, { alignSelf: "center" }]}
                onPress={() => {
                  console.log("------------------pressed-------------");
                  //       // await terminationFn.remove()
                  //       // fcn()
                  StopTracking();
                  setPermissionGranted(0);
                }}
              >
                <Text>Stop Tracking</Text>
              </Button>
            </View>
          );
        }
      }
    } else if (!Err) {
      screen = (
        <View style={styles.View}>
          <Button
            onPress={() => {
              SendRequest();
              getNearByUsers()
            }}
            style={[styles.button, { position: 'relative', alignSelf: 'center' }]}
            primary
            iconRight
            rounded
          >
            <Text>Request Doctor</Text>
          </Button>
        </View>
      );
    }
    else {
      screen = (
        <View style={[styles.View, { flexDirection: 'column' }]}>
          <Text>Please Enable Location Tracking</Text>
          <Button
            onPress={() => {
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

{
  /*      
        {isLoading ? (<Spinner />) : (

          <View>
            <MapView style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height / 2,
            }}
              initialRegion={{
                latitude: 30.0930721,
                longitude: 31.3298159,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
              }}
              mapType={"standard"}
            >
              <MapView.Marker
                coordinate={{
                  latitude: 30.0930721,
                  longitude: 31.3298159
                }}
                title={"title"}
                description={"description"}
              />
            </MapView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, marginBottom: 15 }}>
              <Left>
                <Text style={{ fontSize: 18, color: "#777777", marginLeft: 15 }}>Nearest Hospital:{"\n"}<Text style={{ fontSize: 18, color: "#777777", fontWeight: "bold" }}>5 Mins Away</Text></Text>
              </Left>
              <Body>
                <Text style={{ fontSize: 18, color: "#777777", marginLeft: 15 }}>Location:{"\n"}<Text style={{ fontSize: 18, color: "#777777", fontWeight: "bold" }}>Masr El Gedida</Text></Text>
              </Body>
              <Right>
                <Text style={{ fontSize: 18, color: "#777777", marginLeft: 15 }}>Name:{"\n"}<Text style={{ fontSize: 18, color: "#777777", fontWeight: "bold" }}>Cleopatra Hospital</Text></Text>
              </Right>
            </View>
            <View>
              <View style={styles.avatar}>
                <Avatar.Image
                  source={{
                    uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
                  }}
                  size={80}
                />
              </View>

              <View>
                <Title style={styles.title}>Dr Ahmed Samir</Title>
              </View>
            </View>
          </View>
        )} */
}

{
  /* if you want to activate request doctor with button
         <Button 
        rounded  
        style={{marginTop: 10, backgroundColor: "rgb(250,91,90)"}}>
          <Text>Request Doctor</Text>
        </Button> */
}

{
  /*add a spinner once you open the screen*/
}
