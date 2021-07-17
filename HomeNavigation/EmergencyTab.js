import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Tab, Tabs, TabHeading, Icon, Text, View } from 'native-base';
import DoctorsScreen from '../Screens/DoctorsScreen';
import ChatListStackScreen from "../Screens/ChatList";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
export default function EmergencyTab () {

    return (
      <Container style={{flex:1,height:"10%", marginTop:0}}>
        <Tabs>
          <Tab   tabStyle={{backgroundColor:"white"}} activeTabStyle={{backgroundColor: "#cf5b72" }} textStyle={{color:"#cf5b72"}} activeTextStyle={{color: "white", fontWeight: 'bold'}} heading = "Request Doctor">
            <DoctorsScreen />
          </Tab>
          <Tab  tabStyle={{backgroundColor:"white"}} activeTabStyle={{backgroundColor: "#cf5b72" }} textStyle={{color:"#cf5b72"}} activeTextStyle={{color: "white", fontWeight: 'bold'}} heading= "Chat">
            <ChatListStackScreen />
          </Tab>
          <Tab tabStyle={{backgroundColor:"white"}} activeTabStyle={{backgroundColor: "#cf5b72" }} textStyle={{color:"#cf5b72"}} activeTextStyle={{color: "white", fontWeight: 'bold'}} heading="Nearest Hospital">
            <ViewNearestHospital />
          </Tab>
        </Tabs>
      </Container>
    );
    }

    const styles = StyleSheet.create({

      });
      
