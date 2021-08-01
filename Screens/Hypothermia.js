import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Container, Text, Content, Card, CardItem, Body, Left, View } from "native-base"
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Data from "../Data/Hypothermia.json"
import Poison from "../Data/Poisoning.json"
export default function Hypothermia() {

  const navigation = useNavigation();
    function HypothermiaNav() {
    navigation.navigate("Home");
  }
  var res = Data.filter(function(item) {
    return item.id;
  });
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
              
                {Data.map(data =>{
                  return(
                    
                    <View key={data.id}>
                    <Text>
                    {res[0].text}
                    </Text>
                    </View>)
                })}
            </View>
            <View style={{ marginBottom:15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <MaterialCommunityIcons name="numeric-2-circle" size={20} />
              {Data.map(data =>{
                  return(
                    <View key={data.id}>
                    <Text>
                    {res[1].text}
                    </Text>
                    </View>)
                })}
            </View>
            <View style={{ marginBottom:15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <MaterialCommunityIcons name="numeric-3-circle" size={20} />
              {Data.map(data =>{
                  return(
                    <View key={data.id}>
                    <Text>
                    {res[2].text}
                    </Text>
                    </View>)
                })}
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
