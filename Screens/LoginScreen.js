import "react-native-gesture-handler";

import React, { useState } from "react";

import {
  Container,
  Text,
  View,
  Button,
  Icon,
  Form,
  Item,
  Input,
  Label,
  Content,
  Header,
} from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import GlobalStyles from "../GlobalStyles";

function LoginScreen({ navigation }) {
  //regex for checking email validity
  const [isValid, setIsValid] = useState(false);
  const emailRegex = /\S+@\S+\.\S+/;

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  //regex for checking email syntax validity

  const validateEmail = (text) => {
    setEmail(text);
    if (emailRegex.test(text)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View style={styles.Loginform}>
        <Text style={{ textAlign: "center" }}>Welcome Screen</Text>
        <Form>
          <Item
            iconRight
            style={styles.Item}
            success={isValid}
            error={!isValid}
          >
            <Input
              onChangeText={(text) => validateEmail(text)}
              placeholder="Email"
              value={Email}
            />

            <Icon name="mail-outline"></Icon>
          </Item>
          <Item iconRight style={styles.Item} success={false} inlineLabel>
            <Input
              textContentType="password"
              secureTextEntry={true}
              placeholderTextColor="gray"
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
            />

            <Icon name="lock-closed-outline"></Icon>
          </Item>
        </Form>
        <Text
          style={{
            textAlign: "right",
            marginBottom: 10,
          }}
        >
          forgot password?
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
          onPress={() => navigation.navigate("Home")}
          block
        >
          <Text>LOGIN</Text>
        </Button>
        <Button transparent block>
          <Text style={{ color: "black" }}> click me</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
export default LoginScreen;
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
  },
});
