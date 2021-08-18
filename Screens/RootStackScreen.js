import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import RegistrationScreen from "./RegistrationScreen";
const RootStack = createStackNavigator();
import GettingStarted from "./GettingStarted";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const RootStackScreen = ({ navigation }) => {
  const [isFirstLaunch, setisFirstLaunch] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value == null) {
        AsyncStorage.setItem("alreadyLaunched", "true"); // No need to wait for `setItem` to finish, although you might want to handle errors
        setisFirstLaunch(true);
      } else {
        setisFirstLaunch(false);
      }
    }); // Add some error handling, also you can simply do setIsFirstLaunch(null)
  }, []);
  let routeName
  if (isFirstLaunch === null) {
    return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
  } else if (isFirstLaunch == true) {
    routeName = "GettingStarted";
  } else {
    routeName = "Login";
  }

  return (
    <RootStack.Navigator initialRouteName={routeName} headerMode="none">
      <RootStack.Screen
        options={{ headerShown: false }}
        name="GettingStarted"
        component={GettingStarted}
      />

      <RootStack.Screen
        options={{ title: "Login", headerShown: false }}
        name="Login"
        component={LoginScreen}
      />
      <RootStack.Screen name="Registration" component={RegistrationScreen} />
    </RootStack.Navigator>
  );
};
export default RootStackScreen;
