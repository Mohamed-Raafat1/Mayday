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
import React, { useState, useCallback, useEffect } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

import { SafeAreaView } from "react-native";
import GlobalStyles from "../GlobalStyles";

function Chat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
      {
        _id: 2,
        text: "Hello amigo",
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "green",
          },
        }}
        textStyle={{
          right: {
            color: "white",
          },
        }}
      ></Bubble>
    );
  };
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderBubble={renderBubble}
    />
  );
}

export default Chat;
