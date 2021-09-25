import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  View,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Chat from "../Screens/Chat";
const ChatListStack = createStackNavigator();

import { useNavigationState } from "@react-navigation/native";

import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConversations, fetchUser } from "../redux/actions";

//get previous routename
function usePreviousRouteName() {
  return useNavigationState((state) =>
    state.routes[state.index - 1]?.name
      ? state.routes[state.index - 1].name
      : "None"
  );
}

const ChatList = ({ navigation, previous }) => {
  const dispatch = useDispatch();
  //fetch conversations on mount and clean up
  useLayoutEffect(() => {
    const conversUnsubscribe = dispatch(fetchConversations());
    const userUnsubscribe = dispatch(fetchUser());
    return () => {
      conversUnsubscribe();
      userUnsubscribe();
    };
  }, []);

  const conversations = useSelector((state) => state.userState.conversations);

  //mapping conversations to a chat list
  const usersList = () => {
    return conversations.map((chat) => {
      console.log(chat.data.timeStamp.toDate().getHours().toString());
      let time = {
        Hours: chat.data.timeStamp.toDate().getHours().toString(),
        Minutes: chat.data.timeStamp.toDate().getMinutes().toString(),
        Day: chat.data.timeStamp.toDate().getDate().toString(),
        Year: chat.data.timeStamp.toDate().getFullYear().toString(),
        Month: chat.data.timeStamp.toDate().getMonth().toString(),
      };
      if (Number(time.Minutes) < 10) {
        time = { ...time, Minutes: "0" + time.Minutes };
      }
      return (
        <ListItem
          style={{ borderBottomColor: "black", borderBottomWidth: 1 }}
          noBorder
          onPress={async () => {
            navigation.navigate("Chat", {
              userid: chat.data.userid,
              chatid: chat.id,
            });
          }}
          key={chat.id}
          thumbnail
        >
          <Left>
            <Thumbnail
              source={{
                uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
              }}
            />
          </Left>

          <Body style={{ flexDirection: "column" }}>
            <Text style={{ fontWeight: "bold" }}>{chat.data.talkingto}</Text>

            <Text style={{ marginTop: 5 }} note numberOfLines={1}>
              {chat.data.latestMessage.text}
            </Text>
          </Body>
          <Right
            style={{ flexDirection: "column", justifyContent: "flex-end" }}
          >
            <Text note>
              {time.Day +
                "/" +
                time.Month +
                "/" +
                time.Year +
                "  " +
                time.Hours +
                ":" +
                time.Minutes}
            </Text>

            <TouchableOpacity style={{ marginTop: 10 }}>
              <AntDesign name="delete" size={24} color="black" />
            </TouchableOpacity>
          </Right>
        </ListItem>
      );
    });
  };

  if (!conversations) return <View></View>;
  else {
    return (
      <Container>
        <Content>
          <List>{usersList()}</List>
        </Content>
      </Container>
    );
  }
};
const ChatListStackScreen = ({ navigation, previous }) => (
  <ChatListStack.Navigator>
    <ChatListStack.Screen
      name="ChatList"
      component={ChatList}
      options={{
        title: "Chats",
        headerShown: usePreviousRouteName() == "Home" ? true : false,
      }}
    />
    <ChatListStack.Screen
      name="Chat"
      component={Chat}
      options={{ title: "Chat" }}
    />
  </ChatListStack.Navigator>
);

export default ChatListStackScreen;
