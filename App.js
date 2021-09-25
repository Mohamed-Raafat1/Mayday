import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import * as TaskManager from "expo-task-manager";
import firebase from "firebase";
import * as geofirestore from "geofirestore";
//for Toast to work
import { Root, View } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, LogBox, StatusBar } from "react-native";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import HomeDrawer from "./Components/HomeDrawer";
import rootReducer from "./redux/reducers/index";
import RootStackScreen from "./Screens/RootStackScreen";

// symbol polyfills
global.Symbol = require("core-js/es6/symbol");
require("core-js/fn/symbol/iterator");

// collection fn polyfills
require("core-js/fn/map");
require("core-js/fn/set");
require("core-js/fn/array/find");


LogBox.ignoreLogs(["Setting a timer"]);




const firebaseConfig = {
  apiKey: "AIzaSyCH4QqZ1C8cgycNz3X8uaaubH3R3gPoIGg",
  authDomain: "rescu-dev.firebaseapp.com",
  projectId: "rescu-dev",
  storageBucket: "rescu-dev.appspot.com",
  messagingSenderId: "993325528560",
  appId: "1:993325528560:web:d907645f689b19fe161935",
  measurementId: "G-JFLZQPN8BD",
};
if (firebase.apps.length === 0) {
  const app = firebase.initializeApp(firebaseConfig);
}
const firestore = firebase.firestore();
export const Geofirestore = geofirestore.initializeApp(firestore);

const store = createStore(rootReducer, applyMiddleware(thunk));

const Stack = createStackNavigator();
//exporting fonts needed for nativebase
export default function App({ props }) {
  const [isLoading, setIsLoading] = useState(true);
  const [LoggedIn, setLoggedIn] = useState(false);
  const [loaded] = useFonts({
    Roboto: require("native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
  });



  //!!!!!!!!!!!!!REMOVE LATER!!!!!!!!!!!!!!!!!!!!
  //!!!!!!!!!!!!!!!!!this is used to unregister all tasks which is used in onmount
  //!!This is only used to help when testing cuz reloading app doesnt remove tasks
  const unregisterTasks = useCallback(async () => {
    await TaskManager.unregisterAllTasksAsync().catch((err) =>
      console.log("ops! error unregistering alltasks", err)
    );
  }, []);
  useEffect(() => {
    unregisterTasks(); //!!!!!!!!!!!!!!!!!!!!REMOVE LATER!!!!!!!!!!!!!!

    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoggedIn(false);
        setIsLoading(false);
      } else {
        setLoggedIn(true);
        setIsLoading(false);
      }
    });
    firebase;
  }, []);
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
    <Provider store={store}>
      <Root>
        <NavigationContainer>
          <StatusBar backgroundColor="white" barStyle="dark-content" />

          {LoggedIn ? <HomeDrawer /> : <RootStackScreen />}
        </NavigationContainer>
      </Root>
    </Provider>
  );
}
