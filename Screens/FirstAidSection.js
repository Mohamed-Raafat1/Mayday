import React from 'react';
import {StatusBar} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header, Container,Text, List, ListItem, Content, Card, CardItem, Body,Item,Icon,Input,Button,Left,Right,Thumbnail} from "native-base"
import YoutubePlayer from 'react-native-youtube-iframe';
import Hypothermia from './Hypothermia';
import Meningitis from './Meningitis';
export default function FirstAidSection() {

  const navigation = useNavigation();

  return (

    <Container>
      
        <Content>

          <List>
            <ListItem avatar onPress={() => navigation.navigate("Hypothermia")}>
              <Left>
              <Thumbnail resizeMode="contain" style={{width: 20, height: 20}} source={require("../assets/Ice.png")} />
              </Left>
              <Body>
              <Text>Hypothermia</Text>
              </Body>
            </ListItem>

            <ListItem avatar onPress={() => navigation.navigate("Meningitis")}>
              <Left>
              <Thumbnail resizeMode="contain" style={{width: 20, height: 20}} source={require("../assets/Meningitis.png")} />
              </Left>
              <Body>
              <Text>Meningitis</Text>
              </Body>
            </ListItem>
            
            <ListItem avatar onPress={() => navigation.navigate("Poisoning")}>
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



