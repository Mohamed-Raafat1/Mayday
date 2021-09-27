import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import firebase from "firebase";
import {
  Button,
  CheckBox,
  Form,
  Icon,
  Input,
  Item,
  Label,
  ListItem,
  Picker,
  Subtitle,
  Text,
  Textarea,
  Toast,
} from "native-base";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import "react-native-gesture-handler";
import RadioGroup from "react-native-radio-buttons-group";
import GlobalStyles from "../GlobalStyles";
import { DailyTipsAlert } from "../HomeNavigation/tabs";
// Notif. Token Registeration function
async function registerForPushNotificationsAsync() {
  let token = "";
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync(); //PERMISSIONS REQUEST
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data; //GETTING TOKEN HERE
    //console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

function RegistrationScreen({ navigation }) {
  //regex for checking email validity
  const [isValid, setIsValid] = useState(false);
  const [isEqual, setEqual] = useState(false);
  const [medicalProfessional, setmedicalProfessional] = useState(false);
  const emailRegex = /\S+@\S+\.\S+/;

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPass, setConfirmPass] = useState("");
  const [NationalID, setNationalID] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("+20");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [EmptyStatus, setEmptyStatus] = useState(true);
  //------------------medicalID objects---------------------------------------------
  const [height, setHeight] = useState("0");
  const [weight, setWeight] = useState("0");
  const [bloodType, SetBloodType] = useState("?");
  function ChangeBloodType(inputBloodType) {
    SetBloodType(inputBloodType);
  }
  const [medicalConditions, setMedicalConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  // ----------------------------Push Notification--------------------------
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
  }, []);

  //regex for checking email syntax validity
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
    else {
    setEqual(false);}
  };

  const onSignUp = async () => {
    console.log(EmptyStatus)
    if (isEqual) {
      if (!EmptyStatus) {
        //Gathering MedicalID
        let MedicalID = {
          Height: height,
          Weight: weight,
          BloodType: bloodType,
          MedicalConditions: medicalConditions,
          Allergies: allergies,
          Medications: medications,
        };

        //Emergency Contacts
        let EmergencyContacts = [];
        //retrieving gender
        let gender = "";
        radioButtons.map((radio) => {
          if (radio.selected == true) gender = radio.value;
        });

        await firebase
          .auth()
          .createUserWithEmailAndPassword(Email, Password)
          .then(async (result) => {
            let uid = firebase.auth().currentUser.uid;

            await firebase
              .firestore()
              .collection("users")
              .doc(uid)
              .set({
                uid,
                Email,
                FirstName,
                LastName,
                Gender: gender,
                Birthdate: date,
                NationalID,
                PhoneNumber,
                medicalProfessional,
                MedicalID,
                EmergencyContacts,
                ExpoToken: expoPushToken,
                DailyTips: false,
                coordinates: new firebase.firestore.GeoPoint(0, 0),
                g: {
                  geohash: "",
                  geopoint: new firebase.firestore.GeoPoint(0, 0),
                },
                PhotoURI: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
              });

            //default profile pic
            firebase.auth().currentUser.updateProfile({
              photoURL: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
            });

            //console.log(result);
          })
          .catch((error) => {
            Toast.show({
              text: error.message,
              duration: 2000,
            });
            console.log(error);
          });
      };
    }
  }
  //====================================================================//

  const Radio = [
    {
      id: "Male", // acts as primary key, should be unique and non-empty string
      label: "Male",
      value: "Male",
      selected: false,
    },
    {
      id: "Female",
      label: "Female",
      value: "Female",
      selected: false,
    },
  ];
  const [radioButtons, setRadioButtons] = useState(Radio);
  function onPressRadioButton(radioButtonsArray) {
    setRadioButtons(radioButtonsArray);
  }
  //====================================================================//

  //birth date use state and functions
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [text, setText] = useState(
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    // Process the date values
    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();
    setText(fDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const checkTextInput = () => {
    if (!Email.trim()) {
      alert('Please Enter Email');
      setEmptyStatus(true);
      return;
    }
    //Check for the Email TextInput
    if (!Password.trim()) {
      alert('Please Enter Email');
      setEmptyStatus(true);
      return;
    }
    if (!ConfirmPass.trim()) {
      alert('Please Confirm Password');
      setEmptyStatus(true);
      return;
    }
    if (!NationalID.trim()) {
      alert('Please Enter Your National ID');
      setEmptyStatus(true);
    }
    if (!PhoneNumber.trim()) {
      alert('Please Enter You Phone Number');
      setEmptyStatus(true);
      return;
    }
    if (!FirstName.trim()) {
      alert('Please Ent\er Your First Name');
      setEmptyStatus(true);
      return;
    }
    if (!LastName.trim()) {
      alert('Please Enter Your Last Name');
      setEmptyStatus(true);
      return;
    }

      setEmptyStatus(false);
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <ScrollView style={styles.Loginform}>
        <Form>
          <Item
            iconRight
            underline
            style={styles.Item}
            success={isValid}
            error={!isValid}
          >
            <Input
              onChangeText={(text) => validateEmail(text)}
              placeholder="Email"
              placeholderTextColor="gray"
              value={Email}
            />

            <Icon name="mail-outline"></Icon>
          </Item>

          <Item underline iconRight style={styles.Item}>
            <Input
              onChangeText={(text) => setFirstName(text)}
              placeholder="First Name"
              placeholderTextColor="gray"
              value={FirstName}
            />
          </Item>

          <Item iconRight underline style={styles.Item}>
            <Input
              onChangeText={(text) => setLastName(text)}
              placeholder="Last Name"
              placeholderTextColor="gray"
              value={LastName}
            />
          </Item>

          <Item iconRight style={styles.Item}>
            <Text style={{ color: "gray" }}>Gender</Text>
            <View>
              <RadioGroup
                radioButtons={radioButtons}
                onPress={() => {
                  onPressRadioButton;

                  console.log(date);
                }}
                layout="row"
              />
            </View>
            <MaterialCommunityIcons
              name="gender-male-female"
              size={24}
              style={{ marginLeft: "auto", marginRight: 7 }}
              color="black"
            />
          </Item>

          <Item iconRight style={styles.Item}>
            <Label style={{ alignSelf: "center", color: "gray" }}>
              Birth Date
            </Label>
            <Button
              style={{ alignSelf: "center" }}
              transparent
              onPress={() => showMode("date")}
            >
              <Text style={{ color: "black", fontSize: 20 }}>{text}</Text>
            </Button>
            <Icon name="calendar-outline" style={{ marginLeft: "auto" }}></Icon>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </Item>

          <Item iconRight underline style={styles.Item}>
            <Input
              onChangeText={(text) => setNationalID(text)}
              keyboardType="numeric"
              placeholder="National ID"
              placeholderTextColor="gray"
              value={NationalID}
            />
            <MaterialCommunityIcons
              name="card-account-details-outline"
              size={24}
              style={{ marginRight: 7 }}
              color="black"
            />
          </Item>

          <Item iconRight underline style={styles.Item}>
            <Input
              onChangeText={(text) => setPhoneNumber(text)}
              keyboardType="numeric"
              placeholder="Phone Number"
              placeholderTextColor="gray"
              value={PhoneNumber}
            />
            <Icon name="call-outline"></Icon>
          </Item>

          <Item underline iconRight style={styles.Item} success={false}>
            <Input
              textContentType="password"
              secureTextEntry={true}
              placeholderTextColor="gray"
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
            />

            <Icon name="lock-closed-outline"></Icon>
          </Item>

          <Item
            underline
            success={isEqual}
            error={!isEqual}
            iconRight
            style={styles.Item}
          >
            <Input
              onChangeText={(text) =>{ ComparePassword(text)}}
              textContentType="password"
              secureTextEntry={true}
              placeholderTextColor="gray"
              placeholder="Confirm Password"
            />

            <Icon name="lock-closed-outline"></Icon>
          </Item>

          <ListItem style={{ borderBottomWidth: 0 }}>
            <CheckBox
              checked={medicalProfessional}
              onPress={() =>
                setmedicalProfessional(medicalProfessional ? false : true)
              }
              color="rgb(250,91,90)"
            />

            <Text
              style={{
                marginLeft: 10,
              }}
            >
              Register as medical Personnel
            </Text>
          </ListItem>
        </Form>

        {/**--------------------medical id part --------------------------------------- */}
        <View style={styles.divider}>
          <Text style={styles.title}>Medical ID</Text>
          <Subtitle style={{ color: "grey", textAlign: "center" }}>
            (can be filled later)
          </Subtitle>

          <View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: 15,
              }}
            >
              <Text style={{ fontSize: 18, color: "#777777", marginBottom: 0 }}>
                Height{"\n"}
                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    style={{ borderBottomWidth: 1, minWidth: 35 }}
                    keyboardType="numeric"
                    onChangeText={setHeight}
                  />
                  <Text style={{ marginTop: 3 }}>cm</Text>
                </View>
              </Text>
              <Text style={{ fontSize: 18, color: "#777777", marginBottom: 0 }}>
                Weight{"\n"}
                <View style={{ flexDirection: "row" }}>
                  <TextInput
                    style={{ borderBottomWidth: 1, minWidth: 35 }}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                  <Text style={{ marginTop: 3 }}>kg</Text>
                </View>
              </Text>

              <View>
                <Text
                  style={{ fontSize: 18, color: "#777777", marginBottom: 0 }}
                >
                  Blood Type
                </Text>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-dropdown-circle" />}
                  selectedValue={bloodType}
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
          {/* <View
            style={styles.divider}
          /> */}

          <View>
            <Text style={styles.medicalIDItem}>MEDICAL CONDITIONS</Text>
            <Textarea
              style={styles.medicalIdData}
              onChangeText={setMedicalConditions}
            ></Textarea>
            <Text style={styles.medicalIDItem}>ALLERGIES</Text>
            <Textarea
              style={styles.medicalIdData}
              onChangeText={setAllergies}
            ></Textarea>
            <Text style={styles.medicalIDItem}>MEDICATIONS</Text>
            <Textarea
              style={styles.medicalIdData}
              onChangeText={setMedications}
            ></Textarea>
          </View>
        </View>
        {/*-----------------------------*end of medicalIDpart----------------------------- */}

        <Text
          style={{
            textAlign: "right",
            marginBottom: 10,
            marginTop: 10,
          }}
          onPress={() => navigation.navigate("Login")}
        >
          l Already have an account?
        </Text>

        <Button
          style={{
            marginBottom: 10,
            alignContent: "center",
            backgroundColor: "rgb(250,91,90)",
          }}
          primary
          iconRight
          rounded
          onPress={async () => {
            onSignUp();
            checkTextInput();
            {if(!isEqual){
              Toast.show({text:'Passwords Do Not Match'})
            }}
            // await DailyTipsAlert();
          }}
          block
        >
          <Text>Register</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
export default RegistrationScreen;

//====================================================================//

const styles = StyleSheet.create({
  Loginform: {
    alignContent: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  label: {
    paddingHorizontal: 10,
  },
  Item: {
    marginBottom: 20,
    marginLeft: 10,
    paddingLeft: 10,
  },
  avatar: {
    alignItems: "center",
    marginTop: 50,
  },

  avatarCaptionButton: {
    marginLeft: "auto",
    marginRight: "auto",
  },

  button: {
    marginTop: 50,
    marginBottom: 10,
    alignContent: "center",
    backgroundColor: "rgb(250,91,90)",
  },

  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },

  container: {
    flex: 1,
    justifyContent: "space-between",
  },

  divider: {
    borderColor: "#8fccd9",
    borderWidth: 1.5,
    borderRadius: 5,
    marginTop: 20,
    paddingBottom: 10,
    marginBottom: 10,
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
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 3,
    marginBottom: 5,
    textAlign: "center",
    color: "black",
  },

  userInfoSection: {
    height: "20%",
    justifyContent: "space-evenly",
    paddingHorizontal: 30,
    paddingBottom: 35,
    backgroundColor: "#e8fbff",
  },
});
