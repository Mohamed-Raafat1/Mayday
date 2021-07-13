import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Container, Text, Content, Card, CardItem, Body, Left, View } from "native-base"
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Poisoning() {

  const navigation = useNavigation();

  function PoisoningNav() {
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
            <View style={{ marginBottom:15, alignSelf: 'flex-start',flexDirection: 'row', justifyContent: 'space-between' }}>
              <MaterialCommunityIcons name="numeric-1-circle" size={20} />
              <Text>
              Establish what they have taken. When? And how much?.
              </Text>
            </View>
            <View style={{ marginBottom:15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <MaterialCommunityIcons name="numeric-3-circle" size={20} />
              <Text>
              Do not give the person anything to drink unless advised by the emergency center.
              </Text>
            </View>
            <View style={{marginBottom:15, alignSelf: 'flex-start', flexDirection: 'row'}}>
              <MaterialCommunityIcons name="numeric-3-circle" size={20} />
              <Text>
              Call 123 as soon as possible
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
