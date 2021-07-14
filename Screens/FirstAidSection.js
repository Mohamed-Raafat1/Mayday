import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Header, Container,Text, List, ListItem, Content, Card, CardItem, Body,Item,Icon,Input,Button,Left,Right,Thumbnail} from "native-base"
import YoutubePlayer from 'react-native-youtube-iframe';
import Hypothermia from './Hypothermia';
import Meningitis from './Meningitis';
export default function FirstAidSection() {

  const navigation = useNavigation();

  function FirstAidNav() {
    navigation.navigate("Home");
  }

  return (

    <Container>
        <Content>
          <List>
            <ListItem avatar onPress={() => navigation.push("Hypothermia")}>
              <Left>
              <Thumbnail resizeMode="contain" style={{width: 20, height: 20}} source={require("../assets/Ice.png")} />
              </Left>
              <Body>
              <Text>Hypothermia</Text>
              </Body>
            </ListItem>
            <ListItem avatar onPress={() => navigation.push("Meningitis")}>
              <Left>
              <Thumbnail resizeMode="contain" style={{width: 20, height: 20}} source={require("../assets/Meningitis.png")} />
              </Left>
              <Body>
              <Text>Meningitis</Text>
              </Body>
            </ListItem>
            <ListItem avatar onPress={() => navigation.push("Poisoning")}>
              <Left>
              <Thumbnail resizeMode="contain" style={{width: 20, height: 20}} source={require("../assets/Poisoning.png")} />
              </Left>
              <Body>
              <Text>Poisoning</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
  );
}



