import React, { useEffect, useLayoutEffect, useState } from "react";

import {
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Switch,
} from "react-native";
import { Button, Container, Toast, View } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import Icon from "react-native-vector-icons/Ionicons";
import {
  addNotification,
  sendPushNotification,
} from "../Components/functions/functions";
import * as geofirestore from "geofirestore";

import firebase from "firebase";

//redux imports
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, fetchConversations } from "../redux/actions/index";
import { getExpoTokenById } from "../Components/functions/functions";

const HomeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);
  const currentAcceptedRequest = useSelector(
    (state) => state.userState.AcceptedRequest
  );

  let ECs;
  let message;
  let messageNearby;
  let NUs;
  let users = [];
  const isEnabled = useSelector(
    (state) => state.userState.doctorAvailable //7ot hena el doctor avaialae
  );

  const toggleSwitch = async (value) => {
    console.log(value);

    await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .update({ doctorAvailable: value });
    if (isEnabled === true) {
      Toast.show({
        text: "You are currently not available to accept Requests",
        position: "bottom",
      });
    }
    if (isEnabled === false) {
      Toast.show({
        text: "You are currently available to accept Requests",
        position: "bottom",
      });
    }
  };

  //for unsubscribing to conversations
  let UnsubscribeConversations = () => {};

  useEffect(() => {
    if (currentUser) {
      ECs = currentUser.EmergencyContacts;

      getNearBySOSUsers().then((result) => {
        NUs = result;
      });
      message = "🆘 " + currentUser.FirstName + " is sending you for help";
      messageNearby =
        "🆘 " +
        currentUser.FirstName +
        " is Nearby you,Please help him if possible";
    }
  }, [currentUser]);

  useLayoutEffect(() => {
    const UnsubscribeUser = dispatch(fetchUser());

    return () => {
      UnsubscribeUser();
      UnsubscribeConversations();
    };
  }, []);
  //------------------------------getting nearby Users-------------------------------------------
  const getNearBySOSUsers = async () => {
    const Geofirestore = geofirestore.initializeApp(firebase.firestore());
    await Geofirestore.collection("users")
      .near({
        center: new firebase.firestore.GeoPoint(
          currentUser.coordinates.latitude,
          currentUser.coordinates.longitude
        ),
        radius: 5,
      })
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

    users = users.filter((user) => user.id != currentUser.uid);
    return users;
  };
  // THE BIG RED BUTTON
  const requestSOS = () => {
    navigation.navigate("EmergencyTab");
    // Sending SOS notificition to Emergency Contacts
    if (ECs)
      for (var i = 0; i < ECs.length; i++) {
        addNotification(
          ECs[i].uid,
          message,
          "🚨RESCU",
          false,
          "SOS",
          currentUser.uid,
          currentUser.PhotoURI
        );
        // to get the latest ExpoTokens of the Emergency contacts
        getExpoTokenById(ECs[i].uid).then((result) => {
          sendPushNotification(result, "🚨RESCU", message, "SOS");
        });
      }
    if (NUs)
      // Sending SOS notificition to Nearby Users
      for (var i = 0; i < NUs.length; i++) {
        addNotification(
          NUs[i].uid,
          messageNearby,
          "🚨RESCU",
          false,
          "SOS",
          currentUser.uid,
          currentUser.PhotoURI
        );
        sendPushNotification(NUs[i].ExpoToken, "🚨RESCU", messageNearby, "SOS");
      }
  };

  const helpOthers = () =>
    navigation.navigate("EmergencyTab", { screen: "Diagnosis" });

  return (
    <Container style={styles.container}>
      {currentUser && currentUser.medicalProfessional && (
        <Button
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            right: 0,
            top: 15,
            padding: 0,
            position: "absolute",
            alignItems: "center",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: 30,
            borderBottomLeftRadius: 30,
            borderRightWidth: 0,
            borderColor: "white",
            borderWidth: 1,
            backgroundColor: "white",
            paddingTop: 15,
            padding: 10,
            paddingLeft: 10,
            elevation: 7,
          }}
        >
          <Switch
            style={{
              paddingTop: 3,
              transform: [{ scale: 1.2 }],
            }}
            trackColor={{ false: "#C9CCD5", true: "#C9CCD5" }}
            thumbColor={isEnabled ? "#46B3E6" : "#FF5C58"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />

          {isEnabled ? (
            <Text
              style={{
                paddingLeft: 10,
                paddingBottom: 10,
                fontWeight: "bold",
                marginTop: -3,
              }}
            >
              Available
            </Text>
          ) : (
            <Text
              style={{
                paddingLeft: 10,
                paddingBottom: 10,
                fontWeight: "bold",
                marginTop: -3,
              }}
            >
              {" "}
              Unavailable
            </Text>
          )}
        </Button>
      )}
      <View style={styles.sosButton}>
        <TouchableWithoutFeedback onPress={requestSOS}>
          <LottieView
            source={require("../assets/sos-button-triggered.json")}
            autoPlay
            loop
          />
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.buttons}>
          <Button
            style={styles.button}
            onPress={() => {
              UnsubscribeConversations = dispatch(fetchConversations());
              navigation.navigate("View Nearest Hospital");
            }}
          >
            <MaterialCommunityIcons
              name="hospital-box-outline"
              size={24}
              color="#FF5C58"
            />
            <Text
              style={{
                color: "black",
                paddingLeft: 10,
                paddingRight: 10,
                textAlign: "center",
              }}
            >
              Nearest Hospital
            </Text>
          </Button>
          <Button
            style={styles.button}
            onPress={() => {
              navigation.navigate("Chat");
            }}
          >
            <Icon name="call-outline" color="#50CB93" size={24} />
            <Text
              style={{
                color: "black",
                paddingLeft: 10,
                paddingRight: 10,
                textAlign: "center",
              }}
            >
              Contact Doctor
            </Text>
          </Button>

          <Button style={styles.button} onPress={helpOthers}>
            <Icon name="people-outline" color="#F9D5A7" size={24} />
            <Text
              style={{
                color: "black",
                paddingLeft: 10,
                paddingRight: 10,
                textAlign: "center",
              }}
            >
              Help Others
            </Text>
          </Button>
        </View>
      </View>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  sosButton: {
    width: "80%",
    height: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "13%",
    marginBottom: "auto",
  },
  button: {
    backgroundColor: "white",
    width: "30%",
    height: "90%",
    paddingHorizontal: 10,

    borderRadius: 30,
    flexDirection: "column",
    justifyContent: "center",
    elevation: 7,
  },

  actionButton: {
    margin: 100,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
  },

  triggerButton: {
    alignItems: "center",
    alignSelf: "center",
    shadowRadius: 4,
    shadowOpacity: 1,
    borderRadius: 40,
    borderBottomColor: 12,
    width: 70,
    height: 70,
  },
  bottomSheet: {
    width: "100%",
    height: "25%",
    backgroundColor: "rgba(0,0,0,0)",
    marginTop: 0,
    marginBottom: "0%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  buttons: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
