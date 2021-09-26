import React, { useState, useEffect  } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Container, Text, List, ListItem, Content, Body, Left, Right, Thumbnail, Header, Item, Input, Button, View, Title, Card } from "native-base";
import { StyleSheet, Touchable, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal";
import firebase from "firebase";
import filter from 'lodash.filter';
import YoutubePlayer from 'react-native-youtube-iframe';
import Hypothermia from './First-Aid Screens/Hypothermia';
import Meningitis from './First-Aid Screens/Meningitis';
import Poisoning from './First-Aid Screens/Poisoning';
import Seizure from './First-Aid Screens/Seizure';
import Choking from './First-Aid Screens/Choking';
import HeartAttack from './First-Aid Screens/HeartAttack';
import Bleeding from './First-Aid Screens/Bleeding';
import Burns from './First-Aid Screens/Burns';
import Fractures from './First-Aid Screens/Fractures';
import { shadow, TextInput } from 'react-native-paper';
import tempData from '../Data/tempData';
import { ScrollView } from 'react-native-gesture-handler';



export default function FirstAidSection() {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [tips, setTips] = useState([]);
  const [query, setQuery] = useState('');
  const [fullData, setFullData] = useState([]);
  const [search, setSearch]= useState('');
  const [pressed , setPressed ] = useState(false);
  const [text, setText] = useState("")
  const [category1, setCategory] = useState("")
  const [video, setVideo] = useState("")
  const [modalVisible, setModalVisible] = useState(false);
  const [tip, setTip] = useState()
  const navigation = useNavigation();

  useEffect(() => {
    const subscriber = firebase.firestore()
      .collection('firstAidTips2')
      .onSnapshot(querySnapshot => {
        const tips = [];
  
        querySnapshot.forEach(documentSnapshot => {
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

  const handleSearch = text => {
    const formattedQuery = text;
    const filteredData = filter(fullData, tips => {
      return contains1(tips, formattedQuery);
    });
    setTips(filteredData);
    setQuery(text);
  };
  
  const contains1 = ({text}, query) => {
  
    var keywords = query.split(" ");
    for(var i = 0; i < keywords.length; i++){
      if(keywords[i] == "") continue;
      if (!(text.toLowerCase().match(keywords[i]))) {
        return false;
      }
    }
    return true
  };
  function checkPressed() {
    
  }

  const openProfileModal = (tip1) => {
   
    setCategory(tip1.category)
    setText(tip1.text.replace(/\\n/g, '\n\n'))
    setVideo(tip1.video)
    
    
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
            <View style={{ flexDirection: 'row'}}>
          <Thumbnail resizeMode="contain" style={{ width: 30, height: 30 }} source={{
                  uri: item.image}} />
            <Button transparent onPress={() => { openProfileModal(item)}}><Text>{item.category}</Text></Button>
            </View>
            {/* <Text>
              {item.text.replace(/\\n/g, '\n\n')}
            </Text> */}
          </Body>
        </ListItem>
    )
    });
  }


  return (

    <Container >
      <Modal
          visible={modalVisible}
          backdropOpacity={0}
          animationIn="slideInUp"
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
          style={styles.bottomModalView}
        >
          <View style={styles.modal}>
            <Header transparent style={{marginTop: 0}}>
              <Title style={{color: 'black', fontSize: 27, marginTop: 0}}>{category1}</Title>
            </Header>
            <View >
            <YoutubePlayer
              height={220}
              play={false}
              videoId={video}
            />
          </View>
            
            <Card>
              <Text style={{fontSize: 19, marginLeft: 10, margin: 5}}>{text}</Text>
            </Card>
            
            
          </View>
        </Modal>

      
      <Header searchBar rounded style={{ backgroundColor: "white" }}>
        <Item>
          <Icon name="search" size={30}/>
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
        
        
          {/* <FlatList
            data={tips}
            renderItem={({ item }) => (
              <View style={styles.tip}>
                <Thumbnail resizeMode="contain" style={{ width: 30, height: 30 }} source={require("../assets/Hypothermia.png")} />
                <Text style={{ fontSize: 20, marginLeft: 15}}>{item.category.replace(/\\n/g, '\n\n')}</Text>
                <Right>
                <Icon.Button style={{justifyContent: 'flex-end'}}  name={arrowClicked ? 'sort-up' : 'sort-down'} size={33} onPress={showText(item)}/>
                </Right>
                  <Text>{item.text.replace(/\\n/g, '\n\n')}</Text>
              </View>
              
            )}
        /> */}
            

        
        {/* <List>
          <ListItem noIndent style={styles.Buttons} onPress={() => navigation.navigate(Hypothermia)}>
            <Left >
              <Thumbnail resizeMode="contain" style={{ width: 30, height: 30 }} source={require("../assets/Hypothermia.png")} />
              <Text style={{ fontSize: 20, marginLeft: 15 }}>Hypothermia</Text>
            </Left>
            <Right>
              <Icon style={{ color: 'black' }} name="arrow-forward" />
            </Right>
          </ListItem>

          <ListItem noIndent style={styles.Buttons} onPress={() => navigation.navigate(Meningitis)}>
            <Left >
              <Thumbnail resizeMode="contain" style={{ width: 30, height: 30 }} source={require("../assets/Meningitis.png")} />
              <Text style={{ fontSize: 20, marginLeft: 15 }}>Meningitis</Text>
            </Left>
            <Right>
              <Icon style={{ color: 'black' }} name="arrow-forward" />
            </Right>
          </ListItem>

          <ListItem noIndent style={styles.Buttons} onPress={() => navigation.navigate(Poisoning)}>
            <Left>
              <Thumbnail resizeMode="contain" style={{ width: 30, height: 30 }} source={require("../assets/Poisoning.png")} />
              <Text style={{ fontSize: 20, marginLeft: 15 }}>Poisoning</Text>
            </Left>
            <Right>
              <Icon style={{ color: 'black' }} name="arrow-forward" />
            </Right>
          </ListItem>

          <ListItem noIndent style={styles.Buttons} onPress={() => navigation.navigate(Seizure)}>
            <Left >
              <Thumbnail resizeMode="contain" style={{ width: 30, height: 30 }} source={require("../assets/Seizure.png")} />
              <Text style={{ fontSize: 20, marginLeft: 15 }}>Seizure</Text>
            </Left>
            <Right>
              <Icon style={{ color: 'black' }} name="arrow-forward" />
            </Right>
          </ListItem>

          <ListItem noIndent style={styles.Buttons} onPress={() => navigation.navigate(Choking)}>
            <Left >
              <Thumbnail resizeMode="contain" style={{ width: 30, height: 30 }} source={require("../assets/Choking.png")} />
              <Text style={{ fontSize: 20, marginLeft: 15 }}>Choking</Text>
            </Left>
            <Right>
              <Icon style={{ color: 'black' }} name="arrow-forward" />
            </Right>
          </ListItem>

          <ListItem noIndent style={styles.Buttons} onPress={() => navigation.navigate(HeartAttack)}>
            <Left >
              <Thumbnail resizeMode="contain" style={{ width: 30, height: 30 }} source={require("../assets/HeartAttack.png")} />
              <Text style={{ fontSize: 20, marginLeft: 15 }}>Heart Attack</Text>
            </Left>
            <Right>
              <Icon style={{ color: 'black' }} name="arrow-forward" />
            </Right>
          </ListItem>

          <ListItem noIndent style={styles.Buttons} onPress={() => navigation.navigate(Bleeding)}>
            <Left >
              <Thumbnail resizeMode="contain" style={{ width: 30, height: 30 }} source={require("../assets/Bleeding.png")} />
              <Text style={{ fontSize: 20, marginLeft: 15 }}>Bleeding</Text>
            </Left>
            <Right>
              <Icon style={{ color: 'black' }} name="arrow-forward" />
            </Right>
          </ListItem>

          <ListItem noIndent style={styles.Buttons} onPress={() => navigation.navigate(Burns)}>
            <Left >
              <Thumbnail resizeMode="contain" style={{ width: 30, height: 30 }} source={require("../assets/Burns.png")} />
              <Text style={{ fontSize: 20, marginLeft: 15 }}>Burns</Text>
            </Left>
            <Right>
              <Icon style={{ color: 'black' }} name="arrow-forward" />
            </Right>
          </ListItem>

          <ListItem noIndent style={styles.Buttons} onPress={() => navigation.navigate(Fractures)}>
            <Left >
              <Thumbnail resizeMode="contain" style={{ width: 30, height: 30 }} source={require("../assets/Fractures.png")} />
              <Text style={{ fontSize: 20, marginLeft: 15 }}>Fractures</Text>
            </Left>
            <Right>
              <Icon style={{ color: 'black' }} name="arrow-forward" />
            </Right>
          </ListItem>
        </List> */}
      
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#f6f6f6',
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
    backgroundColor: '#f6f6f6',
    borderRadius: 20,
    shadowColor: 'rgba(46, 229, 157, 0.4)',
    elevation: 6,

  },
  search: {
    height:60,
    borderWidth: 1,
  },
  tip: {
    margin: 10,
    flexDirection: 'row',
  },
  bottomModalView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modal: {
    width: "100%",
    height: "90%",
    borderRadius: 10,
    borderStyle: "solid",
    backgroundColor: "white",
    padding: 10,
    paddingTop: 0
  },

});

