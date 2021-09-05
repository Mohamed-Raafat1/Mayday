import React, { useEffect, useState } from "react";
import {
  Container,
  Text,
  List,
  ListItem,
  Content,
  Body,
  Left,
  Right,
  Icon,
  Thumbnail,
  Header,
  Item,
  Input,
  Button,
  View,
} from "native-base";
import {
  StyleSheet,
  Touchable,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";
import Modal from "react-native-modal";
import firebase from "firebase";
import filter from "lodash.filter";
import Toast from "react-native-simple-toast";
import { MaterialIcons } from "@expo/vector-icons";
import VisitedProfileScreen from "../VisitedProfileScreen";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/actions";

const SearchScreen = ({ navigation, props, route }) => {
  const currentUser = route.params.currentUser;
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setusers] = useState([]);
  const [contact, setContact] = useState();
  const [query, setQuery] = useState("");
  const [fullData, setFullData] = useState([]);
  var [isPress, setIsPress] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [id, setId] = useState("123");
  const [EmergencyContacts, setEmergencyContacts] = useState(
    currentUser.EmergencyContacts
  );


  const openProfileModal = (firstName, lastName, pressedContact) => {
    setFirstName(firstName);
    setLastName(lastName);
    setContact(pressedContact);
    setModalVisible(!modalVisible);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  var touchProps = {
    activeOpacity: 1,
    underlayColor: "#eaeaea", // <-- "backgroundColor" will be always overwritten by "underlayColor"
    //style: isPress ? styles.btnPress : styles.btnNormal, // <-- but you can still apply other style changes
    onHideUnderlay: () => setIsPress(false),
    onShowUnderlay: () => setIsPress(true),
    onPress: () => console.log("HELLO"), // <-- "onPress" is apparently required
  };

  useEffect(() => {
    let user
    const result = firebase
      .firestore()
      .collection("users")
      .where('Email', '==', 'g@g.com').get().then(doc => {
        user={...doc.data(),
        key: doc.id}
      })

        // querySnapshot.forEach((documentSnapshot) => {
        //   users.push({
        //     ...documentSnapshot.data(),
        //     key: documentSnapshot.id,
        //   });
        // });

        // setusers(users);
        // setFullData(users);
        // setLoading(false);
    // Unsubscribe from events when no longer in use
    
    },[]);

  useEffect(() => {
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
  });

  const handleSearch = (text) => {
    const formattedQuery = text;
    const filteredData = filter(fullData, (users) => {
      return contains1(users, formattedQuery);
    });
    setusers(filteredData);
    setQuery(text);
  };

  const contains1 = ({ Email }, query) => {
    var keywords = query.split(" ");
    for (var i = 0; i < keywords.length; i++) {
      if (keywords[i] == "") continue;
      if (!Email.toLowerCase().match(keywords[i])) {
        return false;
      }
    }
    return true;
  };

  const onAdd = () => {
    setEmergencyContacts((EmergencyContacts) => {
      if (EmergencyContacts.length < 5) {
        // adding current user as an Emergency contact handling
        if (currentUser.uid === contact.uid) {
          Toast.show("Can't add yourself as an Emergency Contact");
          return EmergencyContacts;
        }
        // handling not entering the same contact two times
        for (var i = 0; i < EmergencyContacts.length; i++) {
          if (contact.uid === EmergencyContacts[i].uid) {
            Toast.show("Contact is already added");
            return EmergencyContacts;
          }
        }
        Toast.show("Contact is added Successfully");
        return [...EmergencyContacts, contact];
      } else {
        Toast.show("Reached maximum number of contacts");
        return EmergencyContacts;
      }
    });
  };

  return (
    <View style={styles.container}>
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
            <Button rounded style={styles.button} onPress={() => {onAdd() ; navigation.navigate("EmergencyContactsPage");} }>
              <Text>Add as an emergency contact</Text>
            </Button>
          </View>
        </View>
      </Modal>
      <Header searchBar rounded style={{ backgroundColor: "white" }}>
        <Item>
          <Icon name="ios-search" />
          <Input
            placeholder="Search"
            value={query}
            onChangeText={(queryText) => handleSearch(queryText)}
          />
        </Item>
        <Button transparent>
          <Text>Search</Text>
        </Button>
      </Header>
      {/* onPress={() => navigation.navigate("VisitedProfile", {userData: item})} */}
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View>
            <TouchableHighlight {...touchProps}>
              <View>
                <TouchableOpacity
                  style={styles.user}
                  onPress={() => {
                    openProfileModal(item.FirstName, item.LastName, item);
                  }}
                >
                  <Text>{item.FirstName + " " + item.LastName}</Text>
                  <Text>{item.Email}</Text>
                </TouchableOpacity>
              </View>
            </TouchableHighlight>
          </View>
        )}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Buttons: {},
  search: {
    height: 60,
    borderWidth: 1,
  },
  user: {
    margin: 10,
  },

  btnNormal: {
    margin: 10,
  },
  btnPress: {
    margin: 10,
  },
  modalToggle: {
    margin: 0,

    height: "50%",
  },
  modalClose: {
    margin: 0,
  },
  modalContent: {
    flex: 0,
    height: "50%",
    margin: 0,
  },
  bottomModalView: {
    justifyContent: "flex-end",
    margin: 0,
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
});
