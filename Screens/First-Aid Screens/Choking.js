import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Body,
  Left,
  View,
} from "native-base";
import YoutubePlayer from "react-native-youtube-iframe";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StyleSheet } from "react-native";
import Data from "../../Data/Choking.json";
export default function Choking() {
  const navigation = useNavigation();
  function HypothermiaNav() {
    navigation.navigate("Home");
  }
  var res = Data.filter(function (item) {
    return item.id;
  });

  const list = () => {
    return Data.map((data) => {
      return (
        <View key={data.id} style={styles.content}>
          <View flexDirection="row">
            <MaterialCommunityIcons name="circle-slice-8" size={20} />
            <Text style={styles.content}>{data.text}</Text>
          </View>
        </View>
      );
    });
  };

  return (
    <Container>
      <Content padder>
        <Card style={{ borderRadius: 15 }}>
          <CardItem style={styles.Item} bordered>
            <Text style={{ fontSize: 20, fontFamily: "sans-serif-medium" }}>
              Tips
            </Text>
          </CardItem>
          <CardItem style={{ flexDirection: "column" }} bordered>
            <View>{list()}</View>
            {/*
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
            <View style={styles.content}>
              <MaterialCommunityIcons name="numeric-3-circle" size={25} />
              {Data.map(data => {
                return (
                  <View key={data.id}>
                    <Text>
                      {res[2].text}
                    </Text>
                  </View>)
              })}
            </View>
            <View style={styles.content}>
              <MaterialCommunityIcons name="numeric-4-circle" size={25} />
              {Data.map(data => {
                return (
                  <View key={data.id}>
                    <Text>
                      {res[3].text}
                    </Text>
                  </View>)
              })}
            </View>
            <View style={styles.content}>
              <MaterialCommunityIcons name="numeric-5-circle" size={25} />
              {Data.map(data => {
                return (
                  <View key={data.id}>
                    <Text>
                      {res[4].text}
                    </Text>
                  </View>)
              })}
            </View>
            <View style={styles.content}>
              <MaterialCommunityIcons name="numeric-6-circle" size={25} />
              {Data.map(data => {
                return (
                  <View style={styles.content} key={data.id}>
                    <Text>
                      {res[5].text}
                    </Text>
                  </View>)
              })}
            </View> */}
          </CardItem>
          <View>
            <YoutubePlayer height={300} play={false} videoId={"PA9hpOnvtCk"} />
          </View>
        </Card>
      </Content>
    </Container>
  );
}
const styles = StyleSheet.create({
  content: {
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 15,
    alignSelf: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Item: {
    borderBottomColor: "grey",
    borderBottomWidth: 2,
    backgroundColor: "#ffffff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
