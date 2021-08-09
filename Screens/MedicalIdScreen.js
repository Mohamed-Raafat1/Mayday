import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Body,
  Left,
  View,
  Thumbnail,
} from "native-base";

import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions";
import { useLayoutEffect } from "react";

function MedicalIdScreen() {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(fetchUser());
  }, []);
  const currentUser = useSelector((state) => state.userState.currentUser);
  if (currentUser == undefined) return <View></View>;
  return (
    <Container style={styles.container}>
      <Content>
        <View style={styles.userInfoSection}>
          <View style={styles.avatar}>
            <Avatar.Image
              source={{
                uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
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
              5 May, 2000 (21 years)
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
            <Text>170 cm</Text>
          </Text>
          <Text style={{ fontSize: 18, color: "#777777" }}>
            WEIGHT{"\n"}
            <Text>70 kg</Text>
          </Text>
          <Text style={{ fontSize: 18, color: "#777777" }}>
            BLOOD TYPE{"\n"}
            <Text>A+</Text>
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
          <Text style={styles.medicalIdData}>Asthma</Text>
          <Text style={styles.medicalIDItem}>ALLERGIES</Text>
          <Text style={styles.medicalIdData}>Peanut allergy</Text>
          <Text style={styles.medicalIDItem}>MEDICATIONS</Text>
          <Text style={styles.medicalIdData}>Atenolol once a day</Text>
        </View>

        <View style={{ marginLeft: "auto", marginRight: "auto" }}>
          <Text style={styles.medicalIDItem}>QR Code</Text>
          <Thumbnail
            resizeMode="contain"
            style={{ width: 200, height: 200 }}
            source={require("../assets/QRCode.jpg")}
          />
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
