import React, { useState, Component, useEffect } from 'react';
import {
  Picker,
  Item,
  Label,
  Content,
  Container,
  Textarea,
  DatePicker,
  Radio,
  Header,
  Button,
  ListItem,
  Text,
  View,
  Icon,
  Left,
  Body,
  Right,
  Switch,
  Title,
  Input,
  Form
} from 'native-base';
import { StyleSheet, ScrollView, TextInput } from 'react-native';
import { Avatar, Caption, TouchableRipple } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions";
import { useLayoutEffect } from "react";
import firebase from "firebase";
require("firebase/firestore")
require("firebase/firebase-storage")


function EditProfileScreen({ navigation, route }) {


  //regex for checking email validity
  const [isValid, setIsValid] = useState(false);
  const [isEqual, setEqual] = useState(false);
  const [medicalProfessional, setmedicalProfessional] = useState(false);
  const emailRegex = /\S+@\S+\.\S+/;

  const validateEmail = (text) => {
    setEmail(text);
    if (emailRegex.test(text)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const ComparePassword = (text) => {
    setConfirmPass(text);
    if (Password === text) setEqual(true);
    else setEqual(false);
  };
  // const dispatch = useDispatch();
  // useLayoutEffect(() => {
  //   dispatch(fetchUser());
  // }, [navigation]);

  
  //get the user data sent from MedicalIDScreen instead of fetching user
  const currentUser =   route.params.currentUser
  //useSelector((state) => state.userState.currentUser);

  if (currentUser == undefined) return <View></View>;



  const [Email, setEmail] = useState(currentUser.Email);
  const [Password, setPassword] = useState("");
  const [ConfirmPass, setConfirmPass] = useState("");
  const [NationalID, setNationalID] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("+20");
  const [FirstName, setFirstName] = useState(currentUser.FirstName);
  const [LastName, setLastName] = useState(currentUser.LastName);

  //----------------------------WIP edit soon------------------
  const [Height, setHeight] = useState(currentUser.MedicalID.Height);
  const [Weight, setWeight] = useState(currentUser.MedicalID.Weight);

  //blood type use state
  const [BloodType, SetBloodType] = useState(currentUser.MedicalID.BloodType);
  function ChangeBloodType(inputBloodType) {
    SetBloodType(inputBloodType);
  }

  const [MedicalConditions, setMedicalConditions] = useState(currentUser.MedicalID.MedicalConditions)
  const [Allergies,setAllergies] = useState(currentUser.MedicalID.Allergies)
  const [Medications,setMedications] = useState(currentUser.MedicalID.Medications)
  //---------------------------------------


  //uploading data to firestore (add rest of data)
  const onSave = () => {

    //filling MedicalID
    let MedicalID= {
      Height,
      Weight,
      BloodType,
      MedicalConditions,
      Allergies,
      Medications,
    }
    
    
    firebase.firestore().collection("users")
      .doc(currentUser.uid)
      .update({
        Email: Email,
        FirstName: FirstName,
        LastName: LastName,
        MedicalID: MedicalID,
        
      })
      .catch((error) => {
        Toast.show({
          text: error.message,
          duration: 2000,
        })
        console.log(error);
      });
    navigation.replace("Medical ID")

  };

  

  return (
    <Container style={styles.container}>
      <Header androidStatusBarColor="gray" style={{flexDirection:"row", justifyContent:'space-between'}}>
        <Left>
          <Button transparent onPress={()=>{navigation.goBack()}}>
            <Icon name="arrow-back"/>
          </Button>
        </Left>
        <Body>
        <Title>Edit Profile</Title>
        </Body>
        
        <Right>
          <Button transparent onPress={ ()=>{
            // console.log("editprofile user\n",currentUser,"\n----------")
            onSave()
            }}>
            <Text>Save</Text>
          </Button>
        </Right>
      </Header>
      <Content>
        <View style={styles.userInfoSection}>


          {/* -------------------avatar, caption button, name----------------- */}
          <View style={styles.avatar}>
            <Avatar.Image
              source={{
                uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
              }}
              size={80}
            />
            <Button transparent style={styles.avatarCaptionButton}><Text>Change Profile Photo</Text></Button>
          </View>
        </View>
        
          <Form>
            <Item
              iconRight
              underline
              style={styles.Item}
              success={isValid}
              error={!isValid}
            >

                <View>
                  <Text style={{ marginTop: 15, fontSize: 18 }}>Email</Text>
                  <TextInput defaultValue="omar"
                    onChangeText={(text) => validateEmail(text)}
                    value={Email}></TextInput>
                </View>
              <Icon name="mail-outline" style={{ marginLeft: "auto", marginTop: "auto" }}></Icon>

            </Item>

            <Item underline iconRight>
            <View>
                  <Text style={{ marginTop: 15, fontSize: 18 }}>First Name</Text>
                  <TextInput 
                    onChangeText={(text) => setFirstName(text)}
                    value={FirstName}></TextInput>
                </View>
            </Item>
            <Item underline iconRight>
            <View>
                  <Text style={{ marginTop: 15, fontSize: 18 }}>Last Name</Text>
                  <TextInput 
                    onChangeText={(text) => setLastName(text)}
                    value={LastName}></TextInput>
                </View>
            </Item>
            

          </Form>
       

        {/*----------------- height, weight, blood type --------------------*/}

        <View>


          <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", marginTop:15 }}>
            <Text style={{ fontSize: 18, color: "#777777", marginBottom: 0 }}>Height{"\n"}
              <View style={{ flexDirection: "row" }}>

                <TextInput style={{ borderBottomWidth: 1, minWidth: 35, }} 
                defaultValue={Height} 
                onChangeText={setHeight}
                keyboardType="numeric" />
                <Text style={{ marginTop: 3 }}>cm</Text>
              </View>
            </Text>
            <Text style={{ fontSize: 18, color: "#777777", marginBottom: 0 }}>Weight{"\n"}
              <View style={{ flexDirection: "row" }}>

                <TextInput style={{ borderBottomWidth: 1, minWidth: 35 }} 
                defaultValue={Weight} 
                onChangeText={setWeight}
                keyboardType="numeric" />
                <Text style={{ marginTop: 3 }}>kg</Text>

              </View>
            </Text>



            <View>
              <Text style={{ fontSize: 18, color: "#777777", marginBottom: 0 }}>Blood Type</Text>
              <Picker mode="dropdown"
                iosIcon={<Icon name="arrow-dropdown-circle" />}

                selectedValue={BloodType}
                onValueChange={SetBloodType}
              >
                <Picker.Item label="A+" value="A+"></Picker.Item>
                <Picker.Item label="A-" value="A-"></Picker.Item>
                <Picker.Item label="B+" value="B+"></Picker.Item>
                <Picker.Item label="B-" value="B-"></Picker.Item>
                <Picker.Item label="AB+" value="AB+"></Picker.Item>
                <Picker.Item label="AB-" value="AB-"></Picker.Item>
                <Picker.Item label="O+" value="O+"></Picker.Item>
                <Picker.Item label="O-" value="O-"></Picker.Item>
                <Picker.Item label="?" value="?"></Picker.Item>


              </Picker>
            </View>



          </View>


        </View>

        {/* divider */}
        <View
          style={styles.divider}
        />

        <View>
          <Text style={styles.medicalIDItem}>MEDICAL CONDITIONS</Text>
          <Textarea style={styles.medicalIdData}
          onChangeText={setMedicalConditions}>{MedicalConditions}</Textarea>
          <Text style={styles.medicalIDItem}>ALLERGIES</Text>
          <Textarea style={styles.medicalIdData} onChangeText={setAllergies}>{Allergies}</Textarea>
          <Text style={styles.medicalIDItem}>MEDICATIONS</Text>
          <Textarea style={styles.medicalIdData} onChangeText={setMedications}>{Medications}</Textarea>
        </View>

      </Content>
    </Container>
  )
}

export default EditProfileScreen;

const styles = StyleSheet.create(
  {
    avatar: {
      alignItems: 'center',
      marginTop: 50,
    },

    avatarCaptionButton: {
      marginLeft: 'auto',
      marginRight: 'auto',

    },

    button: {
      marginTop: 50,
      marginBottom: 10,
      alignContent: "center",
      backgroundColor: "rgb(250,91,90)"
    },

    caption: {
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '500',
    },

    container: {
      flex: 1,
      justifyContent: 'space-between',
    },

    divider: {
      borderBottomColor: 'black',
      borderBottomWidth: 0.5,
      marginTop: 20
    },


    medicalID: {
      marginTop: 15,
      paddingHorizontal: 30,
    },

    medicalIDTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },

    medicalIDItem: {
      marginTop: 20,
      marginLeft: 15,
      fontSize: 20,
      color: "#8fccd9",
      fontWeight: 'bold',
    },

    medicalIdData: {
      marginLeft: 10,
      borderBottomWidth: 1
    },

    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 3,
      marginBottom: 5,
      textAlign: 'center',
      color: 'black'
    },

    userInfoSection: {
      height: "20%",
      justifyContent: "space-evenly",
      paddingHorizontal: 30,
      paddingBottom: 35,
      backgroundColor: "#e8fbff",
    },
    iconStyle: {
      alignContent: "center",
      marginLeft: 10,
      marginTop: 5,
    },

  });