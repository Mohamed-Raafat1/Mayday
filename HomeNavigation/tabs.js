//BUTTONS NATIVE BASE

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//-----------------------Push Notifications------------------------------------
import * as Notifications from "expo-notifications";
import firebase from "firebase";
import { Button, Content, Text, View } from "native-base";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Badge } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, fetchUser } from "../redux/actions/index";
import Chat from "../Screens/Chat";
import ChatListStackScreen from "../Screens/ChatList";
import CurrentReport from "../Screens/CurrentReport";
import DiagnosisScreen from "../Screens/DiagnosisScreen";
import DoctorRequests from "../Screens/Doctor Only Screens/DoctorRequests";
import RequestAcceptedScreen from "../Screens/Doctor Only Screens/RequestAcceptedScreen";
import DoctorsScreen from "../Screens/DoctorsScreen";
import EditProfileScreen from "../Screens/EditProfileScreen";
import FirstAidSection from "../Screens/FirstAidSection";

// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// Screens
import HomeScreen from "../Screens/HomeScreen";
import MedicalIdScreen from "../Screens/MedicalIdScreen";
import NotificationScreen from "../Screens/NotificationScreen";
import EmergencyTab from "./EmergencyTab";
import {
  addNotification,
  sendPushNotification,
} from "../Components/functions/functions";
import Notif2location from "../Screens/Notif2location";

// Function to send notifications given token and message
//----------------------------setting Notifications to delivered--------------------------
function setNotificationDelivered(id) {
  firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("Notifications")
    .doc(id)
    .update({
      delivered: true,
    });
}

//===================================================================================//
//SOUND is only available through IOS /ANDROID --> NO SOUND
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
//=============================================================================

//--------------------------DailyTips Notifications-----------------------------
export async function DailyTipsAlert() {
  console.log("Alert Entered");
  Alert.alert(
    "🚨RESCU-Daily Tips",
    "Daily Tips helps you rescue yourself or others in difficult times.\n\nWould you like us to send you Daily Tips?",
    [
      {
        text: "Yes",
        onPress: async () => {
          console.log("Yes Pressed");
          await enableDailyTips();
          await schedulePushNotification();
        },
      },
      {
        text: "No",
        onPress: () => {
          console.log("No Pressed");
          disableDailyTips();
        },
        style: "cancel",
      },
    ],
    { cancelable: false }
  );
}
//Schedule message
// we may use a timout or set interval in which we change the content of the body
// and put the schedulePushNotification() in a for loop with a parameter of the changing body
// we may never use the schedulepushnotification and instead use the original sendpushnotification
// but this is better as it dont need an expotoken and doesnt fetch to a website
//check also DailyNotificationTrigger and CalendarNotificationTrigger

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🚨RESCU-Daily Tips",
      body: "**Today's daily tip**",
      data: { category: "DailyTip" },
    },
    //change to 86400 seconds for a day , and repeat to true
    trigger: { seconds: 30, repeats: false },
  });
}
// -enabling DailyTips
async function enableDailyTips() {
  await firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .update({
      DailyTips: true,
    });
}

async function disableDailyTips() {
  await firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .update({
      DailyTips: false,
    });
}

//-------------------------------------------------------------------------------
const HomeStack = createStackNavigator();
const FirstAidStack = createStackNavigator();
const DoctorRequestsStack = createStackNavigator();

//Tab Navigation
const Tab = createBottomTabNavigator();

let currentAcceptedRequest;
function Tabs({ navigation }) {
  // console.log(currentAcceptedRequest);
  //-----------------------Push Notifications------------------------------------
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);
  currentAcceptedRequest = useSelector(
    (state) => state.userState.AcceptedRequest
  );
  const currentNotifications = useSelector(
    (state) => state.notificationState.currentNotifications
  );

  useLayoutEffect(() => {
    const userUnsubscribe = dispatch(fetchUser());
    dispatch(fetchNotifications());

    return () => {
      userUnsubscribe();
    };
  }, []);

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification
    //works when app is foregrounded, backgrounded, or killed
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
        if (response.notification.request.content.data.category === "SOS")
          navigation.navigate("Notifications");
        else if (
          response.notification.request.content.data.category === "DailyTip"
        )
          navigation.navigate("First Aid");
        else if (
          response.notification.request.content.data.category === "chatMsg"
        )
          navigation.navigate("ChatList");
      });

    // freeing Handlers
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (currentUser && currentNotifications) {
      // console.log(currentUser.ExpoToken);
      // console.log(currentNotifications);
      for (var i = 0; i < currentNotifications.length; i++)
        if (currentNotifications[i].id) {
          if (currentNotifications[i].data.delivered == false) {
            sendPushNotification(
              currentUser.ExpoToken,
              currentNotifications[i].data.title,
              currentNotifications[i].data.body,
              currentNotifications[i].data.category
            );
            setNotificationDelivered(currentNotifications[i].id);
          }
        }
    }
  }, [currentNotifications]);

  const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
    if (routeName === "Chat") return false;
    else return true;
  };
  //2 Tabs Home , First Aid
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#cf5b72"
      barStyle={{ backgroundColor: "white" }}
      tabBarOptions={{
        activeTintColor: "rgb(250,91,90)",
        keyboardHidesTabBar: true,
        labelStyle: { alignSelf: "auto", marginBottom: 5 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={({ route }) => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: "Home",

          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              style={{ marginTop: 10 }}
              name="home"
              color={color}
              size={26}
            />
          ),
        })}
      />

      <Tab.Screen
        name="First Aid"
        component={FirstAidSection}
        options={{
          tabBarLabel: "First Aid",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              style={{ marginTop: 10 }}
              name="television-play"
              color={color}
              size={26}
            />
          ),
        }}
      />
      {currentUser &&
        currentUser.medicalProfessional &&
        currentUser.doctorAvailable && (
          <Tab.Screen
            name="DoctorRequests"
            component={DoctorRequestsStackScreen}
            options={({ route }) => ({
              tabBarLabel: "Requests",
              tabBarBadge: 1,
              tabBarBadgeStyle: { color: "white", backgroundColor: "red" },

              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  style={{ marginTop: 10 }}
                  name="medical-bag"
                  size={24}
                  color={color}
                />
              ),
            })}
          />
        )}
    </Tab.Navigator>
  );
}

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
        title: "RESCU",
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
        headerShown: false,
      }}
    />

    <HomeStack.Screen
      name="EditProfile"
      style={styles.icon}
      component={EditProfileScreen}
      options={{
        headerShown: false,
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
        headerShown: true,
        title: "Chat",
        tabBarLabel: "Chat",
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
      component={NotificationScreen}
      options={{
        title: "Notifications",
      }}
    />
      <HomeStack.Screen
      name="Notif2location"
      style={styles.icon}
      component={Notif2location}
      options={{
        title: "User Location",
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
      name="CurrentRequest"
      component={RequestAcceptedScreen}
      options={{ title: "Current Request" }}
    />

    <DoctorRequestsStack.Screen
      name="DoctorChat"
      component={Chat}
      options={{ title: "Chat" }}
    />
  </DoctorRequestsStack.Navigator>
);

// const FirstAidStackScreen = ({ navigation }) => (
//   <FirstAidStack.Navigator
//     mode="modal"
//     screenOptions={{
//       cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
//     }}
//   >
//     <FirstAidStack.Screen name="First Aid" component={FirstAidSection} />

//   </FirstAidStack.Navigator>
// );

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
