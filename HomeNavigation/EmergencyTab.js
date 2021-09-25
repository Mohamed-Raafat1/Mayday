import React, { Component, useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Container, Header, TabHeading, Icon, Text, View, ScrollableTab, Button } from "native-base";
import DoctorsScreen from "../Screens/DoctorsScreen";
import ChatListStackScreen from "../Screens/ChatList";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
import CurrentReport from "../Screens/CurrentReport";
import DiagnosisScreen from "../Screens/DiagnosisScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, fetchRequest, CancelCurrentRequest } from "../redux/actions";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Geofirestore } from "../App";
const geofire = require("geofire-common");
let Requestid = null;

const Tab = createMaterialTopTabNavigator();


////////////////////////////  MAIN COMPONENT   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export default function EmergencyTab({ navigation }) {


  //=============================CONSTANTS=========================================================


  //--------for preventing the back button

  const hasUnsavedChanges = true;
  //------------------------------------


  const currentRequest = useSelector(
    (state) => state.requestState.currentRequest
  );
  // console.log("this is the current request", currentUser.uid, currentRequest);
  const dispatch = useDispatch();

  //====================================================================================================




  //========================Functions==========================



  //=====================================  USE EFFECTS  ========================================

  //-------------Done on mount
  useLayoutEffect(() => {
    const Unsubscribe = dispatch(fetchUser());

    return () => {
      Unsubscribe()
    };
  }, []);


  //----------------------------------------warning before going back----------------------------
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
          "Cancel SOS?",
          "If you go back the SOS request will be cancelled. Are you sure you want to go back?",
          [
            { text: "Don't leave", style: "cancel", onPress: () => { } },
            {
              text: "Cancel SOS",
              style: "destructive",
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: async () => {
                dispatch(CancelCurrentRequest())
                await TaskManager.unregisterAllTasksAsync()
                navigation.dispatch(e.data.action)
              },
            },
          ]
        );
      }),
    [navigation, hasUnsavedChanges]
  );






  return (
    <Tab.Navigator
      lazy={true}
      swipeEnabled={true}
      renderTabBar={() => <ScrollableTab />}
      tabBarOptions={{
        inactiveTintColor: "grey",
        activeTintColor: "#cf5b72",
        pressColor: "grey",
        indicatorStyle: {
          backgroundColor: "white",
        },
      }}
      style={{ backgroundColor: "red" }}
    >

      <Tab.Screen
        options={{ tabBarLabel: "Nearby Hospitals" }}
        name="View Nearest Hospital"
        component={ViewNearestHospital}
      />
      <Tab.Screen
        options={{ tabBarLabel: "Request Doctor" }}
        name="RequestDoctor"
        component={DoctorsScreen}
      />

      {//removed chatlist screen for now
      /* <Tab.Screen
        options={{ tabBarLabel: "Chats" }}
        name="ChatList"
        component={ChatListStackScreen}
      /> */}

      {/* <Tab.Screen
        options={{ tabBarLabel: "Diagnosis" }}
        name="Diagnosis"
        component={DiagnosisScreen}
      /> */}

      {/*checking if request was sent*/}
      {currentRequest && <Tab.Screen
        options={{ tabBarLabel: "Current Report" }}
        name="Current report"
        component={CurrentReport}
      />}



    </Tab.Navigator>
    // <Container style={{flex:1,height:"10%", marginTop:0}}>
    //   <Tabs>
    //     <Tab   tabStyle={{backgroundColor:"white"}} activeTabStyle={{backgroundColor: "#cf5b72" }} textStyle={{color:"#cf5b72"}} activeTextStyle={{color: "white", fontWeight: 'bold'}} heading = "Request Doctor">
    //       <DoctorsScreen />
    //     </Tab>
    //     <Tab  tabStyle={{backgroundColor:"white"}} activeTabStyle={{backgroundColor: "#cf5b72" }} textStyle={{color:"#cf5b72"}} activeTextStyle={{color: "white", fontWeight: 'bold'}} heading= "Chat">
    //       <ChatListStackScreen />
    //     </Tab>
    //     <Tab tabStyle={{backgroundColor:"white"}} activeTabStyle={{backgroundColor: "#cf5b72" }} textStyle={{color:"#cf5b72"}} activeTextStyle={{color: "white", fontWeight: 'bold'}} heading="Nearest Hospital">
    //       <ViewNearestHospital />
    //     </Tab>
    //   </Tabs>
    // </Container>
  );
}







const styles = StyleSheet.create({});
