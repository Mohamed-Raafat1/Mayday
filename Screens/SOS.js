import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import {
  Container,
  Header,
  Content,
  Button,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  Right,
  Switch,
  Title,
  Input,
} from "native-base";

import { StyleSheet } from "react-native";
const Stack = createStackNavigator();
function SOS({ navigation }) {
  const buttonColor = "#0A81AB";
  //Toggle Switch to enable SOS
  // const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  //To save contact numbers (first contact only right now as a Test)
  const [Numbers, SetNumbers] = useState("");
  const printme = () => {
    console.log("Contact1 = " + Numbers);
  };

  return (
    <Container>
      <Content>
        {/* Switch  */}
        {/* <ListItem icon style={{ marginBottom: 50 }}>
          <Left>
            <Button style={{ backgroundColor: "#FF9501" }}>
              <Icon active name="person" />
            </Button>
          </Left>
          <Body>
            <Text>Emergency Contacts</Text>
          </Body>
          <Right>
            <Switch onValueChange={toggleSwitch} value={isEnabled} />
          </Right>
        </ListItem> */}

        <ListItem icon style={{ marginBottom: 10, marginTop: 10 }}>
          <Left>
            <Text>1.</Text>
          </Left>
          {/* Emergency Number */}
          <Body>
            <Input
              placeholder="First Contact"
              onChangeText={SetNumbers}
              value={Numbers}
            >
              +2010004545584
              </Input>
          </Body>
          <Right>
            {/* Get from Contacts Button */}
            <Button
              onPress={() => {
                navigation.goBack();
              }}
              style={{ backgroundColor: buttonColor }}
            >
              <Icon active name="person" />
            </Button>
          </Right>
        </ListItem>
        <ListItem icon style={{ marginBottom: 10 }}>
          <Left>
            <Text>2.</Text>
          </Left>
          <Body>
            <Input placeholder="Second Contact" >+2011136445784</Input>
          </Body>
          <Right>
            <Button style={{ backgroundColor: buttonColor }}>
              <Icon active name="person" />
            </Button>
          </Right>
        </ListItem>
        <ListItem icon style={{ marginBottom: 10 }}>
          <Left>
            <Text>3.</Text>
          </Left>
          <Body>
            <Input placeholder="Third Contact" >+2010626363584</Input>
          </Body>
          <Right>
            <Button style={{ backgroundColor: buttonColor }}>
              <Icon active name="person" />
            </Button>
          </Right>
        </ListItem>
        <ListItem icon style={{ marginBottom: 10 }}>
          <Left>
            <Text>4.</Text>
          </Left>
          <Body>
            <Input placeholder="Fourth Contact" >+201205554787</Input>
          </Body>
          <Right>
            <Button style={{ backgroundColor: buttonColor }}>
              <Icon active name="person" />
            </Button>
          </Right>
        </ListItem>
        <ListItem icon style={{ marginBottom: 10 }}>
          <Left>
            <Text>5.</Text>
          </Left>
          <Body>
            <Input placeholder="Fifth Contact" >+2010006363584</Input>
          </Body>
          <Right>
            <Button style={{ backgroundColor: buttonColor }}>
              <Icon active name="person" />
            </Button>
          </Right>
        </ListItem>
     
      </Content>
    </Container>
  );
}

function sosStackScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Content style={{ paddingTop: 5 }}>
              <Button transparent onPress={() => navigation.goBack()}>
                <Text>Save</Text>
              </Button>
            </Content>
          ),
          headerLeft: () => (
            <Content style={{ marginLeft: 10, paddingTop: 5 }}>
              <Button transparent onPress={() => navigation.goBack()}>
                <Ionicons
                  name="ios-arrow-back-outline"
                  size={24}
                  color="black"
                />
              </Button>
            </Content>
          ),

          title: "Emergency Contacts",
        }}
        name="Emergency Contacts"
        component={SOS}
      />
    </Stack.Navigator>
  );
}
export default sosStackScreen;

const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    marginBottom: 10,
    marginHorizontal: 10,
    alignContent: "center",
    backgroundColor: "rgb(250,91,90)",
  },
});
