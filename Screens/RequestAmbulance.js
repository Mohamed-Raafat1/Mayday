import React, { Component } from 'react';
import {View, Container, Header, Badge, Content, Button, Text, Icon, Card, CardItem, Thumbnail, constants, TouchableOpacity, StyleSheet } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import {Divider} from "native-base"
import MapView from 'react-native-maps';

export default function RequestAmbulance() {

  const navigation = useNavigation();

  function ReqAmbNav() {
    navigation.navigate("Home");
  }

  return (
    <View style={container}>
    <MapView style={map} />
  </View>
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

    const container ={
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    }

    const map ={
      width: '80%',
      height: '50%',
    }
  