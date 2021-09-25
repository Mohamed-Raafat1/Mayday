import firebase from "firebase";

import { Geofirestore } from "../../App";
require("firebase/firestore");
import {
  USER_CHATLIST_CHANGE,
  USER_CHAT_CHANGE,
  USER_MESSAGES_CHANGE,
  USER_STATE_CHANGE,
  USER_MESSAGES_UPDATE,
  USER_NOTIFICATIONS_CHANGE,
  REQUEST_STATE_CHANGE,
  DOCTOR_REQUEST_CHANGE,
  ACCEPTED_REQUEST_CHANGE,
} from "../constants";

export function fetchUser() {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          dispatch({
            type: USER_STATE_CHANGE,
            currentUser: snapshot.data(),
          });
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
      // .where("delivered", "==", false)
      .orderBy("createdAt", "desc")
      .get()
      .then((snapshot) => {
        let notifications = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;

          return { userid: firebase.auth().currentUser.uid, id, data };
        });
        dispatch({
          type: USER_NOTIFICATIONS_CHANGE,
          currentNotifications: notifications,
        });
      });

    // to see new notifications only
    // (set all notifications delivered == true after eachtime we open notifications screen)
    //alg for setting delivered for loop untill delivered == true stop descendingly with createdAt
    //firebase.firestore.FieldValue.serverTimestamp()
  };
}
//===========================================================

export function fetchAcceptedRequest(requestid) {
  return async (dispatch) => {
    let done = false;
    let query = firebase
      .firestore()
      .collection("requests")
      .doc(requestid)
      .onSnapshot((snapshot) => {
        if (snapshot) {
          let data = snapshot.data();
          data = { ...data };
          let id = snapshot.id;

          if (data.State == "Done") done = true;

          dispatch({
            type: ACCEPTED_REQUEST_CHANGE,
            AcceptedRequest: {
              ...data,
              id,
            },
          });
        } else {
          console.log("does not exist");
        }
      });
    if (done) return query;
  };
}
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
            currentRequest: {
              ...data,
              id,
            },
          });
        } else {
          console.log("does not exist");
        }
      });
  };
}
// function to fetch nearby requests
// due to the fact that users location keeps changing we need to create a task to keep searching for nearby reqests
// this needs to happen even when the medical professional is on the move
// so create a background task for the app that keeps updating the requests, based on the current location

export function fetchStaticRequests(lat, lng, distance) {
  return async (dispatch) => {
    await Geofirestore.collection("requests")
      .near({
        center: new firebase.firestore.GeoPoint(lat, lng),
        radius: distance,
      })
      .where("State", "==", "Pending")
      .get()
      .then((snapshot) => {
        let Requests = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          const distance = doc.distance;
          return {
            ...data,
            Requestid: id,
            distance: distance,
          };
        });
        dispatch({ type: DOCTOR_REQUEST_CHANGE, Requests });
      });
  };
}

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
    firebase
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
    firebase
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
    firebase
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

    dispatch({
      type: USER_MESSAGES_UPDATE,
      payload: null,
    });
  };
}
export function fetchMessages(id, chatid) {
  return async (dispatch) => {
    var query = await firebase
      .firestore()
      .collection("users")
      .doc(id)
      .collection("messages")
      .where("chatid", "==", chatid)
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
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

        dispatch({
          type: USER_MESSAGES_CHANGE,
          messages,
        });
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
          return {
            userid: firebase.auth().currentUser.uid,
            id,
            data,
          };
        });
        dispatch({
          type: USER_CHATLIST_CHANGE,
          conversations,
        });
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
        dispatch({
          type: USER_CHAT_CHANGE,
          currentchatList: snapshot.docs,
        });
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
        dispatch({
          type: USER_CHAT_CHANGE,
          currentchatList: conversations,
        });
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
