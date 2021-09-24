import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/actions";
import { useLayoutEffect } from "react";
import Toast from "react-native-simple-toast";

import Modal from "react-native-modal";
import filter from "lodash.filter";
import firebase from "firebase";
import { AntDesign, Ionicons } from "@expo/vector-icons";
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
  Input,
  Thumbnail,
  FlatList,
  Fab,
  Item,
} from "native-base";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { update } from "lodash";
let sharedChatid;

const Stack = createStackNavigator();
function SOS({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setusers] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState();
  let flag = 0;
  //Toggle Switch to enable SOS
  // const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  //To save contact numbers (first contact only right now as a Test)

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.currentUser);
  let EmergencyContacts = useSelector(
    (state) => state.userState.currentUser.EmergencyContacts
  );

  // const [EmergencyContacts, setEmergencyContacts] = useState(
  //   currentUser.EmergencyContacts
  // );

  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection("users")
      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setusers(users);
        setFullData(users);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  useLayoutEffect(() => {
    dispatch(fetchUser());
  }, []);

  function Update() {
    console.log("upppppppppppppppppppppppppppppppppp");
    firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .update({
        EmergencyContacts: EmergencyContacts,
      })
      .catch((error) => {
        Toast.show({
          text: error.message,
          duration: 2000,
        });
        console.log(error);
      });
  }

  function find(item, elm) {
    if (item === elm) {
      return true;
    }
    return false;
  }

  function onDelete(item) {
    let index;
    console.log(currentUser.EmergencyContacts);
    index = EmergencyContacts.findIndex(function (elm, i) {
      return item.Email === elm.Email;
    });
    let array = EmergencyContacts;
    console.log(
      "Before removal------------------------------------\n",
      EmergencyContacts
    );
    EmergencyContacts.splice(index, 1);
    console.log(
      "After removal------------------------------------\n",
      EmergencyContacts
    );
    Toast.show("Contact removed successfully");

    Update();
    // return (removed);
  }

  const openProfileModal = (contact1) => {
    setFirstName(contact1.FirstName);
    setLastName(contact1.LastName);
    setContact(contact1);
    setModalVisible(!modalVisible);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSearch = () => {
    for (var i = 0; i < users.length; i++) {
      if (searchText.toLowerCase() === users[i].Email.toLowerCase()) {
        setFirstName(users[i].FirstName);
        setLastName(users[i].LastName);
        openProfileModal(users[i]);
        return;

        // console.log("Before ------------------------------------\n", EmergencyContacts[0]);
        // console.log("------4--------")
        // EmergencyContacts.push(users[i]);
        // Toast.show("Contact is added Successfully");
        // Update();
        // return;
      }
    }
    Toast.show("User doesnt exist");
  };
  const onAdd = () => {
    if (EmergencyContacts.length < 5) {
      console.log("------1--------");
      // adding current user as an Emergency contact handling
      if (currentUser.Email.toLowerCase() === searchText.toLowerCase()) {
        console.log("------2--------");
        Toast.show("Can't add yourself as an Emergency Contact");
        return;
      }
      // handling not entering the same contact two times
      for (var i = 0; i < EmergencyContacts.length; i++) {
        if (
          searchText.toLowerCase() === EmergencyContacts[i].Email.toLowerCase()
        ) {
          console.log("------3--------");
          Toast.show("Contact is already added");
          return;
        }
      }
      EmergencyContacts.push(contact);
      Toast.show("Contact is added Successfully");
      Update();
    } else {
      Toast.show("Reached maximum number of contacts");
    }
    update();
  };

  async function createChat(uid) {
    let chatAvailable = false;
    await firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("conversations")
      .where("userid", "==", currentUser.uid)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          chatAvailable = true;
          snapshot.docs.map((chat) => {
            sharedChatid = chat.id;
          });
        }
      });

    await firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid)
      .collection("conversations")
      .where("userid", "==", uid)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          chatAvailable = true;
          snapshot.docs.map((chat) => {
            sharedChatid = chat.id;
          });
        }
      });
    //if there is no chat already created create one
    if (!chatAvailable) {
      let user = [];
      let chatid;
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            user = snapshot.data();
          } else {
            console.log("does not exist");
          }
        });
      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("conversations")
        .add({
          talkingto: user.FirstName + " " + user.LastName,
          userid: uid,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          userOne: {
            firsName: currentUser.FirstName,
            lastName: currentUser.LastName,
            email: currentUser.Email,
          },
          userTwo: {
            firsName: user.FirstName,
            lastName: user.LastName,
            email: user.Email,
          },
          latestMessage: {
            _id: "",
            createdAt: "",
            text: "",
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            chatid: "",
            user: "",
            chatRecepient: "",
            uid: "",
          },
        })
        .then((snapshot) => {
          chatid = snapshot.id;
          sharedChatid = snapshot.id;
        });
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("conversations")
        .doc(chatid)
        .set({
          talkingto: currentUser.FirstName + " " + currentUser.LastName,
          userid: firebase.auth().currentUser.uid,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          userOne: {
            firsName: currentUser.FirstName,
            lastName: currentUser.LastName,
            email: currentUser.Email,
          },
          userTwo: {
            firsName: user.FirstName,
            lastName: user.LastName,
            email: user.Email,
          },
          latestMessage: {
            _id: "",
            createdAt: "",
            text: "",
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            chatid: "",
            user: "",
            chatRecepient: "",
            uid: "",
          },
        });
      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update(
          "chats",
          firebase.firestore.FieldValue.arrayUnion({
            chatid: chatid,
            Recepient: uid,
          })
        );
      await firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .update(
          "chats",
          firebase.firestore.FieldValue.arrayUnion({
            chatid: chatid,
            Recepient: firebase.auth().currentUser.uid,
          })
        );
    }
    navigation.navigate("Chat", {
      userid: uid,
      chatid: sharedChatid,
    });
  }
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
    return EmergencyContacts.map((item) => {
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
            <TouchableOpacity
              onPress={() => {
                onDelete(item);
              }}
              primary
              rounded
            >
              <AntDesign name="deleteuser" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                createChat(item.uid);
                //chat
              }}
              primary
              rounded
            >
              <Ionicons
                name="chatbox-ellipses-outline"
                size={30}
                style={{ marginLeft: 10 }}
                color="black"
              />
            </TouchableOpacity>
          </Right>
        </ListItem>
      );
    });
  }
  if (EmergencyContacts)
    return (
      <Container>
        <Modal
          visible={modalVisible}
          backdropOpacity={0}
          onBackdropPress={toggleModal}
          style={styles.bottomModalView}
        >
          <View style={styles.modal}>
            <View>
              <Avatar.Image
                source={{
                  uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
                }}
                size={80}
              />
            </View>

            <View>
              <Title>{firstName + " " + lastName}</Title>
            </View>
            <View>
              <Button rounded style={styles.button} onPress={onAdd}>
                <Text>Add as an emergency contact</Text>
              </Button>
            </View>
          </View>
        </Modal>

        {/* <Text style={styles.Text}>Add up to 5 Emergency Contacts</Text> */}
        <Header searchBar style={{ backgroundColor: "white" }}>
          <Item style={styles.search}>
            <Icon name="ios-search" />
            <Input
              placeholder="Add up to 5 Emergency Contacts"
              onChangeText={(searchText) => setSearchText(searchText)}
            />
          </Item>
          <Text
            style={{
              marginBottom: "auto",
              marginTop: "auto",
              marginLeft: 20,
              marginRight: 10,
            }}
            onPress={handleSearch}
          >
            Search
          </Text>
        </Header>
        <View>{display()}</View>
        <Fab
          style={styles.fab}
          onPress={() => {
            openProfileModal();
          }}
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
                {/* <Text>Save</Text> */}
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
    color: "black",
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
  modal: {
    width: "100%",
    height: "40%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    backgroundColor: "white",
  },
  bottomModalView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  search: {
    borderWidth: 0,
    borderRadius: 20,
    height: 40,
    backgroundColor: "#c3c2c8",
  },
});
