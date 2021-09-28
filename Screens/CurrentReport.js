import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Button, Card,
  CardItem, Container, Content, Form, Icon, Input, Item, Label, Picker, Text, Textarea, Toast, View
} from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "react-native-paper";
import firebase from "firebase";

function CurrentReport() {
  const currentUser = useSelector((state) => state.userState.currentUser);

  const currentRequest = useSelector(
    (state) => state.requestState.currentRequest
  );


  const [Patient, setPatient] = useState(null)
  const [Doctor, setDoctor] = useState(null)

const [Condition, setCondition] = useState(null)
  // console.log("this is the current request", currentUser.uid, currentRequest);
  const dispatch = useDispatch();

  const [Selected, setSelected] = useState("Nothing Selected");

  //update the report in the firestore
  const UpdateReport = () => {
    firebase.firestore().collection('requests').doc(currentRequest.id).update({
      Condition: Condition
    })
    Toast.show({text:'Report Updated'})
  };

  //retrieve the patient and doctor using the IDs in the request
  const ExtractUsers = async () => {
    if (currentRequest.PatientID)
      await firebase.firestore().collection('users').doc(currentRequest.PatientID).get().then((snapshot) => {
        if (snapshot.exists) {
          setPatient(snapshot.data())
        }
      })
    if (currentRequest.DoctorID)
      await firebase.firestore().collection('users').doc(currentRequest.DoctorID).get().then((snapshot) => {
        if (snapshot.exists) {
          setDoctor(snapshot.data())
        }
      })
  }

  useEffect(() => {
    if (currentRequest) {
      ExtractUsers()
      setCondition(currentRequest.Condition)
    }
  }, [currentRequest])


//REMEMBER need to apply all the other conditions (with dr, without dr, self patient, other patient)
  if (currentRequest && Patient)
    return (
      <Container>
        <Content>

          <Card style={styles.Card}>
            <CardItem header style={styles.CardItem}>

              <Avatar.Image
                source={{
                  uri: Patient ? Patient.PhotoURI : "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
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
                <Input disabled >{Patient.FirstName + " " + Patient.LastName}</Input>
              </Item>

              <Item last style={styles.Item} onPress={() => { console.log('waw?') }}>
                <Ionicons name="location" size={24} color="black" />
                <Label>Location</Label>
              </Item>

              <Item floatingLabel last style={styles.Item}>
                <Label>Condition</Label>
                <Input onChangeText={setCondition} >{Condition}</Input>
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
                <Text>{Patient.MedicalID.Height} cm</Text>
              </Text>
              <Text style={{ fontSize: 18, color: "#777777" }}>
                WEIGHT{"\n"}
                <Text>{Patient.MedicalID.Weight} Kg</Text>
              </Text>
              <Text style={{ fontSize: 18, color: "#777777" }}>
                BLOOD TYPE{"\n"}
                <Text>{Patient.MedicalID.BloodType}</Text>
              </Text>
            </View>

            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 0.5,
                marginTop: 20,
              }}
            />


            <View style={{marginBottom:15}}>
              <Text style={styles.medicalIDItem}>MEDICAL CONDITIONS</Text>
              <Text style={styles.medicalIdData}>
                {Patient.MedicalID.MedicalConditions}
              </Text>
              <Text style={styles.medicalIDItem}>ALLERGIES</Text>
              <Text style={styles.medicalIdData}>
                {Patient.MedicalID.Allergies}
              </Text>
              <Text style={styles.medicalIDItem}>MEDICATIONS</Text>
              <Text style={styles.medicalIdData}>
                {Patient.MedicalID.Medications}
              </Text>
            </View>
          </Card>
          

          <Card style={styles.Card}>
            <CardItem header style={styles.CardItem3}>
              <MaterialCommunityIcons name="medical-bag" size={30} />
              <Text style={styles.Title}>Medical Support Details</Text>
            </CardItem>

            <Form style={styles.Form}>
              <Item floatingLabel style={styles.Item}>
                <Label>Contacted Doctor Name</Label>
                <Input />
              </Item>

              <Item floatingLabel last style={styles.Item}>
                <Label>Hospital Name</Label>
                <Input />
              </Item>

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
  return (<View><Text>NOthin</Text></View>)

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
{/* <Card style={styles.Card}>
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
</View> */}


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
