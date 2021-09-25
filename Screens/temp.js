import React from "react";
import { View, Text, Button } from "react-native";

import firebase from "firebase";
import { result } from "lodash";
import { useEffect, useLayoutEffect } from "react";
const geofire = require("geofire-common");

import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions";
import { Geofirestore } from "../App";

const temp = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);

  //Done everytime u navigate to the screen
  useLayoutEffect(() => {
    const Unsubscribe =
      //Fetch user regardless of permission granted or not
      dispatch(fetchUser());

    return () => {
      Unsubscribe()
    }
  }, []);

  useEffect(() => {
    const query = firebase
      .firestore()
      .collection("locations")
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.exists) {
          let locations = querySnapshot.docs.map((doc) => {
            let data = doc.data();
            console.log(data);
            let _id = doc.id;
            return {
              _id,
              data,
            };
          });
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  const getNearMe = () => {
    const query = Geofirestore.collection("locations").near({
      center: new firebase.firestore.GeoPoint(30.0641549, 31.2038198),
      radius: 1000,
    });
    query.onSnapshot((snapshot) => {
      console.log(snapshot.docs[0].data());
    });
    // let loc = currentUser.location;
    // let longitude = loc.longitude;
    // let latitude = loc.latitude;

    // const center = [latitude, longitude];
    // const radiusInM = 50 * 1000;

    // // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
    // // a separate query for each pair. There can be up to 9 pairs of bounds
    // // depending on overlap, but in most cases there are 4.
    // const bounds = geofire.geohashQueryBounds(center, radiusInM);
    // const promises = [];
    // for (const b of bounds) {
    //   const q = firebase
    //     .firestore()
    //     .collection("locations")
    //     .orderBy("geohash")
    //     .startAt(b[0])
    //     .endAt(b[1]);

    //   promises.push(q.get());
    // }

    // // Collect all the query results together into a single list
    // Promise.all(promises)
    //   .then((snapshots) => {
    //     const matchingDocs = [];

    //     for (const snap of snapshots) {
    //       for (const doc of snap.docs) {
    //         const lat = doc.get("lat");
    //         const lng = doc.get("lng");

    //         // We have to filter out a few false positives due to GeoHash
    //         // accuracy, but most will match
    //         const distanceInKm = geofire.distanceBetween([lat, lng], center);
    //         console.log(distanceInKm);
    //         const distanceInM = distanceInKm * 1000;
    //         if (distanceInM <= radiusInM) {
    //           matchingDocs.push(doc);
    //         }
    //       }
    //     }

    //     return matchingDocs;
    //   })
    //   .then((matchingDocs) => {
    //     console.log("iam here");
    //     console.log(matchingDocs);
    //     // const jsonContent = JSON.stringify(matchingDocs);
    //     matchingDocs.map((doc) => {
    //       let id = doc.id;
    //       let data = doc.data();
    //       let object = { ...data, id };
    //       console.log("this is the data--------------------", object);
    //     });

    //     // ...
    //   })
    //   .catch((error) => console.log(error));
  };
  return (
    <View style={{ flex: 1, alignContent: "center", alignItems: "center" }}>
      <Text>this is some textaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
      <Button
        title="Generate Location in firestore"
        onPress={() => {
          const lat = 30.0641549;
          const lng = 31.2038198;
          const hash = geofire.geohashForLocation([lat, lng]);

          Geofirestore.collection("locations").add({
            coordinates: new firebase.firestore.GeoPoint(lat, lng),
          });
        }}
      ></Button>
      <Button title="Get NearBy locations" onPress={() => getNearMe()}></Button>
    </View>
  );
};

export default temp;
