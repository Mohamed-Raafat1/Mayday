import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Container, Text, Content, Card, CardItem, Body, Left, View } from "native-base"
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet } from "react-native";
import Data from "../Data/Meningitis.json"
export default function Meningitis() {

  const navigation = useNavigation();

  function MeningitisNav() {
    navigation.navigate("Home");
  }
  var res = Data.filter(function(item) {
    return item.id;
  });
  return (
    <Container>
      <Content padder>
        <Card style={{ borderRadius: 15 }}>
          <CardItem style={styles.Item} bordered>
            <Text style={{fontSize:20, fontFamily:'sans-serif-medium'}}>Tips</Text>
          </CardItem>
          <CardItem style={{ flexDirection: 'column' }} bordered>
            <View style={styles.content}>
              <MaterialCommunityIcons name="numeric-1-circle" size={25} />
              {Data.map(data => {
                return (
                  <View key={data.id}>
                    <Text>
                      {res[0].text}
                    </Text>
                  </View>)
              })}
            </View>
            <View style={styles.content}>
              <MaterialCommunityIcons name="numeric-2-circle" size={25} />
              {Data.map(data => {
                return (
                  <View key={data.id}>
                    <Text>
                      {res[1].text}
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

const styles = StyleSheet.create({
  content: {
    marginRight: 4,
    marginBottom: 15,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  Item: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
    backgroundColor: '#ffffff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

