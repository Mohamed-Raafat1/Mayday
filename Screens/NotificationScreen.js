import {
  Body,
  Button,
  Container,
  Content,
  Left,
  ListItem,
  Right,
  Text,
  Thumbnail,
} from "native-base";
import React, { useLayoutEffect } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../redux/actions/index";

const NotificationScreen = () => {
  //---------------------------redux/getting Notifications------------------------------
  const dispatch = useDispatch();
  const currentNotifications = useSelector(
    (state) => state.notificationState.currentNotifications
  );

  useLayoutEffect(() => {
    const Unsubscribe = dispatch(fetchNotifications());

    return () => {
      Unsubscribe();
    };
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
