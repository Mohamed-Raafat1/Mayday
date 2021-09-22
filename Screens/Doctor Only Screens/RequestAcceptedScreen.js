import React, { useState, useEffect } from "react";
import { Button, Text, View } from "react-native";
import firebase from "firebase";
import { Spinner } from "native-base";
import MapView, { Marker } from "react-native-maps";
import { Dimensions } from "react-native";
import { fetchUser } from "../../redux/actions";
import { Polyline } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
function RequestAcceptedScreen({ route, navigation }) {
  const [location, setlocation] = useState({
    longitude: 0,
    latitude: 0,
  });
  const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.02; //This controls default zoom
  const LONGITUDE_DELTA = LATITUDE_DELTA * (WIDTH / HEIGHT);
  const [themargin, setthemargin] = useState(0);
  const [count, setcount] = useState(0); //this is just for a workaround to mapview issue
  const [CurrentRequest, setCurrentRequest] = useState(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);
  useEffect(() => {
    firebase
      .firestore()
      .collection("requests")
      .doc(route.params.requestid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          let data = snapshot.data();
          let id = snapshot.id;
          setCurrentRequest({ id, ...data });
        }
      });
    dispatch(fetchUser());
    return () => {};
  }, [route]);
  let screen;
  if (
    (location.latitude === 0 && location.longitude === 0) ||
    CurrentRequest == null
  ) {
    screen = (
      <View>
        <Spinner color="red" />
      </View>
    );
    console.log("in settimeout now");
    setTimeout(() => {
      setlocation(currentUser.location);
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
          // showsMyLocationButton={true}s
          showsPointsOfInterest={true}
          loadingEnabled={true}
          loadingIndicatorColor="red"
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
              latitude: CurrentRequest.coordinates.latitude,
              longitude: CurrentRequest.coordinates.longitude,
            }}
            title={CurrentRequest.PatientFirstName}
            description={CurrentRequest.PatientFirstName}
          ></Marker>
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
        {/* <Button
            style={[styles.button, { alignSelf: "center" }]}
            onPress={() => {
              console.log("------------------pressed-------------");
              //       // await terminationFn.remove()
              //       // fcn()
              StopTracking();
              setPermissionGranted(null);
            }}
          >
            <Text>Stop Tracking</Text>
          </Button> */}
      </View>
    );
  }
  if (!CurrentRequest)
    return (
      <View>
        <Text> done</Text>
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
