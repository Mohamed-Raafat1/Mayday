import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {Header,Container,Text, Content, Card, CardItem, Body, Separator, Left, Right, Button, Icon, Title} from "native-base"

export default function tabTwo() {

  const navigation = useNavigation();

  function tabTwoNav() {
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
                  Remember The "Three P's"
                  The “Three P’s” are the primary goals of first aid. They are:
                </Text>
                <Text>Preserve life</Text>
                <Text>Prevent further injury </Text>
                <Text>Promote recovery</Text>
              </Body>
            </CardItem>
          </Card>
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

