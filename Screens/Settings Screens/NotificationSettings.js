import {
  Container,
  Text,
  Content,
  ListItem,
  Left,
  Icon,
  Button,
  Right,
  Switch,
  Body,
  View,
} from "native-base";
import React, { useEffect } from "react";
import { useState, useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

import { DailyTipsAlert } from "../../HomeNavigation/tabs";

import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/actions";

import * as Notifications from "expo-notifications";

function NotificationSettings() {
  //------------redux---------------------------
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);
  useLayoutEffect(() => {
    dispatch(fetchUser());
  }, []);
  //--------------------------------------------------------
  //to listen to change in permission and cancel scheduled next tips if it was enabled before
  useEffect(() => {
    setIsEnabled(currentUser.DailyTips);
    if (currentUser.DailyTips == false)
      Notifications.cancelAllScheduledNotificationsAsync();
  }, [currentUser]);

  //Toggle Switch to enable DailyTips
  const [isEnabled, setIsEnabled] = useState(currentUser.DailyTips);

  //Dont Delete the following comment
  //   const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  if (!currentUser) return <View></View>;
  return (
    <Container>
      <Content>
        {/* Switch  */}
        <ListItem icon style={{ marginBottom: 50 }}>
          <Left>
            <Button style={{ backgroundColor: "#FF9501" }}>
              <Ionicons name="notifications" size={24} color="black" />
            </Button>
          </Left>
          <Body>
            <Text>Daily Tips</Text>
          </Body>
          <Right>
            <Switch
              onValueChange={async () => {
                await DailyTipsAlert();
              }}
              value={isEnabled}
            />
          </Right>
        </ListItem>
      </Content>
    </Container>
  );
}
export default NotificationSettings;
