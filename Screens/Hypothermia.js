import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Container, Text, Content, Card, CardItem, Body, Left, View } from "native-base"
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function Hypothermia() {

  const navigation = useNavigation();

  function HypothermiaNav() {
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
            <View style={{ marginBottom:15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <MaterialCommunityIcons name="numeric-1-circle" size={20} />
              <Text>
                The environment is usually cold but a person can develop hypothermia in warm environment as well.
              </Text>
            </View>
            <View style={{ marginBottom:15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <MaterialCommunityIcons name="numeric-2-circle" size={20} />
              <Text>
              Call 123 as soon as possible, or get someone else to do it.
              </Text>
            </View>
            <View style={{ marginBottom:15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <MaterialCommunityIcons name="numeric-3-circle" size={20} />
              <Text>
              warm the person slowly by wrapping them in a blanket and giving them warm drinks and high-energy foods.
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
