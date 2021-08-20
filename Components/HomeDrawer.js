import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import sosStackScreen from "../Screens/SOS/EmergencyContacts";
import CurrentReport from "../Screens/CurrentReport";
import Tabs from "../HomeNavigation/tabs";
import userRatingStackScreen from "../Screens/UserRating";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
import DoctorsScreen from "../Screens/DoctorsScreen";
import { DrawerContent } from "./DrawerContent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Content, Button,Text, View } from "native-base";
import Settings from "../Screens/Settings Screens/Settings";
import AccountSettings from "../Screens/Settings Screens/AccountSettings";
import EditProfileScreen from "../Screens/EditProfileScreen";
import LocationSettings from "../Screens/Settings Screens/LocationSettings";
import AccidentsList from "../Screens/AccidentsListScreen";

//for initial signup
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";


const Drawer = createDrawerNavigator();



const HomeDrawer = ({ props }) => {


  // -------------------------this is all for first signup trial-----------------
  // const [isFirstSignup, setisFirstSignup] = useState(null);
  // useEffect(() => {

  //   AsyncStorage.getItem("alreadyLoggedin").then(async (value) => {

  //     await console.log(value)
  //     // console.log(isFirstSignup)
  //     if (value == null || value==false) {
  //       AsyncStorage.setItem("alreadyLoggedin", "true"); // No need to wait for `setItem` to finish, although you might want to handle errors
  //       setisFirstSignup(true);
  //     } else {
  //       setisFirstSignup(false);
        
  //     }
  //   }); // Add some error handling, also you can simply do setIsFirstLaunch(null)
  // }, []);
  // let routeName

  // if (isFirstSignup === null) {
  //   return (<View></View>); // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
  // } else if (isFirstSignup == true) {
  //   routename = "User Rating";
  // } else {
  //   routeName = "Home";
  // }
  // ------------------------------------------------------------------------

  return (
    <Drawer.Navigator  drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Tabs} />
      <Drawer.Screen
        // options={{
        //   headerShown: true,
        // }}
        name="Emergency Contacts"
        component={sosStackScreen}
      />
      <Drawer.Screen name="User Rating" component={userRatingStackScreen} />
      <Drawer.Screen
        name="View Nearest Hospital"
        component={ViewNearestHospital}
      />
      <Drawer.Screen name="Request Doctor" component={DoctorsScreen} />
      <Drawer.Screen name="Accidents List" component={AccidentsList} />

      <Drawer.Screen name="Settings" component={SettingsStackScreen} />
    </Drawer.Navigator>
  );
};

//Settings --> Edit Medical ID/Account Settings/location
const SettingsStack = createStackNavigator();
const SettingsStackScreen = ({navigation}) => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen
      name="Settings"
      component={Settings}
      options={{  headerShown:true,title: "Settings" }}
    />
    <SettingsStack.Screen
      name="AccountSettings"
      component={AccountSettings}
      options={{ title: "Account Settings" }}
    />
    {/* <SettingsStack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerRight: () => (
          <Content >
            <Button transparent >
              <Text>Save</Text>
            </Button>
          </Content>),
        title: "Edit Medical ID",

      }}
    /> */}
    <SettingsStack.Screen
      name="LocationSettings"
      component={LocationSettings}
      options={{ title: "Location Service" }}
    />
  </SettingsStack.Navigator>
);
export default HomeDrawer;
