import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as TaskManager from "expo-task-manager";
import { ScrollableTab } from "native-base";
import React, { useLayoutEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions";
import CurrentReport from "../Screens/CurrentReport";
import DoctorsScreen from "../Screens/DoctorsScreen";
import ViewNearestHospital from "../Screens/ViewNearestHospital";

const Tab = createMaterialTopTabNavigator();

////////////////////////////  MAIN COMPONENT   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export default function EmergencyTab({ navigation }) {
  const hasUnsavedChanges = true;

  const currentRequest = useSelector(
    (state) => state.requestState.currentRequest
  );
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    const Unsubscribe = dispatch(fetchUser());

    return () => {
      Unsubscribe();
    };
  }, []);

  //warning before going back
  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!currentRequest) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          "Cancel SOS?",
          "If you go back the SOS request will be cancelled. Are you sure you want to go back?",
          [
            { text: "Don't leave", style: "cancel", onPress: () => {} },
            {
              text: "Cancel SOS",
              style: "destructive",
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: async () => {
                await TaskManager.unregisterAllTasksAsync();
                navigation.dispatch(e.data.action);
              },
            },
          ]
        );
      }),
    [navigation, hasUnsavedChanges]
  );

  return (
    <Tab.Navigator
      lazy={true}
      swipeEnabled={true}
      renderTabBar={() => <ScrollableTab />}
      tabBarOptions={{
        inactiveTintColor: "grey",
        activeTintColor: "#cf5b72",
        pressColor: "grey",
        indicatorStyle: {
          backgroundColor: "white",
        },
      }}
      style={{ backgroundColor: "red" }}
    >
      <Tab.Screen
        options={{ tabBarLabel: "Nearby Hospitals" }}
        name="View Nearest Hospital"
        component={ViewNearestHospital}
      />
      <Tab.Screen
        options={{ tabBarLabel: "Request Doctor" }}
        name="RequestDoctor"
        component={DoctorsScreen}
      />

      {/*checking if request was sent*/}
      {currentRequest && (
        <Tab.Screen
          options={{ tabBarLabel: "Current Report" }}
          name="Current report"
          component={CurrentReport}
        />
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
