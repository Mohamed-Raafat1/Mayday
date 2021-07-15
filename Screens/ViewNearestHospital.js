import * as React from "react";
import MapView from "react-native-maps";
import { StyleSheet, Text, View, Dimensions,Card, CardItem } from "react-native";
import { Left, Body, Right } from "native-base";

export default function ViewNearestHospital() {
  return (
    <View>
          <MapView style={styles.map}
          initialRegion={{
              latitude: 30.0930721,
              longitude: 31.3298159,
              latitudeDelta: 0.0,
              longitudeDelta: 0.0,
          }}
          mapType={"standard"}
        >
        <MapView.Marker
            coordinate={{latitude: 30.0930721,
            longitude: 31.3298159}}
            title={"title"}
            description={"description"}
         />
      </MapView>
        <View style={{flexDirection:'row', justifyContent: 'space-evenly', marginTop:10,}}>
          <Left>
        <Text style={{fontSize: 18, color:"#777777", marginLeft:15}}>Nearest Hospital:{"\n"}<Text style={{fontSize: 18, color:"#777777", fontWeight:"bold"}}>5 Mins Away</Text></Text>
        </Left>
        <Body>
        <Text style={{fontSize: 18, color:"#777777", marginLeft:15}}>Location:{"\n"}<Text style={{fontSize: 18, color:"#777777", fontWeight:"bold"}}>Masr El Gedida</Text></Text>
        </Body>
        <Right>
        <Text style={{fontSize: 18, color:"#777777", marginLeft:15}}>Name:{"\n"}<Text style={{fontSize: 18, color:"#777777", fontWeight:"bold"}}>Cleopatra Hospital</Text></Text>
        </Right>
      </View>
      </View>
  );
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
