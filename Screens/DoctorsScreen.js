import React, { useState, useEffect } from 'react';
import MapView from "react-native-maps";

import { StyleSheet, Dimensions } from "react-native";
import { Container, Header, Button, View, Text, Content, Spinner, Left, Body, Right, Toast } from "native-base";
import { Avatar, Title } from "react-native-paper";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, fetchRequest } from "../redux/actions";

function DoctorsScreen() {

  //=============================CONSTANTS=========================================================
  const [isLoading, setIsLoading] = useState(false); // do we show spinner or show screen
  const [isRequested, setisReqeuested] = useState(false)  //state of request (is button pressed or not?)
  const [RequestID, setRequestID] = useState(null)

  const currentUser = useSelector((state) => state.userState.currentUser);
  const currentRequest = useSelector((state) => state.requestState.currentRequest);

  const dispatch = useDispatch();
  //=====================================================================================================


  //Done on mount
  useLayoutEffect(() => {
    dispatch(fetchRequest(RequestID))
    dispatch(fetchUser());
  }, []);



  if (currentUser == undefined)
    return (
      <View style={{ justifyContent: "space-evenly" }}>
        <Text>user undefined</Text>
      </View>
    );

  if (currentRequest == null)
    return (
      <View style={{ justifyContent: "space-evenly" }}>
        <Text>request undefined</Text>
      </View>
    );


  {/*if u want to make button call the loading:
const apiCall = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };*/}

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  // }, []);

  // Toast.show({
  //   text: error.message,
  //   duration: 2000,
  // });


  //this is big part of create request and send it and set loading to true till a doctor accepts request (for now spinner waits only for 2 seconds then shows doctor)
  async function SendRequest() {

    let id = await firebase
      .firestore()
      .collection("requests")
      .add({
        AccidentType: "",
        DoctorID: "",
        Location: currentUser.loc,
        PatientID: currentUser.uid,
        RequestType: 'Location',
        State: 'Pending',
      })
      .catch((error) => {
        Toast.show({
          text: error.message,
          duration: 2000,
        });
        console.log(error);
      });


    setRequestID(id)
    setisReqeuested(true)

    setIsLoading(true)

    //this part is just for testing until we can receive requests
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

  }


  useEffect(() => {
    if (isRequested === true) {
      // dispatch(fetchRequest(RequestID))
    }
  }, [isRequested])




  let screen;
  if (isLoading) {
    screen = (
      <View>
        <Spinner color='red' />
      </View>
    );
  } else if (isRequested) {
    screen = (
      <View style={{ flex: 1, width: "100%" }}>
        <MapView
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.045,
            longitudeDelta: 0.045,
          }}
          showsUserLocation={true}
          userLocationUpdateInterval={5000}
          followsUserLocation={true}
          showsCompass={true}
          showsMyLocationButton={true}
          showsPointsOfInterest={true}
          loadingEnabled={true}
          loadingIndicatorColor="blue"
          style={{ width: "100%", flex: 1 }}
        />
        <Button
          style={[styles.button, { alignSelf: "center" }]}
          onPress={() => {
            console.log("------------------pressed-------------");
            //       // await terminationFn.remove()
            //       // fcn()
            StopTracking();
          }}
        >
          <Text>Stop Tracking</Text>
        </Button>
      </View>
    );
  } else {
    screen = (
      <View style={styles.View}>
        <Button
          onPress={SendRequest}
          style={styles.button}
          primary
          iconRight
          rounded
        >
          <Text>Request Doctor</Text>
        </Button>
      </View>
    );
  }



  return (

    <Container style={styles.container}>

      <Content >
        {screen}
      </Content>
    </Container>
  );
}

export default DoctorsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    alignItems: "center",
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 3,
    marginBottom: 5,
    textAlign: "center",
  },
  button: {
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "rgb(250,91,90)",
    shadowColor: "rgba(0, 0, 255, 255)",
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 100, height: 100 },
    elevation: 10,
  },
  View: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
});





{/*      
        {isLoading ? (<Spinner />) : (

          <View>
            <MapView style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height / 2,
            }}
              initialRegion={{
                latitude: 30.0930721,
                longitude: 31.3298159,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
              }}
              mapType={"standard"}
            >
              <MapView.Marker
                coordinate={{
                  latitude: 30.0930721,
                  longitude: 31.3298159
                }}
                title={"title"}
                description={"description"}
              />
            </MapView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, marginBottom: 15 }}>
              <Left>
                <Text style={{ fontSize: 18, color: "#777777", marginLeft: 15 }}>Nearest Hospital:{"\n"}<Text style={{ fontSize: 18, color: "#777777", fontWeight: "bold" }}>5 Mins Away</Text></Text>
              </Left>
              <Body>
                <Text style={{ fontSize: 18, color: "#777777", marginLeft: 15 }}>Location:{"\n"}<Text style={{ fontSize: 18, color: "#777777", fontWeight: "bold" }}>Masr El Gedida</Text></Text>
              </Body>
              <Right>
                <Text style={{ fontSize: 18, color: "#777777", marginLeft: 15 }}>Name:{"\n"}<Text style={{ fontSize: 18, color: "#777777", fontWeight: "bold" }}>Cleopatra Hospital</Text></Text>
              </Right>
            </View>
            <View>
              <View style={styles.avatar}>
                <Avatar.Image
                  source={{
                    uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
                  }}
                  size={80}
                />
              </View>

              <View>
                <Title style={styles.title}>Dr Ahmed Samir</Title>
              </View>
            </View>
          </View>
        )} */}



{/* if you want to activate request doctor with button
         <Button 
        rounded  
        style={{marginTop: 10, backgroundColor: "rgb(250,91,90)"}}>
          <Text>Request Doctor</Text>
        </Button> */}

{/*add a spinner once you open the screen*/ }