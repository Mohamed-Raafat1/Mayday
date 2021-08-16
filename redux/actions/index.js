import firebase from "firebase";
import { useState } from "react";
require("firebase/firestore");
import {
  USER_CHATLIST_CHANGE,
  USER_CHAT_CHANGE,
  USER_MESSAGES_CHANGE,
  USER_STATE_CHANGE,
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
export function fetchMessages(id) {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("messages")
      .where(" chatid", "==", id)
      .orderBy("createdAt", "asc")
      .get()
      .then((snapshot) => {
        let messages = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, data };
        });
        dispatch({ type: USER_MESSAGES_CHANGE, messages });
      });
  };
}
export function fetchConversations() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("conversations")
      .orderBy("timeStamp", "asc")
      .get()
      .then((snapshot) => {
        let conversations = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, data };
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
