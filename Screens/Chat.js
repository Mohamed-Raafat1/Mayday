import {
  Container,
  Thumbnail,
  Button,
  View,
  Text,
  Input,
  Item,
  Icon,
  Label,
  Form,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import firebase from "firebase";
import { SafeAreaView } from "react-native";
import GlobalStyles from "../GlobalStyles";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, fetchUser, updateMessages } from "../redux/actions";
import { addNotification, sendPushNotification } from "../HomeNavigation/tabs";

import { getExpoTokenById } from "../Components/functions/functions";

function Chat({ route, navigation }) {
  //constants
  const userid = firebase.auth().currentUser.uid;
  const dispatch = useDispatch();
  const chatid = route.params.chatid;
  const fetchedmessages = useSelector((state) => state.userState.messages);

  //fetch on mount and unsubscribe on unmount

  useLayoutEffect(() => {
    const messagesUnsubscribe = dispatch(fetchMessages(userid, chatid));
    const userUnsubscribe = dispatch(fetchUser());

    return () => {
      messagesUnsubscribe();
      userUnsubscribe();
    };
  }, [route]);

  const currentUser = useSelector((state) => state.userState.currentUser);

  const chatRecepient = route.params.userid;

  const onSend = useCallback((Messages = []) => {
    let message = Messages[0];
    dispatch(updateMessages(message, userid, chatRecepient, chatid));

    let chatMessage =
      currentUser.FirstName + " " + currentUser.LastName + " : " + message.text;
    getExpoTokenById(chatRecepient).then((result) => {
      sendPushNotification(result, "🚨RESCU", chatMessage, "chatMsg");
      addNotification(chatRecepient, chatMessage, "🚨RESCU", false, "chatMsg");
    });
  }, []);
  const scrolllToBottomComponent = (props) => {
    return <Feather name="chevrons-down" size={24} color="black" />;
  };
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#4287f5",
          },
          left: {
            backgroundColor: "gray",
          },
        }}
        textStyle={{
          right: {
            color: "white",
          },
          left: { color: "white" },
        }}
      ></Bubble>
    );
  };
  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10, marginBottom: 10 }}>
          <MaterialCommunityIcons
            name="send-circle-outline"
            size={30}
            color="#4287f5"
          />
        </View>
      </Send>
    );
  };
  if (!fetchedmessages) return <View></View>;
  else
    return (
      <GiftedChat
        scrollToBottom={true}
        renderS
        messages={fetchedmessages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: firebase.auth().currentUser.uid,
          name: currentUser.FirstName + " " + currentUser.LastName,
        }}
        showUserAvatar={true}
        renderBubble={renderBubble}
        renderSend={renderSend}
        scrollToBottomComponent={scrolllToBottomComponent}
      />
    );
}

export default Chat;
