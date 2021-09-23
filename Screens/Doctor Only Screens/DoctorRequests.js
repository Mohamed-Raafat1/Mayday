import React, { useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  Container,
  Content,
  List,
  Icon,
  ListItem,
  Left,
  Button,
  Right,
  Body,
  View,
  Thumbnail,
  Item,
} from "native-base";
import { useDispatch, useSelector } from "react-redux";
import RequestAcceptedScreen from "./RequestAcceptedScreen";
import {
  fetchRequest,
  fetchUser,
  fetchStaticRequests,
  fetchAcceptedRequest,
} from "../../redux/actions";
let sharedChatid;

import firebase from "firebase";
import * as geofirestore from "geofirestore";

let Requests = [];

const DoctorRequests = ({ navigation }) => {
  // Create a Firestore reference
  const firestore = firebase.firestore();

  // Create a GeoFirestore reference
  const GeoFirestore = geofirestore.initializeApp(firestore);

  // Create a GeoCollection reference

  const currentUser = useSelector((state) => state.userState.currentUser);
  Requests = useSelector((state) => state.userState.Requests);
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      dispatch(
        fetchStaticRequests(
          currentUser.g.geopoint.latitude,
          currentUser.g.geopoint.longitude,
          1000
        )
      );

      return () => {};
    }, [])
  );
  useEffect(() => {
    dispatch(fetchUser());

    return () => {};
  }, []);
  const AcceptRequest = async (request) => {
    await firebase
      .firestore()
      .collection("requests")
      .doc(request.Requestid)
      .update({
        State: "Accepted",
        DoctorID: currentUser.uid,
        DoctorGeoHash: currentUser.geohash,
        DoctorCoordinates: currentUser.coordinates,
        chatid: sharedChatid,
      });
    await firebase.firestore().collection("users").doc(currentUser.uid).update({
      currentRequest: request,
    });
    await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .collection("requests")
      .doc(request.Requestid)
      .set({ ...request, State: "Accepted", current: true });
    await dispatch(fetchAcceptedRequest(request.Requestid));
    navigation.navigate("CurrentRequest", {
      requestid: request.Requestid,
      chatid: sharedChatid,
    });

    //need to notify other user that their request has been accepted
  };
  async function createChat(uid) {
    let chatAvailable = false;
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
  }
  const RequestsList = () => {
    return Requests.map((request) => {
      return (
        <ListItem thumbnail key={request.Requestid}>
          <Left>
            <Thumbnail
              source={{
                uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
              }}
            />
          </Left>
          <Body style={{ flexDirection: "column" }}>
            <Text style={{ fontWeight: "bold" }}>
              {request.PatientFirstName + " " + request.PatientLastName}
            </Text>
            <Text>Distance: {request.distance}</Text>
            <Text note numberOfLines={1}>
              Accident Type: Bleeding case
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <Button transparent>
                <Icon style={{ marginRight: -10 }} active name="location" />
                <Text>Location</Text>
              </Button>
              <Button
                onPress={async () => {
                  await createChat(request.PatientID);
                  AcceptRequest(request);
                }}
                transparent
              >
                <Text>Accept</Text>
              </Button>
              <Button transparent>
                <Text style={{ color: "red" }}>Decline</Text>
              </Button>
            </View>
          </Body>
        </ListItem>
        /*  <View key={request.Requestid}>
          <Text>
            {" "}
            {request.PatientFirstName + " " + request.PatientLastName}
          </Text>
        </View> */
      );
    });
  };

  if (Requests.length === 0) return <View></View>;
  else {
    return (
      <Container>
        <Content>
          <List>
            <ListItem itemHeader first style={{ marginBottom: -30 }}>
              <Text> Nearby Location Requests</Text>
            </ListItem>
            {RequestsList()}
          </List>
        </Content>
      </Container>
    );
  }
};

export default DoctorRequests;
