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


const NotificationScreen = ({ navigation }) => {
  //---------------------------redux/getting Notifications------------------------------
  const dispatch = useDispatch();
  const currentNotifications = useSelector(
    (state) => state.notificationState.currentNotifications
  );

  useLayoutEffect(() => {
    dispatch(fetchNotifications());
    return () => {};
  }, []);

  //------------------------------------------------------------------------------------
  function displayNotifications() {
    return currentNotifications.map((item) => {
      let time = {
        Hours: item.data.createdAt.toDate().getHours().toString(),
        Minutes: item.data.createdAt.toDate().getMinutes().toString(),
        Day: item.data.createdAt.toDate().getDate().toString(),
        Year: item.data.createdAt.toDate().getFullYear().toString(),
        Month: item.data.createdAt.toDate().getMonth().toString(),
      };
      if (item.data.category !== "chatMsg")
        return (
          <ListItem key={item.data.createdAt} thumbnail>
            <Left>
              <Thumbnail
                //if condition here needed on item.category of message if sos -> url if message another url and so
                source={{
                  uri: item.data.photoURL,
                }}
              />
            </Left>
            <Body>
              <Text>{item.data.body}</Text>
              <Text note numberOfLines={1}>
                {item.data.category +
                  " - " +
                  time.Day +
                  "/" +
                  time.Month +
                  "/" +
                  time.Year +
                  "  " +
                  time.Hours +
                  ":" +
                  time.Minutes}
              </Text>
            </Body>
            <Right>
              <Button
                transparent
                onPress={() => {
                  navigation.navigate("Notif2location", {
                    userid: item.data.SOSuid,
                  });
                }}
              >
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
