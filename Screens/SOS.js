import React, { useState } from "react";
import {
  Container,
  Header,
  Content,
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
} from "native-base";
import { StyleSheet } from "react-native";

function SOS({ navigation }) {
  //Toggle Switch to enable SOS
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  //To save contact numbers (first contact only right now as a Test)
  const [Numbers, SetNumbers] = useState("");
  const printme = () => {
    console.log("Contact1 = " + Numbers);
  };

  return (
    <Container>
      <Header style={{ backgroundColor: "white" }}>
        <Title style={{ color: "black" }}>SOS Emergency Contacts</Title>
      </Header>
      <Content>
        {/* Switch  */}
        <ListItem icon style={{ marginBottom: 50 }}>
          <Left>
            <Button style={{ backgroundColor: "#FF9501" }}>
              <Icon active name="person" />
            </Button>
          </Left>
          <Body>
            <Text>Emergency Contacts</Text>
          </Body>
          <Right>
            <Switch onValueChange={toggleSwitch} value={isEnabled} />
          </Right>
        </ListItem>

        <ListItem icon style={{ marginBottom: 10 }}>
          <Left>
            <Text>1.</Text>
          </Left>
          {/* Emergency Number */}
          <Body>
            <Input
              placeholder="First Contact"
              onChangeText={SetNumbers}
              value={Numbers}
            />
          </Body>
          <Right>
            {/* Get from Contacts Button */}
            <Button style={{ backgroundColor: "#9FE6A0" }}>
              <Icon active name="person" />
            </Button>
          </Right>
        </ListItem>
        <ListItem icon style={{ marginBottom: 10 }}>
          <Left>
            <Text>2.</Text>
          </Left>
          <Body>
            <Input placeholder="Second Contact" />
          </Body>
          <Right>
            <Button style={{ backgroundColor: "#9FE6A0" }}>
              <Icon active name="person" />
            </Button>
          </Right>
        </ListItem>
        <ListItem icon style={{ marginBottom: 10 }}>
          <Left>
            <Text>3.</Text>
          </Left>
          <Body>
            <Input placeholder="Third Contact" />
          </Body>
          <Right>
            <Button style={{ backgroundColor: "#9FE6A0" }}>
              <Icon active name="person" />
            </Button>
          </Right>
        </ListItem>
        <ListItem icon style={{ marginBottom: 10 }}>
          <Left>
            <Text>4.</Text>
          </Left>
          <Body>
            <Input placeholder="Fourth Contact" />
          </Body>
          <Right>
            <Button style={{ backgroundColor: "#9FE6A0" }}>
              <Icon active name="person" />
            </Button>
          </Right>
        </ListItem>
        <ListItem icon style={{ marginBottom: 10 }}>
          <Left>
            <Text>5.</Text>
          </Left>
          <Body>
            <Input placeholder="Fifth Contact" />
          </Body>
          <Right>
            <Button style={{ backgroundColor: "#9FE6A0" }}>
              <Icon active name="person" />
            </Button>
          </Right>
        </ListItem>
        <Button
          onPress={() => navigation.goBack()}
          style={styles.button}
          primary
          rounded
          block
        >
          <Text>Save</Text>
        </Button>
      </Content>
    </Container>
  );
}

export default SOS;

const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    marginBottom: 10,
    alignContent: "center",
    backgroundColor: "rgb(250,91,90)",
  },
});
