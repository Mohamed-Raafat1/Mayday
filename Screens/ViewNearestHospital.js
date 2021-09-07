import React, { useState, useEffect, useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import MapView, { Callout } from "react-native-maps";
import { Dimensions, StyleSheet, Text, View, Linking } from "react-native";
import { Left, Body, Right, Button, Spinner } from "native-base";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions";
const geofire = require("geofire-common");

const RESCU_TRACKING = "background-location-task";
////////////////////////  TASK MANAGER  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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

    // console.log("im in taskmanager", locations);

    let latitude = locations[0].coords.latitude;
    let longitude = locations[0].coords.longitude;
    const hash = geofire.geohashForLocation([latitude, longitude]);
    let location = { latitude, longitude }
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        geohash: hash,
        location,
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

////////////////////////////  MAIN COMPONENT   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export default function ViewNearestHospital({ navigation, route }) {

  //==============================  Constants  =================================
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);
  if (currentUser == undefined)
    return (
      <View style={{ justifyContent: "space-evenly" }}>
        <Text>user undefined</Text>
      </View>
    );


  const [Err, setErr] = useState(null);
  const [TrackingStatus, setTrackingStatus] = useState(false); //currently tracking ?
  const [PermissionGranted, setPermissionGranted] = useState(false); //foreground and background permissions granted?



  //----------------------constants for mapview
  const [location, setlocation] = useState({
    longitude: currentUser.location.longitude,
    latitude: currentUser.location.latitude,
  });
  const { height: HEIGHT, width: WIDTH } = Dimensions.get('window');
  const LATITUDE_DELTA = 0.02; //This controls default zoom
  const LONGITUDE_DELTA = LATITUDE_DELTA * (WIDTH / HEIGHT);
  const [themargin, setthemargin] = useState(0)  //this is just for a workaround to mapview issue
  const [MarkerName, setMarkerName] = useState()
  const [MarkerPosition, setMarkerPosition] = useState()
  //======================================   Functions   ======================================================================
  //--------------------------------  fn to request permissions  ----------------------------------------------------
  const requestPermissions = async () => {

    try {
      //---------------- request foregroundlocationpermission
      const { status: ForegroundStatus } =
        await Location.requestForegroundPermissionsAsync()
      // .catch((err) => {
      //   console.log("Foreground Permission Error:", err);
      //   setErr("Foreground Permission Error\n" + err);
      // });

      //if foregroundpermission not granted exit the whole function
      if (ForegroundStatus !== "granted") {
        throw Error("Foreground Location permission not granted! ")
      }

      //if request foreground returned error then exit
      // if (Error) return

      //---------------- request backgroundlocationpermission
      const { status: BackgroundStatus } =
        await Location.requestBackgroundPermissionsAsync()
      // .catch((err) => {
      //   console.log("Background Permission Error:", err);
      //   setErr("Background Permission Error\n" + err);
      // });

      //if backgroundpermission not granted exit the whole function
      if (BackgroundStatus !== "granted") {
        throw Error("Background Location permission not granted!")
      }



      console.log("Background permission granted");
      //opening location services
      await Location.enableNetworkProviderAsync()
      // .then(() => {
      console.log('location services enabled')
      setPermissionGranted(true);
      // })
      // .catch((err) => setErr("Networkservice error\n" + err));
    }
    catch (e) {
      console.log('Permission Error:\n ', e)
      setErr('Permission Error!\n' + e.message)
    }
  };
  //--------------------------------------------------------------------------------------------------

  //-------------  Fn to retrieve location in the foreground and the background------------
  const _getLocationAsync = async () => {
    try {
      console.log("entering get location");


      // await Location.hasServicesEnabledAsync()
      //   .then(r => {
      //     console.log(r)
      //   }
      //   )
      //   .catch(e => {
      //     throw Error('serveice fujk' + e.message)
      //   })
      //------------------------  fn to get initial location for the mapview
      // const currentloc = await 
      // await Location.getCurrentPositionAsync({
      //   accuracy: Location.Accuracy.Balanced,

      // })
      //   .then((loc) => {
      //     console.log('initial Location received\n', loc)
      //     setlocation(loc.coords);
      //   })
      //   .catch((err) => {
      //     // console.log("getcurrentposition error:", err);
      //     // setErr("GetCurrentPosition Error \n" + err);
      //     throw Error('Error' + err.message)
      //   });


      // console.log('currentloc:',currentloc)
      // setlocation(currentloc.coords)




      //if getlocation returned an error then exit
      // if (Err) return
      //---------------------------Checking if Task Already Running
      const TaskStarted = await Location.hasStartedLocationUpdatesAsync(RESCU_TRACKING)
      if (TaskStarted) {
        Location.stopLocationUpdatesAsync(RESCU_TRACKING)
      }

      //---------------------------starting fn to fetch location in the background
      await Location.startLocationUpdatesAsync(RESCU_TRACKING, {
        accuracy: Location.Accuracy.BestForNavigation,
        showsBackgroundLocationIndicator: true,
        timeInterval: 3000,
      })

      console.log("Background location tracking has started");
      setTrackingStatus(true);

      // .catch((err) => {
      //   console.log("StartLocationUpdate Error:", err);
      //   setErr("Error when starting LocationUpdate:\n" + err);
      // });
    }
    catch (e) {
      setErr('Location Fetch Error\n' + e.message)
    }
  };
  //--------------------------------------------------------

  //------------------------------------  to stop location updates  ----------------------------------------------
  const StopTracking = async () => {
    if (TrackingStatus)
      Location.stopLocationUpdatesAsync(RESCU_TRACKING)
        .then(() => {
          setTrackingStatus(false);
        })
        .catch((err) => setErr("StopTracking Error\n" + err));
  };

  //=====================================  USE EFFECTS  ========================================

  //-------------------Done on Mount
  useLayoutEffect(() => {
    //Fetch user regardless of permission granted or not
    dispatch(fetchUser());
    return () => {
      StopTracking()
    }
  }, []);

  //-------------------for focusing and unfocusing Screen
  useFocusEffect(
    React.useCallback(() => {
      requestPermissions();
      // setthemargin(3)
      return () => {
        //   PauseLocation()
        setPermissionGranted(null);
        setErr(null);
      };
    }, [])
  );

  useEffect(() => {

    if (Err) {
      console.log('there is ERROR\n', Err)
      if (TrackingStatus == true)
        StopTracking()
    }
    else {
      if (PermissionGranted == true && TrackingStatus == false) {
        console.log("Getting Location After Permission Granted");
        _getLocationAsync();
      }

      else if (PermissionGranted == false && TrackingStatus == true) {
        console.log("3: was tracking but permission now denied so stopping");
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
              e.nativeEvent.action === 'marker-inside-overlay-press' ||
              e.nativeEvent.action === 'callout-inside-press'
            ) {
              return;
            }

            console.log("callout pressed");
          }}
          style={styles.customView}
        ></Callout>
      </MapView>
    )
  };

  //----------------Conditions to decide what to show in the screen--------
  let screen;
  if (Err) {
    screen = (
      <View>
        <Text>{Err}</Text>
      </View>
    );
  }



  else if (TrackingStatus == false) {
    screen = (
      <View>
        <Text>Tracking Disabled</Text>
        <Button style={styles.button} onPress={() => {
          setPermissionGranted(null)
          requestPermissions()
        }}>
          <Text>Enable Tracking</Text>
        </Button>
      </View>)
  }
  else if (location.latitude === 0 && location.longitude === 0) {
    console.log('entering settimeout______________________________________', location)

    screen = (
      <View>
        <Spinner color='red' />
      </View>
    )

    setTimeout(() => {

      setlocation(currentUser.location)
    }, 500);

  }

  else if (MarkerName) {
    screen = (
      <View style={{ flex: 1, width: "100%", }}>
        <MapView
          onPoiClick={e => {
            setMarkerName(e.nativeEvent.name)
            setMarkerPosition(e.nativeEvent.coordinate)
          }}
          customMapStyle={[
            {
              featureType: "poi.medical",
              stylers: [
                {
                  visibility: "on"
                }
              ]
            },
            {
              featureType: "administrative",
              elementType: "geometry",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.attraction",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.business",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.government",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.park",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.place_of_worship",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.school",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.sports_complex",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "road",
              elementType: "labels.icon",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "transit",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            }
          ]}
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
            if (themargin === 0) setthemargin(1)
            else setthemargin(0)
          }}
          style={{ width: "100%", flex: 1, marginTop: themargin, alignSelf: 'center' }}
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
        <Button onPress={() => { 

          console.log(MarkerPosition);
          Linking.openURL('https://www.google.com/maps/dir/?api=1&destination=' + MarkerPosition.latitude + ',' + MarkerPosition.longitude) }}>
          <Text>Get Direction To {MarkerName}</Text>
        </Button>
      </View>
    );
  }

  else {
    screen = (
      <View style={{ flex: 1, width: "100%", }}>
        <MapView
          onPoiClick={e => {
            setMarkerName(e.nativeEvent.name)
            setMarkerPosition(e.nativeEvent.coordinate)
          }}
          customMapStyle={[
            {
              featureType: "poi.medical",
              stylers: [
                {
                  visibility: "on"
                }
              ]
            },
            {
              featureType: "administrative",
              elementType: "geometry",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.attraction",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.business",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.government",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.park",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.place_of_worship",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.school",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.sports_complex",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "road",
              elementType: "labels.icon",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "transit",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            }
          ]}
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
            if (themargin === 0) setthemargin(1)
            else setthemargin(0)
          }}
          style={{ width: "100%", flex: 1, marginTop: themargin, alignSelf: 'center' }}
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
//     setErr("WatchPosition Error\n" + err)
//   })
//   setWatchPositionPromise(terminationFn)

// const { status } = await Location.requestBackgroundPermissionsAsync();//Location.enableNetworkProviderAsync()//Location.requestBackgroundPermissionsAsync();
// if (status === 'granted') {
//   await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
//     accuracy: Location.Accuracy.BestForNavigation,
//     timeInterval: 3000
//   });
// }
