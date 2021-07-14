import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import RegistrationScreen from "./RegistrationScreen";
const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen
      options={{ title: "Login", headerShown: false }}
      name="Login"
      component={LoginScreen}
    />

    <RootStack.Screen name="Registration" component={RegistrationScreen} />
  </RootStack.Navigator>
);
export default RootStackScreen;
