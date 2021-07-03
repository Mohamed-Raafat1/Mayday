import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {Header,Container,Text, Content, Card, CardItem, Body, Separator, Left, Right, Button, Icon, Title, View} from "native-base"
import YoutubePlayer from 'react-native-youtube-iframe';
export default function tabOne() {

  const navigation = useNavigation();

  function tabOneNav() {
    navigation.navigate("Home");
  }

  return (
    <Container>
        <Content padder>
        <Card>
            <CardItem header bordered>
              <Text>Tip #1</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                Blood is a vital component of our bodies. When someone is bleeding, you want to prevent as much blood from leaving their body as possible. Try and find a clean cloth or bandage. Then:

                </Text>
                <Text>Apply gentle pressure for 20 to 30 minutes.</Text>
                <Text>Clean the wound by gently running clean water over it. Avoid using soap on an open wound.
                </Text>
                <Text>Apply antibiotic to the wound, like Neosporin.</Text>
                <Text>Cover the wound with a bandage.</Text>            
              </Body>
            </CardItem>
          </Card>
          <View>
      <YoutubePlayer
        height={300}
        play={false}
        videoId={'AiaOSGZTwtY'}
      />
    </View>
        </Content>
      </Container>
  );
}

const card = {
  width: 350,
  height: 150
}
const text = {
  textAlign: 'center',
  fontWeight: 'bold',
  color: '#5d1a0c',
  fontSize: 18,
}
const button = {
  width: 50,
  height: 50,
  alignContent: 'center',
  justifyContent: 'center'
};
const video ={
    marginTop: 20,
    maxHeight: 200,
    width: 320,
    flex: 1
  }