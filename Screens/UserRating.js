import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  View,
  Button,
} from "native-base";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";
import { Avatar, Title } from "react-native-paper";
const Stack = createStackNavigator();
function UserRating() {
  const navigation = useNavigation();

  function UserRatingNav() {
    navigation.navigate("Home");
  }

  return (
    <Container style={styles.container}>
      <Content>
        <Card>
          <CardItem style={{ flexDirection: "column" }} header bordered>
            <View>
              <View style={styles.avatar}>
                <Avatar.Image
                  source={{
                    uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
                  }}
                  size={80}
                />
              </View>

              <View>
                <Title style={styles.title}>Ahmed Samir</Title>
              </View>
            </View>
            <View>
              <Rating type="star" ratingCount={5} imageSize={45} showRating />
            </View>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
}
export default function userRatingStackScreen({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Content style={{ marginLeft: 10, paddingTop: 5 }}>
              <Button transparent onPress={() => navigation.goBack()}>
                <Ionicons
                  name="ios-arrow-back-outline"
                  size={24}
                  color="black"
                />
              </Button>
            </Content>
          ),

          title: "Please Rate your doctor",
        }}
        name="UserRating"
        component={UserRating}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  avatar: {
    alignItems: "center",
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 3,
    marginBottom: 5,
    textAlign: "center",
  },
});
