import React, { Component } from "react";
import {
  View,
  Container,
  Header,
  Badge,
  Content,
  Button,
  Text,
  Icon,
  Card,
  CardItem,
  Thumbnail,
  constants,
  TouchableOpacity,
  StyleSheet,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import MapView from "react-native-maps";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function RequestAmbulance() {
  const navigation = useNavigation();

  function ReqAmbNav() {
    navigation.navigate("Home");
  }

  return (
    <Container>
      <MapView style={map} />
    </Container>
  );
}

const card = {
  width: 350,
  height: 150,
};
const text = {
  textAlign: "center",
  fontWeight: "bold",
  fontSize: 18,
};
const button = {
  width: 50,
  height: 50,
  alignContent: "center",
  justifyContent: "center",
};

const container = {
  flex: 1,
  backgroundColor: "#fff",
  alignItems: "center",
  justifyContent: "center",
};

const map = {
  width: "80%",
  height: "50%",
};
