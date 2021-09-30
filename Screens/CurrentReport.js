import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import firebase from "firebase";
import {
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Form,
  Input,
  Item,
  Label,
  Spinner,
  Text,
  Toast,
  View,
} from "native-base";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import { useSelector } from "react-redux";

function CurrentReport({ navigation, route }) {
  const currentUser = useSelector((state) => state.userState.currentUser);
  let reportid = "";
  if (route.params) reportid = route.params.reportid;
  console.log(reportid);

  let currentRequest = null;

  //if user made the request and viewing the current report
  if (!reportid)
    currentRequest = useSelector((state) => state.requestState.currentRequest);

  const [Report, setReport] = useState(null);
  const [Condition, setCondition] = useState(null);
  // console.log("this is the current request", currentUser.uid, currentRequest);

  const [Selected, setSelected] = useState("Nothing Selected");

  //update the report in the firestore
  const UpdateReport = () => {
    firebase.firestore().collection("requests").doc(currentRequest.id).update({
      Condition: Condition,
    });
    Toast.show({ text: "Report Updated" });
  };

  useEffect(() => {
    if (currentRequest) {
      setReport(currentRequest);
    }
  }, [currentRequest]);

  useLayoutEffect(() => {
    if (reportid)
      firebase
        .firestore()
        .collection("requests")
        .doc(reportid)
        .get()
        .then((snapshot) => {
          console.log("sdsdsd0", snapshot.data());
          setReport(snapshot.data());
        });
  }, []);

  //REMEMBER need to apply all the other conditions (with dr, without dr, self patient, other patient)
  if (Report)
    return (
      <Container>
        <Content>
          <Card style={styles.Card}>
            <CardItem header style={styles.CardItem}>
              <Avatar.Image
                source={{
                  uri: Report.PatientPhotoURI
                    ? Report.PatientPhotoURI
                    : "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
                }}
                size={80}
              />

              {/* <MaterialCommunityIcons
                name="account-outline"
                size={30}
                color="black"
              /> */}
              <Text style={styles.Title}>Patient Details</Text>
            </CardItem>

            <Form>
              <Item stackedLabel style={styles.Item}>
                <Label>Patient Name</Label>
                <Input disabled>
                  {Report.PatientFirstName + " " + Report.PatientLastName}
                </Input>
              </Item>

              <Item floatingLabel last style={styles.Item}>
                <Label>Condition</Label>
                <Input onChangeText={setCondition}>{Report.Condition}</Input>
              </Item>
            </Form>
          </Card>

          <Card style={styles.Card}>
            <CardItem header style={styles.CardItem2}>
              <Ionicons name="medical" size={30} color="black" />
              <Text style={styles.Title}>Medical History</Text>
            </CardItem>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 18, color: "#777777" }}>
                HEIGHT{"\n"}
                <Text>{Report.PatientMedicalID.Height} cm</Text>
              </Text>
              <Text style={{ fontSize: 18, color: "#777777" }}>
                WEIGHT{"\n"}
                <Text>{Report.PatientMedicalID.Weight} Kg</Text>
              </Text>
              <Text style={{ fontSize: 18, color: "#777777" }}>
                BLOOD TYPE{"\n"}
                <Text>{Report.PatientMedicalID.BloodType}</Text>
              </Text>
            </View>

            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 0.5,
                marginTop: 20,
              }}
            />

            <View style={{ marginBottom: 15 }}>
              <Text style={styles.medicalIDItem}>MEDICAL CONDITIONS</Text>
              <Text style={styles.medicalIdData}>
                {Report.PatientMedicalID.MedicalConditions}
              </Text>
              <Text style={styles.medicalIDItem}>ALLERGIES</Text>
              <Text style={styles.medicalIdData}>
                {Report.PatientMedicalID.Allergies}
              </Text>
              <Text style={styles.medicalIDItem}>MEDICATIONS</Text>
              <Text style={styles.medicalIdData}>
                {Report.PatientMedicalID.Medications}
              </Text>
            </View>
          </Card>

          <Card style={styles.Card}>
            <CardItem header style={styles.CardItem3}>
              <Avatar.Image
                source={{
                  uri: Report.DoctorPhotoURI
                    ? Report.DoctorPhotoURI
                    : "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
                }}
                size={80}
              />
              <Text style={styles.Title}>Medical Support Details</Text>
            </CardItem>

            <Form style={styles.Form}>
              <Item stackedLabel style={styles.Item}>
                <Label>Contacted Doctor Name</Label>
                <Input disabled>
                  {Report.DoctorFirstName + " " + Report.DoctorLastName}
                </Input>
              </Item>

              {/* <Item floatingLabel last style={styles.Item}>
                <Label>Hospital Name</Label>
                <Input />
              </Item> */}

              {/* <Item floatingLabel last style={styles.Item}>
                <Label>Ambulance Current State</Label>
                <Input />
              </Item> */}
            </Form>
          </Card>

          <View style={styles.View}>
            <Button
              onPress={UpdateReport}
              style={styles.button}
              primary
              iconRight
              rounded
            >
              <Text>Update Report</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  return (
    <View>
      <Text>Loading current report</Text>
      <Spinner></Spinner>
    </View>
  );
}

