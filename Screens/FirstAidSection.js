import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {Header,Container, Tabs, Tab, ScrollableTab} from "native-base"
import Tab1 from './tabOne';
import Tab2 from './tabTwo';
export default function FirstAidSection() {

  const navigation = useNavigation();

  function FirstAidNav() {
    navigation.navigate("Home");
  }

  return (
    <Container>
        <Header hasTabs />
        <Tabs >
          <Tab heading="Cuts and Scrapes" tabStyle={{ backgroundColor: "#5078F2" }}
            activeTabStyle={{ backgroundColor: "#5078F2" }}>
            <Tab1 />
          </Tab>
          <Tab heading="Miscellaneous" tabStyle={{ backgroundColor: "#5078F2" }}
            activeTabStyle={{ backgroundColor: "#5078F2" }}>
            <Tab2 />
          </Tab>
        </Tabs>
      </Container>
  );
}

const card = {
  width: 350,
  height: 150
}
const text = {
  textAlign: 'center',
  fontWeight: 'bold',
  color: '#5d1a0c',
  fontSize: 18,
}
const button = {
  width: 50,
  height: 50,
  alignContent: 'center',
  justifyContent: 'center'
};

