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
  USER_NOTIFICATIONS_CHANGE,
  REQUEST_STATE_CHANGE,
} from "../constants";

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() });
        } else {
          console.log("does not exist");
        }
      });
  };
}
//--------under construction-----------------------
export function fetchNotifications() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("Notifications")
      .orderBy("createdAt", "desc")
      // .where("delivered","==",true)
      // to see new notifications only
      // (set all notifications delivered == true after eachtime we open notifications screen)
      //alg for setting delivered for loop untill delivered == true stop descendingly with createdAt
      //firebase.firestore.FieldValue.serverTimestamp()
      .onSnapshot((snapshot) => {
        let notifications = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { userid: firebase.auth().currentUser.uid, id, data };
        });
        dispatch({ type: USER_NOTIFICATIONS_CHANGE, notifications });
      });
  };
}
//===========================================================

export function fetchRequest(id) {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("requests")
      .doc(id)
      .onSnapshot((snapshot) => {
        if (snapshot) {
          let data = snapshot.data();

          dispatch({
            type: REQUEST_STATE_CHANGE,
            currentRequest: { ...data, id },
          });
        } else {
          console.log("does not exist");
        }
      });
  };
}

// Badawi woooork

// export function fetchEmergencyContacts(){
//   return (dispatch) => {
//     firebase
//       .firestore()
//       .collection("users")
//       .doc(firebase.auth().currentUser.uid)
//       .collection("EmergencyContacts")
//       .onSnapshot((snapshot) => {
//         if (snapshot.exists) {
//           dispatch({ type: EMERGENCY_CONTACTS_CHANGE, emergencyContacts: snapshot.data() });
//         } else {
//           console.log("does not exist");
//         }
//       });
//   }
// }

export function updateMessages(message, sender, reciever, chatid) {
  // console.log("i am updatingf---------------------------------------------");
  // console.log(message, sender, reciever, chatid);
  // console.log("i am updatingf---------------------------------------------");
  return async (dispatch) => {
    let messageid;
    await firebase
      .firestore()
      .collection("users")
      .doc(sender)
      .collection("messages")

      .add({
        _id: message._id,
        createdAt: String(message.createdAt),
        text: message.text,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        chatid: chatid,
        user: message.user,
        chatRecepient: reciever,
        uid: sender,
      })
      .then((snapshot) => {
        messageid = snapshot.id;
      });
    await firebase
      .firestore()
      .collection("users")
      .doc(reciever)
      .collection("messages")
      .doc(messageid)
      .set({
        _id: message._id,
        createdAt: String(message.createdAt),
        text: message.text,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        chatid: chatid,
        user: message.user,
        chatRecepient: reciever,
        uid: reciever,
      });
    await firebase
      .firestore()
      .collection("users")
      .doc(sender)
      .collection("conversations")
      .doc(chatid)
      .update({
        latestMessage: {
          _id: message._id,
          createdAt: String(message.createdAt),
          text: message.text,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          chatid: chatid,
          user: message.user,
          chatRecepient: reciever,
          uid: sender,
        },
      });
    await firebase
      .firestore()
      .collection("users")
      .doc(reciever)
      .collection("conversations")
      .doc(chatid)
      .update({
        latestMessage: {
          _id: message._id,
          createdAt: String(message.createdAt),
          text: message.text,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          chatid: chatid,
          user: message.user,
          chatRecepient: reciever,
          uid: reciever,
        },
      });
    let payloadmessage = {
      _id: message._id,
      text: message.text,
      createdAt: String(message.createdAt),
      user: message.user,
    };

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
      snapshot.docs.map((dummy) => {});
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
      .orderBy("latestMessage.createdAt", "desc")
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
