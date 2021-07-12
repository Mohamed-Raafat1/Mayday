import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SOS from"../Screens/SOS";
import CurrentReport from '../Screens/CurrentReport';
import Tabs from '../HomeNavigation/tabs';
const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
    return (
      <Drawer.Navigator >
        <Drawer.Screen name="Home" component={Tabs} />
        <Drawer.Screen name="Emergency Contacts" component={SOS} />
        <Drawer.Screen name="Current Report" component={CurrentReport} />
      </Drawer.Navigator>
    )
}

export default HomeDrawer
