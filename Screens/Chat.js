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
  const chatid = route.params.chatid;
  useLayoutEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchMessages(userid, chatid));
  }, []);
  useEffect(() => {}, []);
  const currentUser = useSelector((state) => state.userState.currentUser);
  let fetchedmessages = useSelector((state) => state.userState.messages);
  // console.log(fetchedmessages);

  const chatRecepient = route.params.userid;
  //console.log(route.params);
  

  const [messages, setMessages] = useState([]);

  useEffect( ()=>
  navigation.addListener('beforeRemove', (e) => {
    
    console.log("el FADYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY")
    console.log(messages)
  }), [navigation] )

  useEffect( () => {
    
    
    if (fetchedmessages) {
      console.log("Fetched MESSAGES ______________________________________________________")

      console.log(fetchedmessages);
      // fetchedmessages.map((message) => {

      //   setMessages((oldarray) => [
      //     ...oldarray,
      //     {
      //       _id: message.data._id,
      //       text: message.data.text,
      //       createdAt: message.data.createdAt,
      //       user: message.data.user,
      //     },
      //   ]);
      // });
    }
    return()=>{
      console.log("UNMOUNTI*NGGGGGGGGGGGGGGGGG")
      fetchedmessages = []
      console.log(fetchedmessages)
  }

    // setMessages([
      // {
      //   _id: userid,
      //   text: "Hello, What seems to be the problem?",
      //   createdAt: new Date(),
      //   user: {
      //     _id: chatRecepient,
      //     name: "React Native",
      //     avatar: "https://placeimg.com/140/140/any",
      //   },
      // },
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

  const onSend = useCallback((Messages = []) => {
    console.log("CURRENT MESSAGES ______________________________________________________")
    console.log(messages)
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, Messages)
      
    );
    let message = Messages[0];
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
        uid: userid
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
        uid: chatRecepient
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
  if (!fetchedmessages || fetchMessages == [])
    return (
      <View>
      </View>
    )

  else
    return (
      <GiftedChat
        messages={fetchedmessages}
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
