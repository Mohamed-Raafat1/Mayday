import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Container, Text, Content, Card, CardItem, Body, Left, View } from "native-base"
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Meningitis() {

  const navigation = useNavigation();

  function MeningitisNav() {
    navigation.navigate("Home");
  }

  return (
    <Container>
      <Content padder>
        <Card>
          <CardItem header bordered>
            <Text>Tips</Text>
          </CardItem>
          <CardItem style={{ flexDirection: 'column'}}bordered>
            <View style={{ marginBottom:15,alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
            <MaterialCommunityIcons name="numeric-1-circle" size={20} />
              <Text>
              The person will have a stiff neck. They may also have muscle and joint pain, high temperature, a headache, and sensitivity to light.
              </Text>
            </View>
            <View style={{ marginBottom:10, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <MaterialCommunityIcons name="numeric-2-circle" size={20} />
              <Text>
              call 123 and give the person constant reassurance while waiting for the ambulance.
              </Text>
            </View>
          </CardItem>
          <View>
          <YoutubePlayer
            height={300}
            play={false}
            videoId={'4e7evinsfm0'}
          />
          </View>
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

