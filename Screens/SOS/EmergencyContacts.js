import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/actions";
import { useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");
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
  Thumbnail,
  FlatList,
  Fab,
} from "native-base";

import { StyleSheet, View } from "react-native";

const Stack = createStackNavigator();
function SOS({ navigation, route }) {
  //Toggle Switch to enable SOS
  // const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  //To save contact numbers (first contact only right now as a Test)

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(fetchUser());
  }, [route]);

  const currentUser = useSelector((state) => state.userState.currentUser);
  const contacts = currentUser.EmergencyContacts

  const [Numbers, SetNumbers] = useState("");
  
  
  const printme = () => {
    console.log("Contact1 = " + Numbers);
  };
  

  function display() {
    return contacts.map((item) => {
      return(
        <ListItem key={item.uid} icon style={{ marginBottom: 10, marginTop: 10 }}>
          <Left>
            <Thumbnail
              source={{
                uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
              }}
            />
          </Left>
          {/* Emergency Number */}
          <Body >
            <Text >{item.FirstName + ' ' + item.LastName}</Text>
            <Text note numberOfLines={1}>
              {item.PhoneNumber}
            </Text>
          </Body>
          {/* <Right>
            
            <Button onPress={printme} style={styles.button} primary rounded>
              <Icon active name="person" />
              <Text style={{ marginLeft: -30 }}>Change</Text>
            </Button>
          </Right> */}
        </ListItem>
      );
    });
  }

  return (
    <Container>      
      <View>
        {display()}
      </View>
      <Fab  onPress={() => navigation.navigate("Search", {currentUser: currentUser})}>
      <Icon name="add" />
    </Fab >
    </Container>

      
  );
}

function sosStackScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Content style={{ paddingTop: 5 }}>
              <Button transparent onPress={() => navigation.goBack()}>
                <Text>Save</Text>
              </Button>
            </Content>
          ),
          headerLeft: () => (
            <Content style={{ marginLeft: 10, paddingTop: 5 }}>
              <Button transparent onPress={() => navigation.goBack()}>
                <Ionicons
                  name="ios-arrow-back-outline"
                  size={24}
                  color="black"
                />
              </Button>
            </Content>
          ),

          title: "Emergency Contacts",
        }}
        name="Emergency Contacts"
        component={SOS}
      />
    </Stack.Navigator>
  );
}
export default sosStackScreen;

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#00C1D4",
    shadowColor: "rgba(0, 0, 255, 255)",
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 100, height: 100 },
    elevation: 10,
  },
  Title: {
    fontSize: 20,
    color: "#8fccd9",
    fontWeight: "bold",
    marginLeft: 10,
    marginVertical: 20,
  },
});
