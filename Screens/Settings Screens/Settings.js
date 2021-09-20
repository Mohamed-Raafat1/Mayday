import React from "react";
import {
  Container,
  Text,
  List,
  ListItem,
  Content,
  Body,
  Left,
  Thumbnail,
} from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

function Settings({ navigation }) {
  return (
    <Container>
      <Content>
        <List>
          <ListItem
            avatar
            onPress={() => navigation.navigate("AccountSettings")}
          >
            <Left>
              <MaterialCommunityIcons
                name="account-circle"
                size={24}
                color="black"
              />
            </Left>
            <Body>
              <Text>Account Settings</Text>
            </Body>
          </ListItem>

          <ListItem avatar onPress={() => navigation.navigate("editProfile")}>
            <Left>
              <Ionicons name="medical" size={24} color="black" />
            </Left>
            <Body>
              <Text>Medical ID</Text>
            </Body>
          </ListItem>

          <ListItem
            avatar
            onPress={() => navigation.navigate("LocationSettings")}
          >
            <Left>
              <Ionicons name="location" size={24} color="black" />
            </Left>
            <Body>
              <Text>Location Service</Text>
            </Body>
          </ListItem>
          <ListItem
            avatar
            onPress={() => navigation.navigate("NotificationSettings")}
          >
            <Left>
              <Ionicons name="notifications" size={24} color="black" />
            </Left>
            <Body>
              <Text>Notifications Settings</Text>
            </Body>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
}

export default Settings;
