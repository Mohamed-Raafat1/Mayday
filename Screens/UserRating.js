import React, { Component } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Container, Content, Card, CardItem, Textarea, View, Button, Form, Text, Left } from "native-base";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TouchableOpacity } from "react-native";
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
        <Card style={{ borderRadius: 8}}>
          <CardItem style={{ flexDirection: "column", borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor:'#f6f6f6' }} header bordered>
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
              <Rating type="star" ratingCount={5} imageSize={45} showRating tintColor='#f6f6f6' ratingTextColor='red' ratingColor='#3498db' />
            </View>

          </CardItem>
        </Card>
        <Card style={{ borderRadius: 8 }}>
          <CardItem style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor:'#f6f6f6' }}>
            <View>
              <Form>
                <Textarea style={{ width: 380, height: 250 }} placeholder="Please Enter Your Feedback" />
              </Form>
            </View>
          </CardItem>
        </Card>
        <Card style={{ borderRadius: 8}}>
          <CardItem style={styles.Item}>
            <View>
              <Left>
                <Text style={{ fontSize: 20 }}>
                  What do you need help with?
                </Text>
              </Left>
              <TouchableOpacity
                style={styles.Buttons}>
                <Text>1</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Buttons}>
                <Text>2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Buttons}>
                <Text>3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Buttons}>
                <Text>4</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Buttons}>
                <Text>5</Text>
              </TouchableOpacity>
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

          title: "Please Rate Your Doctor",
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
  Buttons: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 70,
    borderTopRightRadius:20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: '#fff',
    borderRadius: 50
  },
  Item: {
    borderColor:'red',
    backgroundColor: '#f6f6f6',
    borderTopRightRadius:20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
