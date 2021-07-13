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
import HomeDrawer from "./Components/HomeDrawer";


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

  //2 Stack Screens --> Home Drawer (or RegisterScreen) --> HomeDrawer first item is Tabs.js 
  // Tab.js consists of two tabs (Home Stack , First Aid Stack) 
  //Tab 1 (Home Stack) consists of 5 Screens (one of them will be chatlist Stack )
  return (
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen
          options={{ title: "Welcome", headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen name="Home" options={{headerShown:false}} component={HomeDrawer} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
