import React from 'react';

import { StyleSheet, Button, View, Text, Image } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import HomeScreen from '../Screens/HomeScreen1'; 
import FirstAidScreen from '../Screens/FirstAidScreen';
import DoctorsScreen from '../Screens/DoctorsScreen';
import MoreScreen from '../Screens/MoreScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import editProfileScreen from '../Screens/editProfileScreen';


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
              tabBarLabel: 'First Aids',
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

const HomeStackScreen = ({navigation}) => (
    <HomeStack.Navigator>
          <HomeStack.Screen name="Home" component={HomeScreen}
            options={{
            title:'Home',
            headerRight: () => (
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="account-circle-outline" size={26} 
                onPress={() => navigation.navigate('Profile')}/>
                <MaterialCommunityIcons name="bell-outline" size={26} />
                
              </View>
            ),
          }} />
          <HomeStack.Screen name="Profile" component={ProfileScreen} options={{
            title: 'Profile',
            headerRight: () => (
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="account-edit-outline" size={30}
                onPress={() => navigation.navigate('editProfile')} />
              </View>
            ),
           }}
          />
          <HomeStack.Screen name="editProfile" component={editProfileScreen} options={{
            title: 'Edit Profile',
           }}
          />
    </HomeStack.Navigator>
);

const FirstAidStackScreen = () => (
  <FirstAidStack.Navigator>
        <FirstAidStack.Screen name="First Aid" component={FirstAidScreen} options={{
          title:'First Aid'
        }} />
  </FirstAidStack.Navigator>
);

const DoctorsStackScreen = () => (
  <DoctorsStack.Navigator>
        <DoctorsStack.Screen name="Doctors" component={DoctorsScreen} options={{
          title:'Doctors'
        }} />
  </DoctorsStack.Navigator>
);

const MoreStackScreen = () => (
  <MoreStack.Navigator>
        <MoreStack.Screen name="More" component={MoreScreen} options={{
          title:'More'
        }} />
  </MoreStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profle" component={ProfileScreen} options={{
      title:'Profile'
    }}/>
  </ProfileStack.Navigator>
)

export default Tabs;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginLeft: 15,
    width: 70,
  }
 
});