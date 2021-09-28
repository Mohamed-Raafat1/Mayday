import { Button, Text } from "native-base";
import React, { useEffect, useLayoutEffect } from "react";
import { Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserbyID } from "../redux/actions/index";

function Notif2location({ route, navigation }) {
  const userid = route.params.userid;
  const dispatch = useDispatch();
  const otherUser = useSelector((state) => state.userState.otherUser);
  useLayoutEffect(() => {
    const unsubscribe = dispatch(fetchUserbyID(userid));
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    console.log("asdasdasd", otherUser, "\nuser iddddddddddd", userid);
    return () => {};
  }, [otherUser]);
  return (
    <Button
      transparent
      onPress={() => {
        // let coords = await firebase
        //   .firestore()
        //   .collection("users")
        //   .doc(item.data.SOSuid)
        //   .get()
        //   .then((snapshot) => {});
        Linking.openURL(
          "https://www.google.com/maps/dir/?api=1&destination=" +
            otherUser.coordinates.latitude +
            "," +
            otherUser.coordinates.longitude
        );
      }}
    >
      <Text>View current location</Text>
    </Button>
  );
}

export default Notif2location;
