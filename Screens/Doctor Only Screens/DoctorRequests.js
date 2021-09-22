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
} from "../../redux/actions";

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
      });

    await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .collection("requests")
      .doc(request.Requestid)
      .set({ ...request, State: "Accepted" });

    navigation.navigate("CurrentRequest", { requestid: request.Requestid });
    //need to notify other user that their request has been accepted
  };

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
                onPress={() => {
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
  // <Container>
  //   <Content>
  //     <List>
  //       <ListItem itemHeader first style={{ marginBottom: -30 }}>
  //         <Text>Nearby Location Requests</Text>
  //       </ListItem>
  //       <ListItem thumbnail>
  //   <Left>
  //     <Thumbnail
  //       source={{
  //         uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
  //       }}
  //     />
  //   </Left>
  //   <Body style={{ flexDirection: "column" }}>
  //     <Text style={{ fontWeight: "bold" }}>Sherif Mohamed</Text>
  //     <Text>Distance: 2 km</Text>
  //     <Text note numberOfLines={1}>
  //       Accident Type: Bleeding case
  //     </Text>
  //     <View
  //       style={{ flexDirection: "row", justifyContent: "flex-end" }}
  //     >
  //       <Button transparent>
  //         <Icon style={{ marginRight: -10 }} active name="location" />
  //         <Text>Location</Text>
  //       </Button>
  //       <Button transparent>
  //         <Text>Accept</Text>
  //       </Button>
  //       <Button transparent>
  //         <Text style={{ color: "red" }}>Decline</Text>
  //       </Button>
  //     </View>
  //   </Body>
  // </ListItem>

  //       <ListItem itemHeader first style={{ marginBottom: -30 }}>
  //         <Text>Contact Requests</Text>
  //       </ListItem>

  //       <ListItem thumbnail>
  //         <Left>
  //           <Thumbnail
  //             source={{
  //               uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
  //             }}
  //           />
  //         </Left>
  //         <Body style={{ flexDirection: "column" }}>
  //           <Text style={{ fontWeight: "bold" }}>Ahmed Mohamed</Text>
  //           <Text note numberOfLines={2}>
  //             Accident Type: Burn case
  //           </Text>
  //           <Item>
  //             <Button
  //               transparent
  //               onPress={() => navigation.navigate("DoctorChat")}
  //             >
  //               <Text>Accept</Text>
  //             </Button>
  //             <Button transparent>
  //               <Text style={{ color: "red" }}>Decline</Text>
  //             </Button>
  //           </Item>
  //         </Body>
  //       </ListItem>

  //       <ListItem thumbnail>
  //         <Left>
  //           <Thumbnail
  //             source={{
  //               uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
  //             }}
  //           />
  //         </Left>
  //         <Body style={{ flexDirection: "column" }}>
  //           <Text style={{ fontWeight: "bold" }}>Abdullah Ahmed</Text>
  //           <Text note numberOfLines={2}>
  //             Accident Type: Cut case
  //           </Text>
  //           <Item>
  //             <Button
  //               transparent
  //               onPress={() => navigation.navigate("DoctorChat")}
  //             >
  //               <Text>Accept</Text>
  //             </Button>
  //             <Button transparent>
  //               <Text style={{ color: "red" }}>Decline</Text>
  //             </Button>
  //           </Item>
  //         </Body>
  //       </ListItem>
  //     </List>
  //   </Content>
  // </Container>
};

export default DoctorRequests;
