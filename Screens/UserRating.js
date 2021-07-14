import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem,Text, View} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import { Rating} from 'react-native-ratings';
import {
  Avatar,
  Title,
} from 'react-native-paper';
export default function UserRating() {

  const navigation = useNavigation();

  function UserRatingNav() {
    navigation.navigate("Home");
  }

  return (
    <Container style={styles.container}>
      <Header style={{backgroundColor: "white"}} >
        <Title style={{marginTop:10}}>Please Rate Our Doctor</Title>
        </Header>
      <Content>
      <Card>
      <CardItem style={{flexDirection:'column'}}header bordered>
        <View >
              
              <View style={styles.avatar}>
                  <Avatar.Image
                    source={{uri: 'https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png',}}
                    size={80}
                  />
              </View>

              <View>
                <Title style={styles.title}>Ahmed Samir</Title>
              </View>

          </View>
            <View>
          <Rating
  type='star'
  ratingCount={5}
  imageSize={45}
  showRating
/>
</View>
          </CardItem>
          </Card>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 
  avatar:{
    alignItems: 'center',
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop:3,
    marginBottom: 5,
    textAlign: 'center',
  }
});

