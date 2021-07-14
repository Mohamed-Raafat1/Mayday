//BUTTONS NATIVE BASE

import React from "react";
//React Native
import { StyleSheet, Image } from "react-native";
import { Avatar, Badge, withBadge } from "react-native-elements";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Screens
import HomeScreen from "../Screens/HomeScreen";
import DoctorsScreen from "../Screens/DoctorsScreen";
import MedicalIdScreen from "../Screens/MedicalIdScreen";
import editProfileScreen from "../Screens/editProfileScreen";
import FirstAidSection from "../Screens/FirstAidSection";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
import {
  Button,
  Icon,
  Text,
  Container,
  Content,
  Right,
  View,
  Row,
} from "native-base";
import ChatList from "../Screens/ChatList";
import Notifications from "../Screens/Notifications";
import Chat from "../Screens/Chat";

//Stacks Navigation
import Hypothermia from "../Screens/Hypothermia";
import Meningitis from "../Screens/Meningitis";
import Poisoning from "../Screens/Poisoning";

const HomeStack = createStackNavigator();
const FirstAidStack = createStackNavigator();
const ChatListStack = createStackNavigator();


//Tab Navigation
const Tab = createMaterialBottomTabNavigator();

function Tabs() {
  //2 Tabs Home , First Aid
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#cf5b72"
      barStyle={{ backgroundColor: "white" }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="First Aid"
        component={FirstAidStackScreen}
        options={{
          tabBarLabel: "First Aid",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="television-play"
              color={color}
              size={26}
            />
          ),
        }}
      />
      {/* <Tab.Screen
            name="Doctors"
            component={DoctorsStackScreen}
            options={{
              tabBarLabel: 'Doctors',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="doctor" color={color} size={26} />
              ),
            }}
          /> */}
      {/* <Tab.Screen
            name="More"
            component={MoreStackScreen}
            options={{
              tabBarLabel: 'More',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="menu" color={color} size={26} />
              ),
            }}
          /> */}
    </Tab.Navigator>
  );
}

//
const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerLeft: () => (
          <Content style={styles.iconStyle}>
            <Button transparent>
              <MaterialCommunityIcons
                name="menu"
                size={26}
                onPress={() => navigation.openDrawer()}
              />
            </Button>
          </Content>
        ),
        title: "Appname",
        headerRight: () => (
          <View style={{ flexDirection: "row" }}>
            <Button transparent>
              <Badge
                badgeStyle={{}}
                value="3"
                status="primary"
                containerStyle={{ position: "absolute", top: -4, right: -4 }}
              />
              <MaterialCommunityIcons
                name="message-text-outline"
                size={24}
                color="black"
                onPress={() => navigation.navigate("ChatList")}
                style={styles.icon}
              />
            </Button>
            <Button transparent>
              <Badge
                badgeStyle={{}}
                value="4"
                status="primary"
                containerStyle={{ position: "absolute", top: -4, right: -4 }}
              />
              <MaterialCommunityIcons
                name="bell-outline"
                size={26}
                onPress={() => navigation.navigate("Notifications")}
                style={styles.icon}
              />
            </Button>

            <Button transparent>
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={26}
                onPress={() => navigation.navigate("Medical ID")}
                style={styles.icon}
              />
            </Button>
          </View>
        ),
      }}
    />
    <HomeStack.Screen
      name="Medical ID"
      component={MedicalIdScreen}
      options={{
        title: "Medical ID",
        headerRight: () => (
          <Content style={styles.iconStyle}>
            <Button transparent>
              <MaterialCommunityIcons
                name="account-edit-outline"
                size={30}
                onPress={() => navigation.navigate("editProfile")}
              />
            </Button>
          </Content>
        ),
      }}
    />
    <HomeStack.Screen
      name="editProfile"
      style={styles.icon}
      component={editProfileScreen}
      options={{
        title: "Edit Profile",
      }}
    />
    <HomeStack.Screen
      name="ChatList"
      style={styles.icon}
      component={ChatListStackScreen}
      options={{
        headerShown: false,
        title: "Chats",
      }}
    />
    <HomeStack.Screen
      name="Notifications"
      style={styles.icon}
      component={Notifications}
      options={{
        title: "Notifications",
      }}
    />
  </HomeStack.Navigator>
);

// Navigate ChatList --> each Chat.js dynamically (soon)
const ChatListStackScreen = () => (
  <ChatListStack.Navigator>
    <ChatListStack.Screen
      name="ChatList"
      component={ChatList}
      options={{ title: "Chats" }}
    />
    <ChatListStack.Screen
      name="Chat"
      component={Chat}
      options={{ title: "Chat" }}
    />
  </ChatListStack.Navigator>
);



const FirstAidStackScreen = ({ navigation }) => (
  <FirstAidStack.Navigator>
    <FirstAidStack.Screen
      name="FirstAid"
      component={FirstAidSection}
      options={{
        title: "First-Aid",
        headerLeft: null,
      }}
    />
    <FirstAidStack.Screen
      name="Hypothermia"
      component={Hypothermia}
      options={{
        title: "Hypothermia",
      }}
    />
    <FirstAidStack.Screen
      name="Meningitis"
      component={Meningitis}
      options={{
        title: "Meningitis",
      }}
    />
    <FirstAidStack.Screen
      name="Poisoning"
      component={Poisoning}
      options={{
        title: "Poisoning",
      }}
    />
  </FirstAidStack.Navigator>
);

export default Tabs;

const styles = StyleSheet.create({
  iconStyle: {
    alignContent: "center",
    marginLeft: 10,
    marginTop: 5,
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  Item: {
    marginBottom: 10,
  },
});
