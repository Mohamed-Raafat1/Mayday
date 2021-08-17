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
import { fetchMessages, fetchUser, updateMessages } from "../redux/actions";

function Chat({ route, navigation }) {
  const userid = firebase.auth().currentUser.uid;
  const dispatch = useDispatch();
  const chatid = route.params.chatid;

  const fetchedmessages = useSelector((state) => state.userState.messages);
  const [initialmessages, setinitialmessages] = useState([]);
  useEffect(() => {
    return () => {};
  }, [fetchedmessages]);
  useLayoutEffect(() => {
    dispatch(fetchMessages(userid, chatid));
    dispatch(fetchUser());

    setinitialmessages(fetchedmessages);
    console.log(
      "mounting-------------------------------------------------\n",
      fetchedmessages
    );
    return () => {
      console.log(
        "unmouting-----------------------------------------------------\n",
        fetchedmessages
      );
    };
  }, [route]);

  const currentUser = useSelector((state) => state.userState.currentUser);

  const chatRecepient = route.params.userid;
  console.log(route.params);

  useEffect(
    () => navigation.addListener("beforeRemove", (e) => {}),
    [navigation]
  );

  // useEffect(() => {}, [initialmessages.length]);

  const onSend = useCallback((Messages = []) => {
    let message = Messages[0];
    dispatch(updateMessages(message, userid, chatRecepient, chatid));
    // setinitialmessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, Messages)
    // );

    // console.log("new fetched messages ---------------------------------\n");
    // console.log(fetchedmessages);
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
  if (!fetchedmessages) return <View></View>;
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
