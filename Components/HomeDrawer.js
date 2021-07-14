import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SOS from "../Screens/SOS";
import CurrentReport from "../Screens/CurrentReport";
import Tabs from "../HomeNavigation/tabs";
import UserRating from "../Screens/UserRating";
import ViewNearestHospital from "../Screens/ViewNearestHospital";
import DoctorsScreen from "../Screens/DoctorsScreen";
import LoginScreen from "../Screens/LoginScreen";
import { AuthContext } from "./context";
import { DrawerContent } from "./DrawerContent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Content, Button } from "native-base";
const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Tabs} />
      <Drawer.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <Content>
              <Button transparent>
                <MaterialCommunityIcons name="menu" size={26} />
              </Button>
            </Content>
          ),
        }}
        name="Emergency Contacts"
        component={SOS}
      />
      <Drawer.Screen name="Current Report" component={CurrentReport} />
      <Drawer.Screen name="User Rating" component={UserRating} />
      <Drawer.Screen
        name="View Nearest Hospital"
        component={ViewNearestHospital}
      />
      <Drawer.Screen name="Request Doctor" component={DoctorsScreen} />
    </Drawer.Navigator>
  );
};

export default HomeDrawer;
