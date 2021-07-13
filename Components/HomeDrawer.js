import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SOS from"../Screens/SOS";
import CurrentReport from '../Screens/CurrentReport';
import Tabs from '../HomeNavigation/tabs';
import UserRating from '../Screens/UserRating';
import ViewNearestHospital from '../Screens/ViewNearestHospital';
import DoctorsScreen from '../Screens/DoctorsScreen';
const Drawer = createDrawerNavigator();

const HomeDrawer = () => {
    return (
      <Drawer.Navigator >
        <Drawer.Screen name="Home" component={Tabs} />
        <Drawer.Screen name="Emergency Contacts" component={SOS} />
        <Drawer.Screen name="Current Report" component={CurrentReport} />
        <Drawer.Screen name="User Rating" component={UserRating} />
        <Drawer.Screen name="View Nearest Hospital" component={ViewNearestHospital}/>
        <Drawer.Screen name="Request Doctor" component={DoctorsScreen}/>
      </Drawer.Navigator>
    )
}

export default HomeDrawer
