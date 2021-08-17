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
import {
  fetchChatList,
  fetchConversations,
  fetchMessages,
  fetchUser,
} from "../redux/actions";
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
    dispatch(fetchUser());
  }, []);
  const [chats, setchats] = useState([]);

  const conversations = useSelector((state) => state.userState.conversations);

  const currentUser = useSelector((state) => state.userState.currentUser);

  const [counter, setcounter] = useState(0);
  console.log(conversations);
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
    // if (conversations) {
    //   conversations.map((chat) => {
    //     console.log(chat);
    //     console.log(firebase.auth().currentUser.uid);
    //     console.log(chat.data.userTwo == firebase.auth().currentUser.uid);
    //     if (chat.data.userOne == String(firebase.auth().currentUser.uid)) {
    //       // console.log(chat.data.userTwo);

    //       firebase
    //         .firestore()
    //         .collection("users")
    //         .doc(chat.data.userTwo)
    //         .get()
    //         .then((snapshot) => {
    //           setchats((oldarray) => [
    //             ...oldarray,
    //             {
    //               chatid: chat.id,
    //               userid: snapshot.id,
    //               firstName: snapshot.data().FirstName,
    //               lastName: snapshot.data().LastName,
    //             },
    //           ]);
    //         });
    //     } else {
    //       firebase
    //         .firestore()
    //         .collection("users")
    //         .doc(chat.data.userOne)
    //         .get()
    //         .then((snapshot) => {
    //           setchats((oldarray) => [
    //             ...oldarray,
    //             {
    //               chatid: chat.id,
    //               userid: snapshot.id,
    //               firstName: snapshot.data().FirstName,
    //               lastName: snapshot.data().LastName,
    //             },
    //           ]);
    //         });
    //     }
    //   });
    // }
    // setchats(removeDuplicates(chats, (item) => item.userid));

    return () => {};
  }, []);
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

  async function createChat() {
    // let uid = "TAEKUkBficSNBJ7nIfJlJB5VPLM2";
    // let user = [];
    // await firebase
    //   .firestore()
    //   .collection("users")
    //   .doc(uid)
    //   .get()
    //   .then((snapshot) => {
    //     if (snapshot.exists) {
    //       user = snapshot.data();
    //     } else {
    //       console.log("does not exist");
    //     }
    //   });
    // await firebase
    //   .firestore()
    //   .collection("users")
    //   .doc(firebase.auth().currentUser.uid)
    //   .collection("conversations")
    //   .doc(firebase.auth().currentUser.uid + uid)
    //   .set({
    //     talkingto: user.FirstName + " " + user.LastName,
    //     userid: uid,
    //     timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     userOne: {
    //       firsName: currentUser.FirstName,
    //       lastName: currentUser.LastName,
    //       email: currentUser.Email,
    //     },
    //     userTwo: {
    //       firsName: user.FirstName,
    //       lastName: user.LastName,
    //       email: user.Email,
    //     },
    //   });
    // await firebase
    //   .firestore()
    //   .collection("users")
    //   .doc(uid)
    //   .collection("conversations")
    //   .doc(firebase.auth().currentUser.uid + uid)
    //   .set({
    //     talkingto: currentUser.FirstName + " " + currentUser.LastName,
    //     userid: firebase.auth().currentUser.uid,
    //     timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    //     userOne: {
    //       firsName: currentUser.FirstName,
    //       lastName: currentUser.LastName,
    //       email: currentUser.Email,
    //     },
    //     userTwo: {
    //       firsName: user.FirstName,
    //       lastName: user.LastName,
    //       email: user.Email,
    //     },
    //   });
  }
  const usersList = () => {
    return conversations.map((chat) => {
      return (
        <ListItem
          key={chat.id}
          onPress={() => {
            dispatch(fetchMessages(firebase.auth().currentUser.uid, chat.id));
            navigation.navigate("Chat", {
              userid: chat.data.userid,
              chatid: chat.id,
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
            <Text>{chat.data.talkingto}</Text>
            <Text note>Someone is having heart attack</Text>
          </Body>
          <Right>
            <Text note>3:50 pm</Text>
          </Right>
        </ListItem>
      );
    });
  };
  // console.log(chatList);
  // if (chatList === []) {
  //   return()
  //   setcounter(counter + 1);
  //
  var seenNames = {};

  if (!conversations)
    return (
      <View>
        <Button onPress={createChat}>
          <Text>this is the counter </Text>
        </Button>
      </View>
    );
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
