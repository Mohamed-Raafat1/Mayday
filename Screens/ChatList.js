import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  View,
  Button,
} from "native-base";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Chat from "../Screens/Chat";
const ChatListStack = createStackNavigator();
import { useRoute } from "@react-navigation/native";
import { useNavigationState } from "@react-navigation/native";
import firebase from "firebase";

import { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatList, fetchConversations, fetchUser } from "../redux/actions";
function usePreviousRouteName() {
  return useNavigationState((state) =>
    state.routes[state.index - 1]?.name
      ? state.routes[state.index - 1].name
      : "None"
  );
}

const ChatList = ({ navigation, previous }) => {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(fetchConversations());
  }, []);
  const [chats, setchats] = useState([]);
  // const [messages, setmessages] = useState(null);
  // const [conversations, setconversations] = useState([]);
  // const [conversations2, setconversations2] = useState([]);

  const conversations = useSelector((state) => state.userState.conversations);

  // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  // console.log(chatList);
  // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  // // console.log(chatList);

  const [counter, setcounter] = useState(0);

  // async function fetchData() {
  //   try {
  //     await firebase
  //       .firestore()
  //       .collection("conversations")
  //       .where("userOne", "==", firebase.auth().currentUser.uid)
  //       .onSnapshot((snapshot) =>
  //         setconversations(
  //           snapshot.docs.map((doc) => ({
  //             conversationid: doc.id,
  //             userOne: doc.data().userOne,
  //             userTwo: doc.data().userTwo,
  //             timeStamp: doc.data().timeStamp,
  //           }))
  //         )
  //       );

  //     await firebase
  //       .firestore()
  //       .collection("conversations")
  //       .where("userTwo", "==", firebase.auth().currentUser.uid)
  //       .onSnapshot((snapshot) =>
  //         setconversations2(
  //           snapshot.docs.map((doc) => ({
  //             conversationid: doc.id,
  //             userOne: doc.data().userOne,
  //             userTwo: doc.data().userTwo,
  //             timeStamp: doc.data().timeStamp,
  //           }))
  //         )
  //       );
  //     setconversations([]);
  //     setconversations({ ...conversations, ...conversations2 });
  //     // console.log(conversations);

  //     setmessages(null);
  //     await firebase
  //       .firestore()
  //       .collection("messages")
  //       .orderBy("timeStamp")
  //       .onSnapshot((snapshot) =>
  //         setmessages(
  //           snapshot.docs.map((doc) => ({
  //             messageid: doc.id,
  //             text: doc.data().text,
  //             sender: doc.data().sender,
  //             reciever: doc.data().reciever,
  //             timeStamp: doc.data().timeStamp,
  //           }))
  //         )
  //       );
  //     conversations.map(async (conversation) => {
  //       setchatList([]);
  //       if (conversation.userOne == firebase.auth().currentUser.uid) {
  //         await firebase
  //           .firestore()
  //           .collection("users")
  //           .doc(conversation.userTwo)
  //           .get()
  //           .then((snapshot) => {
  //             setchatList((oldarray) => [
  //               ...oldarray,
  //               {
  //                 userid: snapshot.id,
  //                 firstName: snapshot.data().FirstName,
  //                 lastName: snapshot.data().LastName,
  //               },
  //             ]);
  //           });
  //       } else {
  //         await firebase
  //           .firestore()
  //           .collection("users")
  //           .doc(conversation.userOne)
  //           .get()
  //           .then((snapshot) => {
  //             setchatList(...chatList, {
  //               userid: snapshot.id,
  //               firstName: snapshot.data().FirstName,
  //               lastName: snapshot.data().LastName,
  //             });
  //           });
  //       }
  //       console.log(chatList);
  //       setdone(true);
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  function removeDuplicates(data, key) {
    return [...new Map(data.map((item) => [key(item), item])).values()];
  }
  useEffect(() => {
    if (conversations) {
      conversations.map((chat) => {
        console.log(chat);
        if (chat.data.userOne == firebase.auth().currentUser.uid) {
          // console.log(chat.data.userTwo);

          firebase
            .firestore()
            .collection("users")
            .doc(chat.data.userTwo)
            .get()
            .then((snapshot) => {
              setchats((oldarray) => [
                ...oldarray,
                {
                  chatid: chat.id,
                  userid: snapshot.id,
                  firstName: snapshot.data().FirstName,
                  lastName: snapshot.data().LastName,
                },
              ]);
            });
        } else {
          firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
              setchats((oldarray) => [
                ...oldarray,
                {
                  chatid: chat.id,
                  userid: snapshot.id,
                  firstName: snapshot.data().FirstName,
                  lastName: snapshot.data().LastName,
                },
              ]);
            });
        }
      });
    }
    setchats(removeDuplicates(chats, (item) => item.userid));

    return () => {};
  }, [conversations]);
  // useEffect(() => {

  //   // .then((querySnapshot) => {
  //   //   setmessages([]);
  //   //   querySnapshot.forEach((doc) => {
  //   //     var messagen = doc.data();
  //   //     var data = { messageid: doc.id, message: messagen };

  //   //     setmessages((arr) => [...arr, data]);

  //   //     // doc.data() is never undefined for query doc snapshots
  //   //     // console.log(doc.id, " => ", doc.data());
  //   //   });
  //   //   for (var i = 0; i < messages.length; i++) {
  //   //     // console.log(i + "messsage numerberb bdasd basdbasd");
  //   //   }
  //   // })
  // }, []);

  function createChat() {
    // firebase
    //   .firestore()
    //   .collection("users")
    //   .doc(firebase.auth().currentUser.uid)
    //   .collection("conversations")
    //   .doc("3")
    //   .set({
    //     timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     userOne: firebase.auth().currentUser.uid,
    //     userTwo: "vbRz51m1CrM3NJ1bIuRMiWZqqFn2",
    //   });
    // firebase
    //   .firestore()
    //   .collection("users")
    //   .doc("vbRz51m1CrM3NJ1bIuRMiWZqqFn2")
    //   .collection("conversations")
    //   .doc("3")
    //   .set({
    //     timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     userOne: firebase.auth().currentUser.uid,
    //     userTwo: "vbRz51m1CrM3NJ1bIuRMiWZqqFn2",
    //   });
    // setcounter(counter + 1);
    // firebase
    //   .firestore()
    //   .collection("messages")
    //   .add({
    //     text: "message " + counter,
    //     sender: firebase.auth().currentUser.uid,
    //     conversationID: "k3EiqOuYSmolSDHva6tU",
    //     reciever: "4HUuB4Ey19WSyu5Oy3G7liTow8q2",
    //     timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    //   });
  }
  const usersList = () => {
    return array.map((chat) => {
      console.log(chat.chatid);
      return (
        <View key={chat.userid}>
          <ListItem
            onPress={() => {
              navigation.navigate("Chat", {
                userid: chat.userid,
                chatid: chat.chatid,
              });
            }}
          >
            <Left>
              <Thumbnail
                source={{
                  uri: "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png",
                }}
              />
            </Left>
            <Body>
              <Text>{chat.firstName + " " + chat.lastName}</Text>
              <Text note>Someone is having heart attack</Text>
            </Body>
            <Right>
              <Text note>3:50 pm</Text>
            </Right>
          </ListItem>
        </View>
      );
    });
  };
  // console.log(chatList);
  // if (chatList === []) {
  //   return()
  //   setcounter(counter + 1);
  //
  var seenNames = {};

  var array = chats.filter(function (currentObject) {
    if (currentObject.userid in seenNames) {
      return false;
    } else {
      seenNames[currentObject.userid] = true;
      return true;
    }
  });
  if (chats == [] || chats.length == 0 || !conversations) return <View></View>;
  else {
    return (
      <Container>
        <Content>
          <List>
            {usersList()}
            <ListItem>
              <Button onPress={createChat}>
                <Text>this is the counter </Text>
              </Button>
            </ListItem>
          </List>
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
const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    marginBottom: 10,
    alignContent: "center",
    backgroundColor: "rgb(250,91,90)",
  },
});
