import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import firebase from "firebase";
import {
  Button,
  Container,
  Form,
  Icon,
  Input,
  Item,
  Text,
  Thumbnail,
  Toast,
  View,
} from "native-base";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import "react-native-gesture-handler";
import { TouchableOpacity } from "react-native-gesture-handler";
import GlobalStyles from "../GlobalStyles";

// Notif. Token Registeration function
async function registerForPushNotificationsAsync() {
  let token = "";
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync(); //PERMISSIONS REQUEST
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data; //GETTING TOKEN HERE
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

function LoginScreen({ navigation }) {
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
      }),
    [navigation]
  );
  // Push Notification
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    //Reg Token Notif.
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
  }, []);

  //regex for checking email validity
  const [isValid, setIsValid] = useState(null);
  const emailRegex = /\S+@\S+\.\S+/;

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

  const handlePasswordChange = (text) => {
    setData({
      ...data,
      Password: text,
    });
  };
  const updateSecureTextEntry = () => {
    setData({ ...data, secureTextEntry: !data.secureTextEntry });
  };
  const onSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(data.Email, data.Password)
      .then((result) => {
        //Updating the notification token for new sign in
        //(to handle the case -> if its a new device)
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .update({
            ExpoToken: expoPushToken,
          });
        //console.log(result);
      })
      .catch((error) => {
        Toast.show({
          text: error.message,
          duration: 2000,
        });
        console.log(error);
      });
  };

  return (
    <Container>
      <SafeAreaView style={GlobalStyles.droidSafeArea}>
        <Animatable.View
          style={styles.Loginform}
          styles={{ paddingLeft: 10, marginRight: 10 }}
          animation="fadeInUpBig"
        >
          <View>
            <Thumbnail
              resizeMode="contain"
              style={{
                width: 200,
                height: 200,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              source={require("../assets/logo.png")}
            />
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
                      style={{ marginTop: 7, marginRight: 10 }}
                      name="eye-off"
                      size={20}
                      color="black"
                    />
                  ) : (
                    <Feather
                      style={{ marginTop: 7, marginRight: 10 }}
                      name="eye"
                      size={20}
                      color="black"
                    />
                  )}
                </Button>

                <Icon name="lock-closed-outline"></Icon>
              </Item>
            </Form>

            <TouchableOpacity>
              <Button
                style={styles.Button}
                primary
                iconRight
                rounded
                onPress={onSignIn}
                block
              >
                <Text>LOGIN</Text>
              </Button>
            </TouchableOpacity>
            <TouchableOpacity>
              <Button
                bordered
                block
                style={{
                  marginTop: 10,
                  borderColor: "rgb(250,91,90)",
                  borderBottomWidth: 3,
                  borderLeftWidth: 3,
                  borderRightWidth: 3,
                  borderTopWidth: 3,
                  marginRight: 30,
                  marginLeft: 30,
                }}
                rounded
                onPress={() => navigation.navigate("Registration")}
              >
                <Text style={{ color: "black" }}> Register</Text>
              </Button>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </SafeAreaView>
    </Container>
  );
}
export default LoginScreen;

//====================================================================//

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
    marginTop: 15,
    backgroundColor: "rgb(250,91,90)",
    marginBottom: 10,
    marginRight: 30,
    marginLeft: 30,
  },
});
