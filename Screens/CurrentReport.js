import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Button, Card,
  CardItem, Container, Content, Form, Icon,Input, Item, Label, Picker, Text, Textarea,View
} from "native-base";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

function CurrentReport() {
  const currentUser = useSelector((state) => state.userState.currentUser);

  const currentRequest = useSelector(
    (state) => state.requestState.currentRequest
  );
  // console.log("this is the current request", currentUser.uid, currentRequest);
  const dispatch = useDispatch();

  const [Selected, setSelected] = useState("Nothing Selected");
  const printme = () => {
    console.log(Selected);
  };

  return (
    <Container>
      <Content>
        <Card style={styles.Card}>
          <CardItem header style={styles.CardItem}>
            <MaterialCommunityIcons
              name="account-outline"
              size={30}
              color="black"
            />
            <Text style={styles.Title}>Patient Details</Text>
          </CardItem>

          <Form>
            <Item floatingLabel style={styles.Item}>
              <Label>Patient Name</Label>
              <Input />
            </Item>

            <Item last style={styles.Item}>
              <Ionicons name="location" size={24} color="black" />
              <Label>Location</Label>
              <Input />
            </Item>

            <Item floatingLabel last style={styles.Item}>
              <Label>Condition</Label>
              <Input />
            </Item>

            <Item picker style={styles.Item}>
              <Picker
                enabled
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ padding: 20 }}
                placeholder="Select Accident Type"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                selectedValue={Selected}
                onValueChange={setSelected}
              >
                <Picker.Item
                  label="Select Accident Type"
                  value="Accident_Type"
                />
                <Picker.Item label="Car Accident" value="Car_Accident" />
                <Picker.Item label="Heart Attack" value="Heart_Attack" />
              </Picker>
            </Item>
          </Form>
        </Card>

        <Card style={styles.Card}>
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
        </View>

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

            <Item floatingLabel last style={styles.Item}>
              <Label>Ambulance Current State</Label>
              <Input />
            </Item>
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
            <Text>Update Report</Text>
          </Button>
        </View>
      </Content>
    </Container>
  );
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
});
