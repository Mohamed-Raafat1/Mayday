import "react-native-gesture-handler";
import React, { useState, useEffect, useMemo } from "react";
import { ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import firebase from 'firebase/app';

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import RootStackScreen from "./Screens/RootStackScreen";
import { View } from "native-base";
import { AuthContext } from "./Components/AuthProvider";

import HomeDrawer from "./Components/HomeDrawer";
const firebaseConfig={
    apiKey: "AIzaSyCH4QqZ1C8cgycNz3X8uaaubH3R3gPoIGg",
    authDomain: "rescu-dev.firebaseapp.com",
    projectId: "rescu-dev",
    storageBucket: "rescu-dev.appspot.com",
    messagingSenderId: "993325528560",
    appId: "1:993325528560:web:d907645f689b19fe161935",
    measurementId: "G-JFLZQPN8BD"
  };

const app =firebase.initializeApp(firebaseConfig);
export const auth=app.auth() ;
const Stack = createStackNavigator();
//exporting fonts needed for nativebase
export default function App({ props }) {

  const [isLoading, setIsLoading] = useState(true);
  const [loaded] = useFonts({
    Roboto: require("native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
  });
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  }, []);
  if (!loaded) {
    return null;
  }
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="red" size="large"></ActivityIndicator>
      </View>
    );
  }
  //basic navigation stack login-->homecreen
  //will be changed later

  //2 Stack Screens --> Home Drawer (or RegisterScreen) --> HomeDrawer first item is Tabs.js
  // Tabs.js consists of two tabs (Home Stack , First Aid Stack)
  //Tab 1 (Home Stack) consists of 5 Screens (one of them will be chatlist Stack )
  //ChatList Stack consists of screens (Chats)
  return (
    <AuthContext.Provider value={AuthContext}>
      <NavigationContainer>
        {userToken == null ? (
          <RootStackScreen></RootStackScreen>
        ) : (
          <HomeDrawer></HomeDrawer>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
