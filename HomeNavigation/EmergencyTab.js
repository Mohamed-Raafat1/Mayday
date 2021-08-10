import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Container, Header, TabHeading, Icon, Text, View, ScrollableTab } from "native-base";
import DoctorsScreen from "../Screens/DoctorsScreen";
import ChatListStackScreen from "../Screens/ChatList";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
import CurrentReport from "../Screens/CurrentReport";
import DiagnosisScreen from "../Screens/DiagnosisScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const Tab = createMaterialTopTabNavigator();
export default function EmergencyTab() {
  return (
    <Tab.Navigator
      lazy={true}
      swipeEnabled={true}
      renderTabBar={()=> <ScrollableTab />}
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
      <Tab.Screen
        options={{ tabBarLabel: "Nearby Hospitals" }}
        name="View Nearest Hospital"
        component={ViewNearestHospital}
      />
      <Tab.Screen
        options={{ tabBarLabel: "Diagnosis" }}
        name="Diagnosis"
        component={DiagnosisScreen}
      />
      
       
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
