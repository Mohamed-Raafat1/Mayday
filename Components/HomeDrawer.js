import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import sosStackScreen from "../Screens/SOS";
import CurrentReport from "../Screens/CurrentReport";
import Tabs from "../HomeNavigation/tabs";
import userRatingStackScreen from "../Screens/UserRating";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
import DoctorsScreen from "../Screens/DoctorsScreen";
import { DrawerContent } from "./DrawerContent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Content, Button,Text } from "native-base";
import Settings from "../Screens/Settings Screens/Settings";
import AccountSettings from "../Screens/Settings Screens/AccountSettings";
import editProfileScreen from "../Screens/editProfileScreen";
import LocationSettings from "../Screens/Settings Screens/LocationSettings";
const Drawer = createDrawerNavigator();

const HomeDrawer = ({ props }) => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
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
    <SettingsStack.Screen
      name="editProfile"
      component={editProfileScreen}
      options={{
        headerRight: () => (
          <Content >
            <Button transparent >
              <Text>Save</Text>
            </Button>
          </Content>),
        title: "Edit Medical ID",

      }}
    />
    <SettingsStack.Screen
      name="LocationSettings"
      component={LocationSettings}
      options={{ title: "Location Service" }}
    />
  </SettingsStack.Navigator>
);
export default HomeDrawer;
