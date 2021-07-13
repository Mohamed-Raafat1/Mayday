import React from "react";

import { StyleSheet, Button, View, Text, Image } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';




import HomeScreen from "../Screens/HomeScreen";
import FirstAidScreen from '../Screens/FirstAidSection';
import DoctorsScreen from "../Screens/DoctorsScreen";
import MoreScreen from "../Screens/MoreScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import editProfileScreen from "../Screens/editProfileScreen";
import FirstAidSection from "../Screens/FirstAidSection";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
import Hypothermia from "../Screens/Hypothermia";
import Meningitis from "../Screens/Meningitis";
import Poisoning from "../Screens/Poisoning";

const HomeStack = createStackNavigator();
const FirstAidStack = createStackNavigator();
const DoctorsStack = createStackNavigator();
const MoreStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator
          initialRouteName="Home"
          activeColor="#ff1262"
          barStyle={{ backgroundColor: 'white' }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStackScreen}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="First Aid"
            component={FirstAidStackScreen}
            options={{
              tabBarLabel: 'First Aid',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="television-play" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="Doctors"
            component={DoctorsStackScreen}
            options={{
              tabBarLabel: 'Doctors',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="doctor" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="More"
            component={MoreStackScreen}
            options={{
              tabBarLabel: 'More',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="menu" color={color} size={26} />
              ),
            }}
          />
        </Tab.Navigator>
      );
}

const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerLeft: null,
        title: "Home",
        headerRight: () => (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={26}
              onPress={() => navigation.navigate("Profile")}
            />
            <MaterialCommunityIcons name="bell-outline" size={26} />
          </View>
        ),
      }}
    />
    <HomeStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: "Profile",
        headerRight: () => (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={30}
              onPress={() => navigation.navigate("editProfile")}
            />
          </View>
        ),
      }}
    />
    <HomeStack.Screen
      name="editProfile"
      component={editProfileScreen}
      options={{
        title: "Edit Profile",
      }}
    />
    <HomeStack.Screen
      name="ViewNearestHospital"
      component={ViewNearestHospital}
      options={{
        title: "Hospitals Nearby",
      }}
    />
  </HomeStack.Navigator>
);

const DoctorsStackScreen = () => (
  <DoctorsStack.Navigator>
    <DoctorsStack.Screen
      name="Doctors"
      component={DoctorsScreen}
      options={{ headerShown: false, title: "Doctors" }}
    />
  </DoctorsStack.Navigator>
);

const MoreStackScreen = () => (
  <MoreStack.Navigator>
    <MoreStack.Screen
      name="More"
      component={MoreScreen}
      options={{ headerShown: false, title: "More" }}
    />
  </MoreStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="Profle"
      component={ProfileScreen}
      options={{ headerShown: false, title: "Profile" }}
    />
  </ProfileStack.Navigator>
);

const FirstAidStackScreen = ({ navigation }) => (
  <FirstAidStack.Navigator>
        <FirstAidStack.Screen name="FirstAid" component={FirstAidSection} 
        options={{
        title: "First-Aid",
        headerLeft:null
        }} />
        <FirstAidStack.Screen name="Hypothermia" component={Hypothermia} 
        options={{
            title:'Hypothermia',
        }} />
        <FirstAidStack.Screen name="Meningitis" component={Meningitis} 
        options={{
            title:'Meningitis',
        }} />
        <FirstAidStack.Screen name="Poisoning" component={Poisoning} 
        options={{
            title:'Poisoning',
        }} />
  </FirstAidStack.Navigator>
);
export default Tabs;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginLeft: 15,
    width: 70,
  }
});
