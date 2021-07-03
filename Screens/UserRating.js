import React, { Component } from 'react';
import { Container, Header, Badge, Content, Button, Text, Icon, Card, CardItem, Thumbnail } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {Divider} from "native-base"
import StarReview from "react-native-star-review"

export default function UserRating() {

  const navigation = useNavigation();

  function UserRatingNav() {
    navigation.navigate("Home");
  }

  return (
    <Container>
      <Content>
      <StarReview
      starSize={30}
  ratings={5}
  stars={10}
  starColor="orange"
/>
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
  fontSize: 18,
}
const button = {
  width: 50,
  height: 50,
  alignContent: 'center',
  justifyContent: 'center'
};

