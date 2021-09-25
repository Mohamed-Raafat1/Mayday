import React, { useLayoutEffect } from "react";
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
} from "native-base";

import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../redux/actions/index";
import { View } from "react-native";

const NotificationScreen = () => {
  //---------------------------redux/getting Notifications------------------------------
  const dispatch = useDispatch();
  const currentNotifications = useSelector(
    (state) => state.notificationState.currentNotifications
  );

  useLayoutEffect(() => {
    dispatch(fetchNotifications());
  }, []);
  //------------------------------------------------------------------------------------
  function displayNotifications() {
    return currentNotifications.map((item) => {
      if (item.data.category !== "chatMsg")
        return (
          <ListItem key={item.data.createdAt} thumbnail>
            <Left>
              <Thumbnail
                //if condition here needed on item.category of message if sos -> url if message another url and so
                source={{
                  uri: "https://i.pinimg.com/originals/37/34/8a/37348a499514a3d8e8414aeca055ea22.jpg",
                }}
              />
            </Left>
            <Body>
              <Text>{item.data.category}</Text>
              <Text note numberOfLines={1}>
                {item.data.body}
              </Text>
            </Body>
            <Right>
              <Button transparent>
                <Text>VIEW</Text>
              </Button>
            </Right>
          </ListItem>
        );
    });
  }
  //----------------------------------------------------------------------------------
  if (currentNotifications)
    return (
      <Container>
        <Content>
          <View>{displayNotifications()}</View>
        </Content>
      </Container>
    );
};

export default NotificationScreen;

//old view if needed
{
  /* <List>
          <ListItem thumbnail>
            <Left>
              <Thumbnail
                source={{
                  uri: "https://www.leasurgery.co.uk/media/content/images/doctor.jpg",
                }}
              />
            </Left>
            <Body>
              <Text>The Doctor is on his way to the location..</Text>
              <Text note numberOfLines={2}>
                Doctor Request
              </Text>
            </Body>
            <Right>
              <Button transparent>
                <Text>View</Text>
              </Button>
            </Right>
          </ListItem>

          <ListItem thumbnail>
            <Left>
              <Thumbnail
                source={{
                  uri: "https://www.yorkpress.co.uk/resources/images/10546995/",
                }}
              />
            </Left>
            <Body>
              <Text>Ambulance is arriving to the location..</Text>
              <Text note numberOfLines={2}>
                Ambulance Request
              </Text>
            </Body>
            <Right>
              <Button transparent>
                <Text>View</Text>
              </Button>
            </Right>
          </ListItem>

          <ListItem thumbnail>
            <Left>
              <Thumbnail
                source={{
                  uri: "https://i.pinimg.com/originals/37/34/8a/37348a499514a3d8e8414aeca055ea22.jpg",
                }}
              />
            </Left>
            <Body>
              <Text>Emergency Contacts were Notified Successfully..</Text>
              <Text note numberOfLines={2}>
                SOS Request
              </Text>
            </Body>
            <Right>
              <Button transparent>
                <Text>View</Text>
              </Button>
            </Right>
          </ListItem>

          <ListItem thumbnail>
            <Left>
              <Thumbnail
                source={{
                  uri: "https://cdn-systematic.nozebrahosting.dk/media/g0sj1tbg/hospital-building-001-global.jpg?cropAlias=hero_large&width=992&height=483&quality=80&mode=crop&null",
                }}
              />
            </Left>
            <Body>
              <Text>Nearest Hospital was located Successfully..</Text>
              <Text note numberOfLines={2}>
                Nearest Hospital Request
              </Text>
            </Body>
            <Right>
              <Button transparent>
                <Text>View</Text>
              </Button>
            </Right>
          </ListItem>
        </List> */
}
