import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  TouchableWithoutFeedbackBase,
  Dimensions,
} from "react-native";
import { Button, Container, Content, View } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
import LottieView from "lottie-react-native";

import Icon from "react-native-vector-icons/Ionicons";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import { fetchConversations } from "../redux/actions";

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




const HomeScreen = ({ navigation, route })=> {
  // let prevRoute = usePreviousRouteName() == "registration" ? true: false 

  const requestSOS = () => navigation.navigate("EmergencyTab");
  const helpOthers = () =>
    navigation.navigate("EmergencyTab", { screen: "Diagnosis" });

  const dispatch = useDispatch();

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
}

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
