import React, { useState, useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import firebase from "firebase";
import { Spinner, Button } from "native-base";
import MapView, { Marker } from "react-native-maps";
import { Dimensions } from "react-native";
import {
  fetchRequest,
  fetchUser,
  fetchAcceptedRequest,
} from "../../redux/actions";
import { Polyline } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Alert } from "react-native";

function RequestAcceptedScreen({ route, navigation }) {
  const [text, setText] = React.useState("");
  const hasUnsavedChanges = true;

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!hasUnsavedChanges) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          "Discard changes?",
          "You have unsaved changes. Are you sure to discard them and leave the screen?",
          [
            { text: "Don't leave", style: "cancel", onPress: () => {} },
            {
              text: "Discard",
              style: "destructive",
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation, hasUnsavedChanges]
  );
  const [location, setlocation] = useState({
    longitude: 0,
    latitude: 0,
  });

  const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.02; //This controls default zoom
  const LONGITUDE_DELTA = LATITUDE_DELTA * (WIDTH / HEIGHT);
  const [themargin, setthemargin] = useState(0);

  const dispatch = useDispatch();
  const currentAcceptedRequest = useSelector(
    (state) => state.userState.AcceptedRequest
  );
  const currentUser = useSelector((state) => state.userState.currentUser);
  console.log("--------------------------------", currentAcceptedRequest);

  //custom map style to simplify
  let customstyle = [
    {
      featureType: "poi.medical",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.attraction",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "poi.business",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.government",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.park",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.place_of_worship",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.school",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.sports_complex",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ];
  const gotoChat = (uid, chatid) => {
    navigation.navigate("DoctorChat", {
      userid: uid,
      chatid: chatid,
    });
  };
  useEffect(() => {
    dispatch(fetchUser());
    return () => {};
  }, [route]);
  let screen;
  if (
    (location.latitude === 0 && location.longitude === 0) ||
    currentAcceptedRequest == null
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
          customMapStyle={customstyle}
          provider="google"
          showsUserLocation={true}
          userLocationUpdateInterval={5000}
          followsUserLocation={true}
          showsCompass={true}
          showsMyLocationButton={true}
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
              latitude: currentAcceptedRequest.coordinates.latitude,
              longitude: currentAcceptedRequest.coordinates.longitude,
            }}
            title={currentAcceptedRequest.PatientFirstName}
            description={currentAcceptedRequest.PatientFirstName}
          >
            <Image
              source={require("../../assets/PatientMarker.png")}
              style={{ height: 35, width: 35 }}
            ></Image>
          </Marker>
        </MapView>
        <TouchableOpacity
          onPress={() => {
            gotoChat(
              currentAcceptedRequest.PatientID,
              currentAcceptedRequest.chatid
            );
          }}
          style={{
            borderColor: "black",
            borderWidth: 1,
            borderRadius: 5,
            padding: 5,
            position: "absolute",
            top: 70,
            right: 13,
            backgroundColor: "rgba(225, 225, 225, 0.8)",
          }}
        >
          <MaterialCommunityIcons
            name="message-text-outline"
            size={24}
            color="red"
          />
        </TouchableOpacity>
      </View>
    );
  }
  if (!currentAcceptedRequest)
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
