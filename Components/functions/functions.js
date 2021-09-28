import firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
//-------------------------getExpoToken by UserID----------------------

export async function getExpoTokenById(id) {
  let userToken;
  await firebase
    .firestore()
    .collection("users")
    .doc(id)
    .get()
    .then((result) => {
      userToken = result.data().ExpoToken;
    })
    .catch((e) => {
      console.log(e);
    });
  return userToken;
}
export const customMapStyle = [
  {
    featureType: "poi.medical",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.attraction",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.government",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.place_of_worship",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.school",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.sports_complex",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];
export const customstyleAcceptedRequests = [
  {
    featureType: "poi.medical",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.attraction",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.government",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.park",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.place_of_worship",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.school",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "poi.sports_complex",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
];
//---------------------------------------------------------------------
export async function createChat(uid, currentUser) {
  let chatAvailable = false;
  let sharedChatid;
  await firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("conversations")
    .where("userid", "==", currentUser.uid)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        chatAvailable = true;
        snapshot.docs.map((chat) => {
          sharedChatid = chat.id;
        });
      }
    });

  await firebase
    .firestore()
    .collection("users")
    .doc(currentUser.uid)
    .collection("conversations")
    .where("userid", "==", uid)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        chatAvailable = true;
        snapshot.docs.map((chat) => {
          sharedChatid = chat.id;
        });
      }
    });
  //if there is no chat already created create one
  if (!chatAvailable) {
    let user = [];
    let chatid;
    await firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          user = snapshot.data();
        } else {
          console.log("does not exist");
        }
      });
    await firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("conversations")
      .add({
        talkingto: user.FirstName + " " + user.LastName,
        userid: uid,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        userOne: {
          firsName: currentUser.FirstName,
          lastName: currentUser.LastName,
          email: currentUser.Email,
        },
        userTwo: {
          firsName: user.FirstName,
          lastName: user.LastName,
          email: user.Email,
        },
        latestMessage: {
          _id: "",
          createdAt: "",
          text: "",
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          chatid: "",
          user: "",
          chatRecepient: "",
          uid: "",
        },
      })
      .then((snapshot) => {
        chatid = snapshot.id;
        sharedChatid = snapshot.id;
      });
    await firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("conversations")
      .doc(chatid)
      .set({
        talkingto: currentUser.FirstName + " " + currentUser.LastName,
        userid: firebase.auth().currentUser.uid,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        userOne: {
          firsName: currentUser.FirstName,
          lastName: currentUser.LastName,
          email: currentUser.Email,
        },
        userTwo: {
          firsName: user.FirstName,
          lastName: user.LastName,
          email: user.Email,
        },
        latestMessage: {
          _id: "",
          createdAt: "",
          text: "",
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          chatid: "",
          user: "",
          chatRecepient: "",
          uid: "",
        },
      });
    await firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update(
        "chats",
        firebase.firestore.FieldValue.arrayUnion({
          chatid: chatid,
          Recepient: uid,
        })
      );
    await firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .update(
        "chats",
        firebase.firestore.FieldValue.arrayUnion({
          chatid: chatid,
          Recepient: firebase.auth().currentUser.uid,
        })
      );
  }
  return sharedChatid;
}
//notification functiions
export async function sendPushNotification(
  expoPushToken,
  Title,
  Body,
  Category
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: Title,
    body: Body,
    data: { category: Category },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
// ----------------------------adding Notifications to firestore--------------------------
export function addNotification(
  RecieverId,
  Body,
  Title,
  Delivered,
  Category,
  SoSuid = ""
) {
  firebase
    .firestore()
    .collection("users")
    .doc(RecieverId)
    .collection("Notifications")
    .add({
      body: Body,
      title: Title,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      delivered: Delivered,
      category: Category,
      SOSuid: SoSuid,
    });
}
//

export async function onPressImage() {
  let result = await ImagePicker.launchImageLibraryAsync();
  if (!result.cancelled) {
    await uploadImage(result.uri, firebase.auth().currentUser.email)
      .then(() => {})
      .catch((error) => {
        alert(error);
      });
    return true;
  }
  return false;
}

export async function uploadImage(uri, imageName) {
  // let firebaseAppDefined = false;

  // setInterval(async () => {
  // if (!firebaseAppDefined) {
  if (firebase.app()) {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("images/" + imageName);

    return ref.put(blob);
  }

  // firebaseAppDefined = true;
  // }
  // }, 500);
}

export const deleteChat = async (uid, chatid) => {
  firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("conversations")
    .doc(chatid)
    .delete();

  firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("conversations")
    .doc(chatid)
    .delete();
  await firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("messages")
    .where("chatid", "==", chatid)
    .get()
    .then((snapshot) => {
      const batch = firebase.firestore().batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      batch.commit();
    });
  await firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("messages")
    .where("chatid", "==", chatid)
    .get()
    .then((snapshot) => {
      const batch = firebase.firestore().batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      batch.commit();
    });
};
