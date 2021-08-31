import React, { useState, useEffect, useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import MapView from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import { Left, Body, Right, Button } from "native-base";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions";
const geofire = require("geofire-common");

const RESCU_TRACKING = "background-location-task";
//------------------------------TASK MANAGER-----------------------------
TaskManager.defineTask(RESCU_TRACKING, ({ data, error }) => {
  console.log("im in taskmanager");
  if (error) {
    console.log(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    console.log(data);
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

//----------------------------COMPONENT-----------------------------------
export default function ViewNearestHospital({ navigation, route }) {
  const dispatch = useDispatch();

  //Done everytime u navigate to the screen
  useLayoutEffect(() => {
    //Fetch user regardless of permission granted or not
    dispatch(fetchUser());
  }, [route]);

  //====================Constants=============================
  const currentUser = useSelector((state) => state.userState.currentUser);
  if (currentUser == undefined)
    return (
      <View style={{ justifyContent: "space-evenly" }}>
        <Text>user undefined</Text>
      </View>
    );

  //to carry the stop function of the watchposition fn
  // const [WatchPositionPromise, setWatchPositionPromise] = useState(null)

  const [Error, setError] = useState(null);
  const [TrackingStatus, setTrackingStatus] = useState(false); //currently tracking ?
  const [PermissionGranted, setPermissionGranted] = useState(false); //foreground and background permissions granted?

  const [location, setlocation] = useState({
    longitude: 0,
    latitude: 0,
  });
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
        //   PauseLocation()
        setPermissionGranted(null);
        setError(null);
      };
    }, [])
  );

  useEffect(() => {
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
  }, [PermissionGranted]);

  //----------------Conditions to decide what to show in the screen--------
  let screen;
  if (Error) {
    screen = (
      <View>
        <Text>{Error}</Text>
      </View>
    );
  } else {
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
    backgroundColor: "rgb(250,91,90)",
  },
});

// export default function ViewNearestHospital() {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setErrorMsg('Permission to access location was denied');
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
//       console.log(location.coords.latitude)
//     })();
//   }, []);

//   let text = 'Waiting..';
//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     text = JSON.stringify(location);
//   }

//   return (
//     <View style={styles.container}>

//       {location!= null &&
//             <Button  style={{width:100,height:100,justifyContent:"center", alignSelf:'center', }} onPress={()=>{Linking.openURL('https://www.google.com/maps/dir/?api=1&origin='+location.coords.latitude+',%20'+location.coords.longitude+'&destination=fisherman%27s%20wharf%3E')}}  ><Text>shet</Text></Button>
//       }
//       {/* <MapView
//       style={{width:"100%", height:"100%"}}
//       initialRegion= {{ latitude: location.coords.latitude,
//       longitude: location.coords.longitude, latitudeDelta:0.009, longitudeDelta:0.009}}
//       >
//         <MapView.Marker
//             coordinate={{latitude: location.coords.latitude,
//             longitude: location.coords.longitude}}
//             title={"title"}
//             description={"description"}/>
//         </MapView>
//        */}

//     </View>
//   );

// // THIS IS THE MAIN VERSION OF THE PAGE
//   // return (
//   //   <View>
//   //         <MapView style={styles.map}
//   //         initialRegion={{
//   //             latitude: 30.0930721,
//   //             longitude: 31.3298159,
//   //             latitudeDelta: 0.0,
//   //             longitudeDelta: 0.0,
//   //         }}
//   //         mapType={"standard"}
//   //       >
//   //       <MapView.Marker
//   //           coordinate={{latitude: 30.0930721,
//   //           longitude: 31.3298159}}
//   //           title={"title"}
//   //           description={"description"}
//   //        />
//   //     </MapView>
//   //       <View style={{flexDirection:'row', justifyContent: 'space-evenly', marginTop:10,}}>
//   //         <Left>
//   //       <Text style={{fontSize: 18, color:"#777777", marginLeft:15}}>Nearest Hospital:{"\n"}<Text style={{fontSize: 18, color:"#777777", fontWeight:"bold"}}>5 Mins Away</Text></Text>
//   //       </Left>
//   //       <Body>
//   //       <Text style={{fontSize: 18, color:"#777777", marginLeft:15}}>Location:{"\n"}<Text style={{fontSize: 18, color:"#777777", fontWeight:"bold"}}>Masr El Gedida</Text></Text>
//   //       </Body>
//   //       <Right>
//   //       <Text style={{fontSize: 18, color:"#777777", marginLeft:15}}>Name:{"\n"}<Text style={{fontSize: 18, color:"#777777", fontWeight:"bold"}}>Cleopatra Hospital</Text></Text>
//   //       </Right>
//   //     </View>
//   //     </View>
//   // );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "flex-start",
//     justifyContent: "flex-start",
//   },
//   map: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height / 2,
//   },
// });