//--------- to be added when we figure out what to put

//               <Item picker style={styles.Item}>
//                 <Picker
//                   enabled
//                   mode="dropdown"
//                   iosIcon={<Icon name="arrow-down" />}
//                   style={{ padding: 20 }}
//                   placeholder="Select Accident Type"
//                   placeholderStyle={{ color: "#bfc6ea" }}
//                   placeholderIconColor="#007aff"
//                   selectedValue={Selected}
//                   onValueChange={setSelected}
//                 >
//                   <Picker.Item
//                     label="Select Accident Type"
//                     value="Accident_Type"
//                   />
//                   <Picker.Item label="Car Accident" value="Car_Accident" />
//                   <Picker.Item label="Heart Attack" value="Heart_Attack" />
//                 </Picker>
//               </Item>

//---------for nearby users
{
  /* <Card style={styles.Card}>
<CardItem header style={styles.CardItem2}>
  <Ionicons name="medical" size={30} color="black" />
  <Text style={styles.Title}>Medical History</Text>
</CardItem>
<Form>
  <Text style={styles.Text}>ONLY Consider to fill this area:</Text>
  <Text style={styles.Text}>
    1.If patient's Medical ID is not available.
  </Text>
  <Text style={styles.Text}>
    2.If you know information about the patient's medical history.
  </Text>

  <Textarea
    style={styles.Textarea}
    rowSpan={5}
    bordered
    placeholder="Patient Medical History"
  />
</Form>
</Card>
<View style={styles.View}>
<Button
  onPress={printme}
  style={styles.button}
  primary
  iconRight
  rounded
>
  <Text>Scan Medical ID</Text>
</Button>

<Button
  onPress={printme}
  style={[styles.button, { padding: 20 }]}
  primary
  iconRight
  rounded
>
  <Text>Add a User{"\n"}Medical ID</Text>
</Button>
</View> */
}

export default CurrentReport;

const styles = StyleSheet.create({
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
  Title: {
    marginTop: 20,
    fontSize: 20,
    color: "#8fccd9",
    fontWeight: "bold",
  },
  View: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  Item: {
    padding: 10,
  },
  CardItem: {
    justifyContent: "center",
    flexDirection: "column",
  },
  CardItem2: {
    justifyContent: "center",
    flexDirection: "column",
  },
  CardItem3: {
    justifyContent: "center",
    flexDirection: "column",
  },
  Text: {
    marginLeft: 10,
    color: "red",
  },
  Form: {
    marginBottom: 20,
  },
  Textarea: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  Card: {
    marginBottom: 20,
  },
  medicalID: {
    marginTop: 15,
    paddingHorizontal: 30,
  },
  medicalIDTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  medicalIDItem: {
    marginTop: 20,
    marginLeft: 15,
    fontSize: 20,
    color: "#8fccd9",
    fontWeight: "bold",
  },
  medicalIdData: {
    marginLeft: 15,
  },
});
