import "react-native-gesture-handler";

import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
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
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import GlobalStyles from "../GlobalStyles";
import { Feather } from "@expo/vector-icons";
import { AuthContext } from "../Components/context";
function LoginScreen({ navigation }) {
  //regex for checking email validity
  const [isValid, setIsValid] = useState(null);
  const emailRegex = /\S+@\S+\.\S+/;
  //regex for checking email syntax validity
  //instead of using multiple use states just used one
  //each one can be accessed by destructing the data
  const [data, setData] = useState({
    Email: "",
    Password: "",
    check_textInputChange: false,
    secureTextEntry: true,
  });
  const EmailTextChange = (text) => {
    if (text.length !== 0) {
      setData({
        ...data,
        Email: text,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        Email: text,
        check_textInputChange: false,
      });
    }
    if (emailRegex.test(text)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };
  //accessing context to use signIn functionality
  const { signIn } = React.useContext(AuthContext);
  //called when text changes in the password input
  //sets password variable to the current password input value
  const handlePasswordChange = (text) => {
    setData({
      ...data,
      Password: text,
    });
  };
  const updateSecureTextEntry = () => {
    setData({ ...data, secureTextEntry: !data.secureTextEntry });
  };

  return (
    <Container>
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <Animatable.View style={styles.Loginform} animation="fadeInUpBig">
          <View>
            <Text style={{ textAlign: "center" }}>Welcome Screen</Text>
          </View>
          <View>
            <Form>
              <Item
                iconRight
                style={styles.Item}
                success={isValid}
                error={!isValid}
              >
                <Input
                  onChangeText={(text) => EmailTextChange(text)}
                  placeholder="Email"
                  value={data.Email}
                />

                <Icon name="mail-outline"></Icon>
              </Item>
              <Item iconRight style={styles.Item} success={false} inlineLabel>
                <Input
                  textContentType="password"
                  secureTextEntry={data.secureTextEntry}
                  placeholderTextColor="gray"
                  placeholder="Password"
                  onChangeText={(text) => handlePasswordChange(text)}
                />
                <Button transparent onPress={updateSecureTextEntry}>
                  {data.secureTextEntry ? (
                    <Feather
                      style={{ marginRight: 10 }}
                      name="eye-off"
                      size={20}
                      color="black"
                    />
                  ) : (
                    <Feather
                      style={{ marginRight: 10 }}
                      name="eye"
                      size={20}
                      color="black"
                    />
                  )}
                </Button>

                <Icon name="lock-closed-outline"></Icon>
              </Item>
            </Form>

            <Text
              style={{
                textAlign: "right",
                paddingVertical: 20,
              }}
            >
              forgot password?
            </Text>
            <Button
              style={styles.Button}
              // style={{
              //   marginBottom: 10,
              //   alignContent: "center",
              //   backgroundColor: "rgb(250,91,90)",
              // }}
              primary
              iconRight
              rounded
              onPress={signIn}
              block
            >
              <Text>LOGIN</Text>
            </Button>
            <Button
              bordered
              block
              style={{ marginTop: 10, borderColor: "rgb(250,91,90)" }}
              rounded
              onPress={() => navigation.navigate("Registration")}
            >
              <Text style={{ color: "black" }}> Register</Text>
            </Button>
          </View>
        </Animatable.View>
      </SafeAreaView>
    </Container>
  );
}
export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  Button: {
    shadowColor: "rgba(0, 0, 255, 255)",
    shadowOpacity: 1,
    elevation: 20,
    shadowRadius: 20,
    shadowOffset: { width: 100, height: 100 },
    backgroundColor: "rgb(250,91,90)",
    marginBottom: 10,
  },
});