//----------------------------------------------------------------------------------

// const updateLocation = (location) => {
//   firebase.firestore().collection("users")
//     .doc(currentUser.uid)
//     .update({
//       loc: location
//     })
//     .catch((error) => {
//       Toast.show({
//         text: error.message,
//         duration: 2000,
//       })
//       console.log(error);
//     });
// };

// const [Locations, setLocations] = useState(null);

//---------------------on Locations change-----------------------
// useEffect(() => {

//   if (Locations) {
//     let intLat = Number(Locations.locations[0].coords.latitude)
//     let intLong = Number(Locations.locations[0].coords.longitude)
//     let location = new firebase.firestore.GeoPoint(intLat, intLong);
//     updateLocation(location);
//   }
// }, [Locations])
//--------------------------------------------------------------

//--------old map
// <View style={{ justifyContent: "center", alignContent: 'center', alignSelf: "center" }} >

//   {Locations &&
//     <MapView
//       style={{ width: "100%", height: "70%" }}
//       initialRegion={{
//         latitude: currentUser.loc.latitude,
//         longitude: currentUser.loc.longitude,
//         latitudeDelta: 0.009,
//         longitudeDelta: 0.009
//       }}
//     >
//       <MapView.Marker
//         coordinate={{
//           latitude: currentUser.loc.latitude,
//           longitude: currentUser.loc.longitude
//         }}
//         title={"title"}
//         description={"description"} />
//     </MapView>
//   }
//   <Text >working</Text>
//   <View>
//     <Button onPress={() => {
//       console.log("------------------pressed-------------")
//       // await terminationFn.remove()
//       // fcn()
//       StopTracking()
//     }}>
//       <Text>press to stop</Text>
//     </Button>
//   </View>

// </View>
//-------------------------------------------

//-----------------------ON MOUNT do the following-----------------
// useEffect(() => {
//

// }, [])
//---------------------------------------------------------------------

//-------------starting fn to fetch location in the foreground---------

//===================fn to subscribe to location updates in the foreground
//   let terminationFn = await Location.watchPositionAsync({
//     accuracy: Location.Accuracy.BestForNavigation,

//     timeInterval: 2000
//   },

//     //--------------------------------------callback
//     loc => {
//       console.log("passed the watch position")
//       // console.log("the callback", terminationFn)
//       // console.log("stop is ",stoptracking)
//       // if (stoptracking === true) {
//       //   console.log("stop is ",stoptracking)
//       //   fik.remove()
//       // }
//       // fik.remove()
//     },
//     //--------------------------------------error
//     // error => {
//     //   console.log("error", error)
//     // }
//   ).catch(err => {
//     console.log("watchposition Error", err)
//     setError("WatchPosition Error\n" + err)
//   })
//   setWatchPositionPromise(terminationFn)

// const { status } = await Location.requestBackgroundPermissionsAsync();//Location.enableNetworkProviderAsync()//Location.requestBackgroundPermissionsAsync();
// if (status === 'granted') {
//   await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//     accuracy: Location.Accuracy.BestForNavigation,
//     timeInterval: 3000
//   });
// }
