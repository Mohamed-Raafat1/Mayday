import firebase from "firebase";
import { useState } from "react";
import { SnapshotViewIOS } from "react-native";
require("firebase/firestore");
import {
  USER_CHATLIST_CHANGE,
  USER_CHAT_CHANGE,
  USER_MESSAGES_CHANGE,
  USER_STATE_CHANGE,
  USER_MESSAGES_UPDATE,
} from "../constants";

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("does not exist");
        }
      });
  };
}

export function updateMessages(message, sender, reciever, chatid) {
  console.log("i am updatingf---------------------------------------------");
  console.log(message, sender, reciever, chatid);
  console.log("i am updatingf---------------------------------------------");
  return async (dispatch) => {
    await firebase
      .firestore()
      .collection("users")
      .doc(sender)
      .collection("messages")
      .doc(message._id)
      .set({
        _id: message._id,
        createdAt: String(message.createdAt),
        text: message.text,
        chatid: chatid,
        user: message.user,
        chatRecepient: reciever,
        uid: sender,
      });
    await firebase
      .firestore()
      .collection("users")
      .doc(reciever)
      .collection("messages")
      .doc(message._id)
      .set({
        _id: message._id,
        createdAt: String(message.createdAt),
        text: message.text,
        chatid: chatid,
        user: message.user,
        chatRecepient: reciever,
        uid: reciever,
      });
    let payloadmessage = {
      _id: message._id,
      text: message.text,
      createdAt: String(message.createdAt),
      user: message.user,
    };
    console.log("does this work???????????????????????????????");
    console.log(payloadmessage);
    console.log("does this work???????????????????????????????");
    dispatch({ type: USER_MESSAGES_UPDATE, payload: null });
  };
}
export function fetchMessages(id, chatid) {
  return async (dispatch) => {
    var query = await firebase
      .firestore()
      .collectionGroup("messages")
      .where("uid", "==", id)
      .orderBy("createdAt", "desc");

    await query.where("chatid", "==", chatid).onSnapshot((snapshot) => {
      snapshot.docs.map((dummy) => {
        console.log(
          "dummyyyyyy--------------------------------\n",
          dummy.data()
        );
      });
      let messages = snapshot.docs.map((doc) => {
        const data = doc.data();
        const id = doc.id;
        return {
          _id: data._id,
          text: data.text,
          createdAt: data.createdAt,
          user: {
            _id: data.user._id,
            name: data.user.name,
          },
        };
        //shet
      });
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

      // console.log(messages);
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

      dispatch({ type: USER_MESSAGES_CHANGE, messages });
    });
  };
}
// export function fetchMessages(id) {
//   return (dispatch) => {
//     firebase
//       .firestore()
//       .collection("users")
//       .doc(firebase.auth().currentUser.uid)
//       .collection("messages")
//       .where(' chatid', '==', id)
//       // .orderBy("createdAt", "asc")
//       .get()
//       .then((snapshot) => {
//         let messages = snapshot.docs.map((doc) => {
//           const data = doc.data();
//           const id = doc.id;
//           return { id, data };
//         });
//         dispatch({ type: USER_MESSAGES_CHANGE, messages });
//       });
//   };
// }
export function fetchConversations() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("conversations")
      .orderBy("timeStamp", "asc")
      .onSnapshot((snapshot) => {
        let conversations = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { userid: firebase.auth().currentUser.uid, id, data };
        });
        dispatch({ type: USER_CHATLIST_CHANGE, conversations });
      });
  };
}
export function fetchChatList() {
  var chatList = [];
  var conversations = [];

  return (dispatch) => {
    firebase
      .firestore()
      .collection("conversations")
      .where("userOne", "==", firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          conversations.concat({
            conversationid: doc.id,
            userOne: doc.data().userOne,
            userTwo: doc.data().userTwo,
            timeStamp: doc.data().timeStamp,
          });
        });
        dispatch({ type: USER_CHAT_CHANGE, currentchatList: snapshot.docs });
      });

    firebase
      .firestore()
      .collection("conversations")
      .where("userTwo", "==", firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) =>
          conversations.concat({
            conversationid: doc.id,
            userOne: doc.data().userOne,
            userTwo: doc.data().userTwo,
            timeStamp: doc.data().timeStamp,
          })
        );
        dispatch({ type: USER_CHAT_CHANGE, currentchatList: conversations });
      });

    conversations.map((conversation) => {
      if (conversation.userOne == firebase.auth().currentUser.uid) {
        // console.log(conversation.userOne);
        firebase
          .firestore()
          .collection("users")
          .doc(conversation.userTwo)
          .get()
          .then((snapshot) => {
            chatList.push({
              userid: snapshot.id,
              firstName: snapshot.data().FirstName,
              lastName: snapshot.data().LastName,
            });
          });
      } else {
        firebase
          .firestore()
          .collection("users")
          .doc(conversation.userOne)
          .get()
          .then((snapshot) => {
            chatList.push({
              userid: snapshot.id,
              firstName: snapshot.data().FirstName,
              lastName: snapshot.data().LastName,
            });
          });
      }
    });
  };
}
