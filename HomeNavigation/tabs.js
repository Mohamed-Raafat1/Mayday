
//BUTTONS NATIVE BASE


import React from "react";
//React Native
import { StyleSheet, Text, Image } from "react-native";


import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from "../Screens/HomeScreen";
import DoctorsScreen from "../Screens/DoctorsScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import editProfileScreen from "../Screens/editProfileScreen";
import FirstAidSection from "../Screens/FirstAidSection";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
import { Button ,Container } from "native-base";


const HomeStack = createStackNavigator();
const FirstAidStack = createStackNavigator();
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

const HomeStackScreen = ({ navigation }) => (

  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerLeft: () => (
          <Container style={styles.moreIcon}>
            <MaterialCommunityIcons
              name="menu"
              size={26}
              onPress={() => navigation.openDrawer()}
            />       
          </Container>
        ),
        title: "Home",
        headerRight: () => (
          <Container style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={26}
              onPress={() => navigation.navigate("Profile")}
            />
            <Button > </Button>
            <MaterialCommunityIcons name="bell-outline" size={26} />
          </Container>
        ),
      }}
    />
    <HomeStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: "Profile",
        headerRight: () => (
          <Container style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={30}
              onPress={() => navigation.navigate("editProfile")}
            />
          </Container>
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
 
  </HomeStack.Navigator>
);

// const DoctorsStackScreen = () => (
//   <DoctorsStack.Navigator>
//     <DoctorsStack.Screen
//       name="Doctors"
//       component={DoctorsScreen}
//       options={{ headerShown: false, title: "Doctors" }}
//     />
//   </DoctorsStack.Navigator>
// );

// const MoreStackScreen = () => (
//   <MoreStack.Navigator>
//     <MoreStack.Screen
//       name="More"
//       component={MoreScreen}
//       options={{ headerShown: false, title: "More" }}
//     />
//   </MoreStack.Navigator>
// );

const FirstAidStackScreen = () => (
  <FirstAidStack.Navigator>
        <FirstAidStack.Screen name="FirstAid" component={FirstAidSection} options={{
            headerLeft:null,
            title:'FirstAid',
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
  },
  moreIcon : {
    marginLeft:10 ,
  },
});
