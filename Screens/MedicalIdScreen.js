import React from "react";
import firebase from "firebase";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import {
  Container,
  Text,
  Content,
  Body,
  Left,
  View,
  Right,
  Header,
  Icon,
  Button,
} from "native-base";

import { Avatar, Title } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions";
import { useLayoutEffect } from "react";
import QRCode from "react-native-qrcode-svg";

function MedicalIdScreen({ navigation }) {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const Unsubscribe = dispatch(fetchUser());

    return () => {
      Unsubscribe();
    };
  }, []);

  const currentUser = useSelector((state) => state.userState.currentUser);

  if (currentUser == undefined) return <View></View>;

  //---------------------------------QRCODE--------------------------------------------------------
  let Bdate = currentUser.Birthdate.toDate().toString();
  Bdate = Bdate.slice(4, 16);
  let qr;
  qr =
    "Patient Name : " +
    currentUser.FirstName +
    " " +
    currentUser.LastName +
    "\n Gender : " +
    currentUser.Gender +
    "\n Birthdate(Month/Day/Year) : " +
    Bdate +
    "\n Blood Type: " +
    currentUser.MedicalID.BloodType +
    "\n - Allergies : " +
    currentUser.MedicalID.Allergies +
    "\n Medical Conditions : " +
    currentUser.MedicalID.MedicalConditions +
    "\n Medications : " +
    currentUser.MedicalID.Medications +
    "\n Height : " +
    currentUser.MedicalID.Height +
    "\n Weight : " +
    currentUser.MedicalID.Weight;

  return (
    <Container style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <Header
        androidStatusBarColor="gray"
        style={{
          borderBottomWidth: 2,
          borderBottomColor: "#f6f6f6",
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Left>
          <TouchableOpacity
            onPress={() => {
              // navigation.navigate("Home")
              navigation.popToTop();
            }}
          >
            <Icon style={{ color: "black" }} name="arrow-back" />
          </TouchableOpacity>
        </Left>
        <Body>
          <Title style={{ color: "black", textAlign: "center" }}>
            Medical ID
          </Title>
        </Body>
        <Right>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("EditProfile", { currentUser });
            }}
          >
            <Text
              style={{
                paddingRight: 10,
                fontWeight: "bold",
                fontSize: 15,
                color: "black",
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
        </Right>
      </Header>
      <Content>
        <View style={styles.userInfoSection}>
          <View style={styles.avatar}>
            <Avatar.Image
              source={{
                uri: currentUser.PhotoURI,
              }}
              size={80}
            />
          </View>

          <View>
            <Title style={styles.title}>
              {currentUser.FirstName + " " + currentUser.LastName}
            </Title>
          </View>
          <View>
            <Text style={{ color: "#777777", textAlign: "center" }}>
              {/* {currentUser.Birthdate} */}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 18, color: "#777777" }}>
            HEIGHT{"\n"}
            <Text>{currentUser.MedicalID.Height} cm</Text>
          </Text>
          <Text style={{ fontSize: 18, color: "#777777" }}>
            WEIGHT{"\n"}
            <Text>{currentUser.MedicalID.Weight} Kg</Text>
          </Text>
          <Text style={{ fontSize: 18, color: "#777777" }}>
            BLOOD TYPE{"\n"}
            <Text>{currentUser.MedicalID.BloodType}</Text>
          </Text>
        </View>

        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: 0.5,
            marginTop: 20,
          }}
        />

        <View>
          <Text style={styles.medicalIDItem}>MEDICAL CONDITIONS</Text>
          <Text style={styles.medicalIdData}>
            {currentUser.MedicalID.MedicalConditions}
          </Text>
          <Text style={styles.medicalIDItem}>ALLERGIES</Text>
          <Text style={styles.medicalIdData}>
            {currentUser.MedicalID.Allergies}
          </Text>
          <Text style={styles.medicalIDItem}>MEDICATIONS</Text>
          <Text style={styles.medicalIdData}>
            {currentUser.MedicalID.Medications}
          </Text>
        </View>

        <View
          style={{ marginLeft: "auto", marginRight: "auto", marginBottom: 20 }}
        >
          <Text style={styles.medicalIDItem}>QR Code</Text>
          <QRCode value={qr} size={200} />
        </View>
      </Content>
    </Container>
  );
}

export default MedicalIdScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    paddingBottom: 35,
    backgroundColor: "#e8fbff",
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
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
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
    marginLeft: 15,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});
