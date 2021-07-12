import "react-native-gesture-handler";
import React from "react";

import { useFonts } from "expo-font";

import LoginScreen from "./Screens/LoginScreen";
import HomeScreen from "./Screens/HomeScreen";
import RegistrationScreen from "./Screens/RegistrationScreen";
import Chat from "./Screens/Chat";
import ViewNearestHospital from "./Screens/ViewNearestHospital";
import  UserRating from './Screens/UserRating'
import FirstAidSection from './Screens/FirstAidSection';
import RequestAmbulance from './Screens/RequestAmbulance';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CurrentReport from "./Screens/CurrentReport";
import SOS from "./Screens/SOS";
import Tabs from "./HomeNavigation/tabs";


const Stack = createStackNavigator();
//exporting fonts needed for nativebase
export default function App() {
  const [loaded] = useFonts({
    Roboto: require("native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
  });
  if (!loaded) {
    return null;
  }
  //basic navigation stack login-->homecreen
  //will be changed later
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ title: "Welcome", headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen name="Home" options={{headerShown:false}} component={Tabs} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen
          name="ViewNearestHospital"
          component={ViewNearestHospital}
          options={{ title: "Map test" }}
        />
        <Stack.Screen
          name="Chat"
          options={{ headerShown: false }}
          component={Chat}
        />
    <Stack.Screen name="FirstAid" options={{ title: "Welcome", headerShown: true }} component={FirstAidSection} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
