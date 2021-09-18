import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
} from "react-native";
import { Button, Container, Content, View } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { addNotification, sendPushNotification } from "../HomeNavigation/tabs";

//-------------------------------redux------------------------------------------
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, fetchConversations } from "../redux/actions/index";

//===============================================================================

//for editprofilescreen
import { useNavigationState } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

//for ediprofile
//  function usePreviousRouteName() {
//   return useNavigationState((state) =>
//     state.routes[state.index - 1]?.name
//       ? state.routes[state.index - 1].name
//       : "None"
//   );
// }

const HomeScreen = ({ navigation, route }) => {
  // let prevRoute = usePreviousRouteName() == "registration" ? true: false

  //-------------------------------redux------------------------------------------
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);
  let ECs;
  let message;
  useEffect(() => {
    if (currentUser) {
      ECs = currentUser.EmergencyContacts;
      message = "SOS Recieved from " + currentUser.FirstName;
    }
  }, [currentUser]);

  useLayoutEffect(() => {
    dispatch(fetchUser());
  }, []);
  //-------------------------------------------------------------------------

  const requestSOS = () => {
    navigation.navigate("EmergencyTab");

    for (var i = 0; i < ECs.length; i++) {
      addNotification(
        //put here the uids of the emergency contacts[i].uid
        ECs[i].uid,
        message,
        "RESCU",
        false,
        "SOS"
      );
      sendPushNotification(ECs[i].ExpoToken, "RESCU", message);
    }
  };

  
  const helpOthers = () =>
    navigation.navigate("EmergencyTab", { screen: "Diagnosis" });

  // useEffect(()=>{
  //   console.log("------------------------------\n",prevRoute)
  //   if(prevRoute == true)
  //    navigation.navigate("View Nearest Hospital")
  // },[route])

  return (
    <Container style={styles.container}>
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
            bordered
            onPress={() => {
              dispatch(fetchConversations());
              navigation.navigate("View Nearest Hospital");
            }}
          >
            <MaterialCommunityIcons
              name="hospital-box-outline"
              size={24}
              color="black"
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
            bordered
            onPress={() => {
              navigation.navigate("Chat");
            }}
          >
            <Icon name="call-outline" size={24} />
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
          <Button style={styles.button} bordered onPress={helpOthers}>
            <Icon name="people-outline" size={24} />
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

      {/* </View> */}
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eff2f9",
  },
  sosButton: {
    width: 350,
    height: 350,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  },
  button: {
    backgroundColor: "#fff",
    width: 100,
    height: 100,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "center",
    elevation: 3,
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
    backgroundColor: "#fcfcfc",
    marginTop: "auto",
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  buttons: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
