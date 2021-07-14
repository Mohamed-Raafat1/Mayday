import React, { useState } from "react";
import {
  Picker,
  Item,
  Label,
  Content,
  Container,
  Header,
  Button,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  Right,
  Switch,
  Title,
  Input,
  Form,
} from "native-base";
import { StyleSheet } from "react-native";

function CurrentReport() {
  const [Selected, SetSelected] = useState("Nothing Selected");
  const printme = () => {
    console.log(Selected);
  };

  return (
    <Container>
      <Content>
        <Form>
          <Item floatingLabel style={{ padding: 10 }}>
            <Label>Patient Name</Label>
            <Input />
          </Item>
          <Item floatingLabel last style={{ padding: 10 }}>
            <Label>Doctor Name</Label>
            <Input />
          </Item>
          <Item floatingLabel last style={{ padding: 10 }}>
            <Label>Location</Label>
            <Input />
          </Item>
          <Item floatingLabel last style={{ padding: 10 }}>
            <Label>Condition</Label>
            <Input />
          </Item>
          <Item picker style={{ padding: 20 }}>
            <Picker
              enabled
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={{ height: 100, width: 120 }}
              placeholder="Select Accident Type"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
              selectedValue={Selected}
              onValueChange={SetSelected}
            >
              <Picker.Item label="Select Accident Type" value="Accident_Type" />
              <Picker.Item label="Car Accident" value="Car_Accident" />
              <Picker.Item label="Heart Attack" value="Heart_Attack" />
            </Picker>
          </Item>
          <Button
            onPress={printme}
            style={styles.button}
            primary
            iconRight
            rounded
            block
          >
            <Text>Send</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
}

export default CurrentReport;

const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    marginBottom: 10,
    alignContent: "center",
    backgroundColor: "rgb(250,91,90)",
  },
});
