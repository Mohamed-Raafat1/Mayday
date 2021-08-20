import React, { useState, useEffect, useLayoutEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import MapView from "react-native-maps";
import { StyleSheet, Text, View, Dimensions, Card, CardItem, Platform, Linking } from "react-native";
import { Left, Body, Right, Button } from "native-base";
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions";



export default function ViewNearestHospital({ navigation, route }) {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(fetchUser());
  }, [route]);

  const updateLocation = (location) => {
    firebase.firestore().collection("users")
      .doc(currentUser.uid)
      .update({
        loc: location
      })
      .catch((error) => {
        Toast.show({
          text: error.message,
          duration: 2000,
        })
        console.log(error);
      });

  };
  const currentUser = useSelector((state) => state.userState.currentUser);
  if (currentUser == undefined) return <View></View>;

  const LOCATION_TASK_NAME = 'background-location-task';
  const [Locations, setLocations] = useState(null);

  const requestPermissions = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 3000
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      requestPermissions()

      return () => {
        PauseLocation()
      };
    }, [])
  );

  useEffect(() => {

    if (Locations) {
      let intLat = Number(Locations.locations[0].coords.latitude)
      let intLong = Number(Locations.locations[0].coords.longitude)
      let location = new firebase.firestore.GeoPoint(intLat, intLong);
      updateLocation(location);
    }
  }, [Locations])





  const PauseLocation = () => {
    Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }

  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      setLocations(data);
    }
  });

  return (
    <View >

      {Locations &&
        <MapView
          style={{ width: "100%", height: "70%" }}
          initialRegion={{
            latitude: currentUser.loc.latitude,
            longitude: currentUser.loc.longitude, 
            latitudeDelta: 0.009, 
            longitudeDelta: 0.009
          }}
        >
          <MapView.Marker
            coordinate={{
              latitude: currentUser.loc.latitude,
              longitude: currentUser.loc.longitude
            }}
            title={"title"}
            description={"description"} />
        </MapView>
      }




    </View>



  )
}



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
