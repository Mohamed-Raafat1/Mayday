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
import React, {
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import firebase from "firebase";
import { SafeAreaView } from "react-native";
import GlobalStyles from "../GlobalStyles";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, fetchUser } from "../redux/actions";

function Chat({ route, navigation }) {
  const userid = firebase.auth().currentUser.uid;
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchMessages(route.params.chatid));
  }, []);
  useEffect(() => {}, []);
  const currentUser = useSelector((state) => state.userState.currentUser);
  const fetchedmessages = useSelector((state) => state.userState.messages);
  console.log(fetchedmessages);

  const chatRecepient = route.params.userid;
  console.log(route.params);
  const chatid = route.params.chatid;

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (fetchedmessages) {
      console.log(userid);
      fetchedmessages.map((message) => {
        setMessages((oldarray) => [
          ...oldarray,
          {
            _id: message.data._id,
            text: message.data.text,
            createdAt: message.data.createdAt,
            user: message.data.user,
          },
        ]);
      });
    }

    // setMessages([
    //   {
    //     _id: userid,
    //     text: "Hello, What seems to be the problem?",
    //     createdAt: new Date(),
    //     user: {
    //       _id: chatRecepient,
    //       name: "React Native",
    //       avatar: "https://placeimg.com/140/140/any",
    //     },
    //   },
    //   {
    //     _id: chatRecepient,
    //     text: "Hello Doctor",
    //     createdAt: new Date(),
    //     user: {
    //       _id: userid,
    //       name: "React Native",
    //       avatar: "https://placeimg.com/140/140/any",
    //     },
    //   },
    // ]);
  }, [fetchedmessages]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    console.log(messages);
    let message = messages[0];
    firebase
      .firestore()
      .collection("users")
      .doc(userid)
      .collection("messages")
      .doc(messages._id)
      .set({
        _id: message._id,
        createdAt: message.createdAt,
        text: message.text,
        chatid,
        user: message.user,
        chatRecepient,
      });
    firebase
      .firestore()
      .collection("users")
      .doc(chatRecepient)
      .collection("messages")
      .doc(messages._id)
      .set({
        _id: message._id,
        createdAt: message.createdAt,
        text: message.text,
        chatid,
        user: message.user,
        chatRecepient,
      });
  }, []);
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "grey",
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
        _id: firebase.auth().currentUser.uid,
        name: currentUser.FirstName + " " + currentUser.LastName,
      }}
      renderBubble={renderBubble}
    />
  );
}

export default Chat;
