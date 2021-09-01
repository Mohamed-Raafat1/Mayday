import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import MapView from "react-native-maps";
import { useLayoutEffect } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { StyleSheet, Dimensions } from "react-native";
const geofire = require("geofire-common");

const RESCU_TRACKING = "background-location-task";
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

//------------------------------TASK MANAGER-----------------------------
TaskManager.defineTask(RESCU_TRACKING, ({ data, error }) => {
  console.log("im in taskmanager");
  if (error) {
    console.log(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    // console.log(data);
    const { locations } = data;

    console.log("im in taskmanager", locations);

    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    const hash = geofire.geohashForLocation([lat, long]);
    let location = new firebase.firestore.GeoPoint(lat, long);
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        geohash: hash,
        loc: location,
      })
      .catch((error) => {
        console.log(
          "Error in Taskmanager when uploading to firestore: ",
          error
        );
      });
  }
});
// ==============================================================

function DoctorsScreen() {
  //=============================CONSTANTS=========================================================
  const [isLoading, setIsLoading] = useState(false); // do we show spinner or show screen
  const [isRequested, setisRequested] = useState(false); //state of request (is button pressed or not?)
  const [RequestID, setRequestID] = useState(null);
  const [location, setlocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [Error, setError] = useState(null);
  const [TrackingStatus, setTrackingStatus] = useState(false); //currently tracking ?
  const [PermissionGranted, setPermissionGranted] = useState(false); //foreground and background permissions granted?

  const currentUser = useSelector((state) => state.userState.currentUser);
  const currentRequest = useSelector((state) => state.requestState);

  const dispatch = useDispatch();
  //=====================================================================================================

  //Done on mount
  useLayoutEffect(() => {
    dispatch(fetchUser());
  }, []);

  if (currentUser == undefined)
    return (
      <View style={{ justifyContent: "space-evenly" }}>
        <Text>user undefined</Text>
      </View>
    );

  if (currentRequest == null)
    return (
      <View style={{ justifyContent: "space-evenly" }}>
        <Text>request undefined</Text>
      </View>
    );

  {
    /*if u want to make button call the loading:
const apiCall = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };*/
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  // }, []);

  // Toast.show({
  //   text: error.message,
  //   duration: 2000,
  // });
  //========================Functions==========================

  //--------------------------------fn to request permissions----------------------------------------------------
  const requestPermissions = async () => {
    //----------------request foregroundlocationpermission
    const { status: ForegroundStatus } =
      await Location.requestForegroundPermissionsAsync().catch((err) => {
        console.log("Foreground Permission Error:", err);
        setError("Foreground Permission Error\n" + err);
      });

    if (ForegroundStatus !== "granted") {
      setError("Foreground Location permission not granted! ");
      return;
    }

    //----------------request backgroundlocationpermission
    const { status: BackgroundStatus } =
      await Location.requestBackgroundPermissionsAsync().catch((err) => {
        console.log("Background Permission Error:", err);
        setError("Background Permission Error\n" + err);
      });

    if (BackgroundStatus !== "granted") {
      setError("Background Location permission not granted!");
      return;
    }

    console.log("Background permission granted, calling get location function");

    //opening location services
    Location.enableNetworkProviderAsync()
      .then(() => {
        setPermissionGranted(true);
      })
      .catch((err) => setError("Networkservice error\n" + err));
  };
  //--------------------------------------------------------------------------------------------------

  //-------------Fn to retrieve location in the foreground and the background------------
  const _getLocationAsync = async () => {
    console.log("entering get location");

    //------------------------fn to get initial location for the mapview
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    })
      .then((loc) => {
        setlocation(loc.coords);
        console.log(location);
      })
      .catch((err) => {
        console.log("getcurrentposition error:", err);
        setError("GetCurrentPosition Error \n" + err);
      });

    //---------------------------starting fn to fetch location in the background
    Location.startLocationUpdatesAsync(RESCU_TRACKING, {
      accuracy: Location.Accuracy.BestForNavigation,
      showsBackgroundLocationIndicator: true,
      timeInterval: 3000,
    })
      .then(() => {
        console.log("Background location tracking has started");
        setTrackingStatus(true);
      })
      .catch((err) => {
        console.log("StartLocationUpdate Error:", err);
        setError("Error when starting LocationUpdate:\n" + err);
      });
  };
  //--------------------------------------------------------

  //------------------------------------to stop location updates----------------------------------------------
  const StopTracking = async () => {
    await Location.stopLocationUpdatesAsync(RESCU_TRACKING)
      .then(() => {
        setTrackingStatus(false);
      })
      .catch((err) => setError("StopTracking Error\n" + err));
  };

  //-------------------for focusing and unfocusing Screen------------------------------
  useFocusEffect(
    React.useCallback(() => {
      requestPermissions();

      return () => {
        setisRequested(false);
        //   PauseLocation()
        setPermissionGranted(null);
        setError(null);
      };
    }, [])
  );

  useEffect(() => {
    if (isRequested) {
      if (PermissionGranted == true && TrackingStatus == false) {
        console.log("entering useeffect after permission granted");
        _getLocationAsync();
      } else if (PermissionGranted == true && TrackingStatus == true) {
        console.log("2");
        StopTracking();
        _getLocationAsync();
      } else if (PermissionGranted == false && TrackingStatus == true) {
        console.log("3");
        StopTracking();
      }
    } else {
      if (TrackingStatus == true) StopTracking();
    }
  }, [PermissionGranted, isRequested]);
  //this is big part of create request and send it and set loading to true till a doctor accepts request (for now spinner waits only for 2 seconds then shows doctor)
  async function SendRequest() {
    let id = await firebase
      .firestore()
      .collection("requests")
      .add({
        AccidentType: "",
        DoctorID: "",
        Location: currentUser.loc,
        PatientID: currentUser.uid,
        RequestType: "Location",
        State: "Pending",
      })
      .then((result) => {
        setRequestID(result.id);
      })
      .catch((error) => {
        Toast.show({
          text: error.message,
          duration: 2000,
        });
        console.log(error);
      });
    console.log(RequestID);
    setRequestID(id);
    setisRequested(true);
    console.log(isRequested);

    setIsLoading(true);

    //this part is just for testing until we can receive requests
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }

  useEffect(() => {
    console.log(isRequested);
    if (isRequested === true) {
      dispatch(fetchRequest(RequestID));
    }
  }, [isRequested]);

  let screen;
  if (isLoading) {
    screen = (
      <View>
        <Spinner color="red" />
      </View>
    );
  } else if (isRequested) {
    screen = (
      <View style={{ flex: 1, width: "100%" }}>
        <MapView
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.045,
            longitudeDelta: 0.045,
          }}
          showsUserLocation={true}
          userLocationUpdateInterval={5000}
          followsUserLocation={true}
          showsCompass={true}
          showsMyLocationButton={true}
          showsPointsOfInterest={true}
          loadingEnabled={true}
          loadingIndicatorColor="blue"
          style={{ width: "100%", flex: 1 }}
        />
        <Button
          style={[styles.button, { alignSelf: "center" }]}
          onPress={() => {
            console.log("------------------pressed-------------");
            //       // await terminationFn.remove()
            //       // fcn()
            StopTracking();
          }}
        >
          <Text>Stop Tracking</Text>
        </Button>
      </View>
    );
  } else {
    screen = (
      <View style={styles.View}>
        <Button
          onPress={SendRequest}
          style={styles.button}
          primary
          iconRight
          rounded
        >
          <Text>Request Doctor</Text>
        </Button>
      </View>
    );
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
