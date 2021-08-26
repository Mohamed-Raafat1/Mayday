import React, { useState, useEffect  } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Container, Text, List, ListItem, Content, Body, Left, Right, Icon, Thumbnail, Header, Item, Input, Button, View } from "native-base";
import { StyleSheet, Touchable, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import firebase from "firebase";
import filter from 'lodash.filter';
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



export default function FirstAidSection() {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [tips, setTips] = useState([]);
  const [query, setQuery] = useState('');
  const [fullData, setFullData] = useState([]);
  const [search, setSearch]= useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const subscriber = firebase.firestore()
      .collection('firstAidTips')
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


  return (

    <Container >

      
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
        
        
          <FlatList
            data={tips}
            renderItem={({ item }) => (
              <View style={styles.tip}>
                <Text>{item.text}</Text>
              </View>
            )}
        />
            

        
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
  }

});

