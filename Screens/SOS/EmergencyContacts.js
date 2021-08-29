import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/actions";
import { useLayoutEffect } from "react";
import Toast from "react-native-simple-toast";
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
  const currentUser = useSelector((state) => state.userState.currentUser);
  const contacts = currentUser.EmergencyContacts;
  const [EmergencyContacts, setEmergencyContacts] = useState(
    currentUser.EmergencyContacts
  );

  useLayoutEffect(() => {
    dispatch(fetchUser());
     firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .update({
        EmergencyContacts,
      })
      .catch((error) => {
        Toast.show({
          text: error.message,
          duration: 2000,
        });
        console.log(error);
      });
  }, [route]);


  //update Contacts
  // useEffect(() => {
    
  // });



  // const onDelete = (id) => {
  //   setEmergencyContacts((EmergencyContacts) => {
  //     for (var i = 0; i < EmergencyContacts.length; i++) {
  //       if (id === EmergencyContacts[i].uid) {
  //         EmergencyContacts.splice(i, 1);
  //         Toast.show("Contact has been removed");
  //         return EmergencyContacts;
  //       }
  //     }
  //   });
  // };

  function display() {
    return contacts.map((item) => {
      return (
        <ListItem
          key={item.uid}
          icon
          style={{ marginBottom: 10, marginTop: 10 }}
        >
          <Left>
            <Thumbnail
              source={{
                uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
              }}
            />
          </Left>
          {/* Emergency Number */}
          <Body>
            <Text>{item.FirstName + " " + item.LastName}</Text>
            <Text note numberOfLines={1}>
              {item.PhoneNumber}
            </Text>
          </Body>
          <Right>
            <Button
              // onPress={onDelete(item.uid)}
              style={styles.button}
              primary
              rounded
            >
              <Icon active name="person" />
              <Text style={{ marginLeft: -30 }}>Remove</Text>
            </Button>
          </Right>
        </ListItem>
      );
    });
  }

  return (
    <Container>
      <View>
        <Text style={styles.Text}>Add up to 5 Emergency Contacts</Text>
        {display()}
      </View>
      <Fab
        style={styles.fab}
        onPress={() =>
          navigation.navigate("Search", { currentUser: currentUser })
        }
      >
        <Icon name="add" />
      </Fab>
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
    backgroundColor: "rgb(250,91,90)",
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
  Text: {
    fontSize: 15,
    color: "#8fccd9",
    fontWeight: "bold",
    marginLeft: 10,
    marginVertical: 20,
  },
  fab: {
    backgroundColor: "#00C1D4",
    shadowColor: "rgba(0, 0, 255, 255)",
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 100, height: 100 },
  },
});
