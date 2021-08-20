import  React, { useState, useEffect, } from "react";
import MapView from "react-native-maps";
import { StyleSheet, Text, View, Dimensions,Card, CardItem, Platform,Linking } from "react-native";
import { Left, Body, Right, Button } from "native-base";
import * as Location from 'expo-location';



export default function ViewNearestHospital() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location.coords.latitude)
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>

      {location!= null &&
            <Button  style={{width:100,height:100,justifyContent:"center", alignSelf:'center', }} onPress={()=>{Linking.openURL('https://www.google.com/maps/dir/?api=1&origin='+location.coords.latitude+',%20'+location.coords.longitude+'&destination=fisherman%27s%20wharf%3E')}}  ><Text>shet</Text></Button>
      }
      {/* <MapView 
      style={{width:"100%", height:"100%"}}
      initialRegion= {{ latitude: location.coords.latitude,
      longitude: location.coords.longitude, latitudeDelta:0.009, longitudeDelta:0.009}}
      >
        <MapView.Marker
            coordinate={{latitude: location.coords.latitude,
            longitude: location.coords.longitude}}
            title={"title"}
            description={"description"}/>
        </MapView>
       */}

      
    </View>
  );
  
// THIS IS THE MAIN VERSION OF THE PAGE
  // return (
  //   <View>
  //         <MapView style={styles.map}
  //         initialRegion={{
  //             latitude: 30.0930721,
  //             longitude: 31.3298159,
  //             latitudeDelta: 0.0,
  //             longitudeDelta: 0.0,
  //         }}
  //         mapType={"standard"}
  //       >
  //       <MapView.Marker
  //           coordinate={{latitude: 30.0930721,
  //           longitude: 31.3298159}}
  //           title={"title"}
  //           description={"description"}
  //        />
  //     </MapView>
  //       <View style={{flexDirection:'row', justifyContent: 'space-evenly', marginTop:10,}}>
  //         <Left>
  //       <Text style={{fontSize: 18, color:"#777777", marginLeft:15}}>Nearest Hospital:{"\n"}<Text style={{fontSize: 18, color:"#777777", fontWeight:"bold"}}>5 Mins Away</Text></Text>
  //       </Left>
  //       <Body>
  //       <Text style={{fontSize: 18, color:"#777777", marginLeft:15}}>Location:{"\n"}<Text style={{fontSize: 18, color:"#777777", fontWeight:"bold"}}>Masr El Gedida</Text></Text>
  //       </Body>
  //       <Right>
  //       <Text style={{fontSize: 18, color:"#777777", marginLeft:15}}>Name:{"\n"}<Text style={{fontSize: 18, color:"#777777", fontWeight:"bold"}}>Cleopatra Hospital</Text></Text>
  //       </Right>
  //     </View>
  //     </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2,
  },
});
