import { useNavigation } from "@react-navigation/native";
import { Container } from "native-base";
import React from "react";
import MapView from "react-native-maps";

export default function RequestAmbulance() {
  const navigation = useNavigation();

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
