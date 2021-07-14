import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import SOS from "../Screens/SOS";
import CurrentReport from "../Screens/CurrentReport";
import Tabs from "../HomeNavigation/tabs";
import UserRating from "../Screens/UserRating";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
import DoctorsScreen from "../Screens/DoctorsScreen";
import LoginScreen from "../Screens/LoginScreen";
import Settings from "../Screens/Settings Screens/Settings";
import AccountSettings from "../Screens/Settings Screens/AccountSettings";
import editProfileScreen from "../Screens/editProfileScreen";
import LocationSettings from "../Screens/Settings Screens/LocationSettings";
const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Tabs} />
      <Drawer.Screen options={{ headerShown: false }} name="Emergency Contacts"component={SOS} />
      <Drawer.Screen name="Current Report" component={CurrentReport} />
      <Drawer.Screen name="User Rating" component={UserRating} />
      <Drawer.Screen name="View Nearest Hospital"component={ViewNearestHospital} />
      <Drawer.Screen name="Request Doctor" component={DoctorsScreen} />
      <Drawer.Screen name="Settings" component={SettingsStackScreen} />
    </Drawer.Navigator>
  );
};

//Settings --> Edit Medical ID/Account Settings/location
const SettingsStack = createStackNavigator();
const SettingsStackScreen = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen
      name="Settings"
      component={Settings}
      options={{ title: "Settings" }}
    />
    <SettingsStack.Screen
      name="AccountSettings"
      component={AccountSettings}
      options={{ title: "Account Settings" }}
    />
    <SettingsStack.Screen
      name="editProfile"
      component={editProfileScreen}
      options={{title: "Edit Medical ID"}}
    />
    <SettingsStack.Screen
      name="LocationSettings"
      component={LocationSettings}
      options={{ title: "Location Service" }}
    />
  </SettingsStack.Navigator>
);
export default HomeDrawer;
