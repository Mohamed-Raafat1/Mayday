//BUTTONS NATIVE BASE

import React from "react";
//React Native
import { StyleSheet, Image, StatusBar } from "react-native";
import { Avatar, Badge, withBadge } from "react-native-elements";
import { createStackNavigator,CardStyleInterpolators   } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EmergencyTab from "./EmergencyTab";
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Screens
import HomeScreen from "../Screens/HomeScreen";
import DoctorsScreen from "../Screens/DoctorsScreen";
import MedicalIdScreen from "../Screens/MedicalIdScreen";
import EditProfileScreen from "../Screens/editProfileScreen";
import FirstAidSection from "../Screens/FirstAidSection";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
import {
  Button,
  Icon,
  Header,
  Item,
  Input,
  Text,
  Container,
  Content,
  Right,
  View,
  Row,
} from "native-base";
import ChatListStackScreen from "../Screens/ChatList";
import Notifications from "../Screens/Notifications";
import Chat from "../Screens/Chat";

//Stacks Navigation
//First-Aid Screens
import Hypothermia from "../First-Aid Screens/Hypothermia";
import Meningitis from "../First-Aid Screens/Meningitis";
import Poisoning from "../First-Aid Screens/Poisoning";
import Seizure from "../First-Aid Screens/Seizure";

import DiagnosisScreen from "../Screens/DiagnosisScreen";
import CurrentReport from "../Screens/CurrentReport";
import DoctorRequests from "../Screens/Doctor Only Screens/DoctorRequests";

const HomeStack = createStackNavigator();
const FirstAidStack = createStackNavigator();
const DoctorRequestsStack = createStackNavigator();

//Tab Navigation
const Tab = createMaterialBottomTabNavigator();
// const EmergencyTab = createMaterialTopTabNavigator();

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
      <Tab.Screen
        name="DoctorRequests"
        component={DoctorRequestsStackScreen}
        options={{
          tabBarLabel: "Requests",
          tabBarIcon: ({ color }) => (
            <Button transparent>
              <Badge
                badgeStyle={{}}
                value="3"
                status="primary"
                containerStyle={{ position: "absolute", top: -5, right: -5 }}
              />
              <MaterialCommunityIcons
                name="medical-bag"
                size={24}
                color={color}
                style={{ marginBottom: 10 }}
              />
            </Button>
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

// function EmergencyTab (){
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="RequestDoctor" component={DoctorsScreen} />
//       <Tab.Screen name="ChatList" component={ChatList} />
//       <Tab.Screen name="View Nearest Hospital" component={ViewNearestHospital}/>
//     </Tab.Navigator>
//   );
// }

//
const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator detachInactiveScreens={true} headerMode={"float"}>
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
        title: "Rescu",
        headerRight: () => (
          <View style={{ flexDirection: "row" }}>
            <Button transparent>
              <Badge
                badgeStyle={{}}
                value="3"
                status="primary"
                containerStyle={{ position: "absolute", top: -2, right: -2 }}
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
                containerStyle={{ position: "absolute", top: -2, right: -2 }}
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
            <Button
              transparent
              onPress={() => navigation.navigate("EditProfile")}
            >
              {/* <MaterialCommunityIcons
                name="account-edit-outline"
                size={30}
                onPress={() => navigation.navigate("EditProfile")}
              /> */}
              <Text>Edit</Text>
            </Button>
          </Content>
        ),
      }}
    />

    <HomeStack.Screen
      name="RequestDoctor"
      component={DoctorsScreen}
      options={{
        title: "Request Doctor",
      }}
    />

    <HomeStack.Screen
      name="EmergencyTab"
      component={EmergencyTab}
      options={{}}
    />

    <HomeStack.Screen
      name="EditProfile"
      style={styles.icon}
      component={EditProfileScreen}
      options={{
        headerRight: () => (
          <Content style={styles.iconStyle}>
            <Button
              transparent
              onPress={() => navigation.navigate("Medical ID")}
            >
              <Text>Save</Text>
            </Button>
          </Content>
        ),
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
      name="Chat"
      style={styles.icon}
      component={Chat}
      options={{
        headerShown: false,
        title: "Chat",
      }}
    />
    <HomeStack.Screen
      name="DiagnosisScreen"
      style={styles.icon}
      component={DiagnosisScreen}
      options={{
        headerRight: () => (
          <Content style={styles.iconStyle}>
            <Button
              transparent
              onPress={() => navigation.navigate("CurrentReport")}
            >
              <Text>Skip</Text>
            </Button>
          </Content>
        ),
        title: "Diagnosis",
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
    <HomeStack.Screen
      name="CurrentReport"
      style={styles.icon}
      component={CurrentReport}
      options={{
        title: "Current Report",
      }}
    />
  </HomeStack.Navigator>
);

// Navigate ChatList --> each Chat.js dynamically (soon)

//Navigate in Doctor Requests --> Each Request Dynamically(Soon)

const DoctorRequestsStackScreen = () => (
  <DoctorRequestsStack.Navigator>
    <DoctorRequestsStack.Screen
      name="DoctorRequests"
      component={DoctorRequests}
      options={{ title: "Requests" }}
    />
    <DoctorRequestsStack.Screen
      name="DoctorChat"
      component={Chat}
      options={{ title: "Chat" }}
    />
  </DoctorRequestsStack.Navigator>
);

const FirstAidStackScreen = ({ navigation }) => (
  <FirstAidStack.Navigator mode="modal"
  screenOptions={{
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
  }}>
    <FirstAidStack.Screen
      name="FirstAid"
      component={FirstAidSection}
      options={{
        header:()=>(
          
          <Header searchBar rounded style={{backgroundColor:'white'}}>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
         
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
        ),
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
    <FirstAidStack.Screen
      name="Seizure"
      component={Seizure}
      options={{
        title: "Seizure",
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
