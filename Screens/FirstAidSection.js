import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import filter from "lodash.filter";
import {
  Body,
  Button,
  Card,
  Container,
  Header,
  Left,
  Input,
  Item,
  ListItem,
  Text,
  Thumbnail,
  Title,
  View,
  Icon,
} from "native-base";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import YoutubePlayer from "react-native-youtube-iframe";

export default function FirstAidSection() {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [tips, setTips] = useState([]);
  const [query, setQuery] = useState("");
  const [fullData, setFullData] = useState([]);
  const [search, setSearch] = useState("");
  const [pressed, setPressed] = useState(false);
  const [text, setText] = useState("");
  const [category1, setCategory] = useState("");
  const [video, setVideo] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [tip, setTip] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection("firstAidTips2")
      .onSnapshot((querySnapshot) => {
        const tips = [];

        querySnapshot.forEach((documentSnapshot) => {
          tips.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setTips(tips);
        setFullData(tips);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  const handleSearch = (text) => {
    const formattedQuery = text;
    const filteredData = filter(fullData, (tips) => {
      return contains1(tips, formattedQuery);
    });
    setTips(filteredData);
    setQuery(text);
  };

  const contains1 = ({ text }, query) => {
    var keywords = query.split(" ");
    for (var i = 0; i < keywords.length; i++) {
      if (keywords[i] == "") continue;
      if (!text.toLowerCase().match(keywords[i])) {
        return false;
      }
    }
    return true;
  };

  const openProfileModal = (tip1) => {
    setCategory(tip1.category);
    setText(tip1.text.replace(/\\n/g, "\n\n"));
    setVideo(tip1.video);

    setModalVisible(!modalVisible);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  function display() {
    return tips.map((item) => {
      return (
        <ListItem
          key={item.category}
          style={{ marginBottom: 10, marginTop: 10 }}
        >
          <Body>
            <View style={{ flexDirection: "row" }}>
              <Thumbnail
                resizeMode="contain"
                style={{ width: 30, height: 30 }}
                source={{
                  uri: item.image,
                }}
              />
              <Button
                transparent
                onPress={() => {
                  openProfileModal(item);
                }}
              >
                <Text>{item.category}</Text>
              </Button>
            </View>
          </Body>
        </ListItem>
      );
    });
  }

  return (
    <Container>
      <Modal
        visible={modalVisible}
        backdropOpacity={0}
        animationIn="slideInUp"
        // onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={styles.bottomModalView}
      >
        <View style={styles.modal}>
          <Header transparent style={{ marginTop: -35 }}>
            <Left>
              <Button transparent onPress={toggleModal}>
                <Icon
                  name="arrow-back"
                  fontSize={27}
                  style={{ color: "black" }}
                />
              </Button>
            </Left>
            <Body>
              <Title style={{ color: "black", fontSize: 27, marginTop: 0 }}>
                {category1}
              </Title>
            </Body>
          </Header>
          <View>
            <YoutubePlayer height={220} play={false} videoId={video} />
          </View>

          <Card>
            <Text style={{ fontSize: 19, marginLeft: 10, margin: 5 }}>
              {text}
            </Text>
          </Card>
        </View>
      </Modal>

      <Header searchBar rounded style={{ backgroundColor: "white" }}>
        <Item>
          <Icon name="search" size={30} />
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
      <ScrollView>{display()}</ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#f6f6f6",
  },
  Buttons: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: "#f6f6f6",
    borderRadius: 20,
    shadowColor: "rgba(46, 229, 157, 0.4)",
    elevation: 6,
  },
  search: {
    height: 60,
    borderWidth: 1,
  },
  tip: {
    margin: 10,
    flexDirection: "row",
  },
  bottomModalView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modal: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    borderStyle: "solid",
    backgroundColor: "white",
    padding: 10,
    paddingTop: 0,
    marginTop: 0,
  },
});
