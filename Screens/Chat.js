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
      />
    );
}

export default Chat;
