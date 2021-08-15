import "react-native-gesture-handler";
import React, { useState } from "react";

import {
  Text,
  Button,
  Icon,
  Form,
  Container,
  Header,
  Content,
  Item,
  Input,
  ListItem,
  CheckBox,
  Toast,
} from "native-base";
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import GlobalStyles from "../GlobalStyles";

import firebase from "firebase";
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
    else setEqual(false);
  };
  const onSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(Email, Password)
      .then((result) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            Email,
            FirstName,
            LastName,
            NationalID,
            PhoneNumber,
            medicalProfessional,
          });
        console.log(result);
      })
      .catch((error) => {
        Toast.show({
          text: error.message,
          duration: 2000,
          })
        console.log(error);
      });
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

          <Item iconRight underline style={styles.Item}>
            <Input
              onChangeText={(text) => setNationalID(text)}
              keyboardType="numeric"
              placeholder="National ID"
              placeholderTextColor="gray"
              value={NationalID}
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
              onChangeText={(text) => ComparePassword(text)}
              textContentType="password"
              secureTextEntry={true}
              placeholderTextColor="gray"
              placeholder="Confirm Password"
            />

            <Icon name="lock-closed-outline"></Icon>
          </Item>
          <ListItem>
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

        <Text
          style={{
            textAlign: "right",
            marginBottom: 10,
          }}
          onPress={() => navigation.navigate("Login")}
        >
          Already have an account?
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
          onPress={onSignUp}
          block
        >
          <Text>Register</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
export default RegistrationScreen;
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
    marginBottom: 10,
    marginLeft: 10,
    paddingLeft: 10,
  },
});
