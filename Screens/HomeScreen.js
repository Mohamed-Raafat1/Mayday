import "react-native-gesture-handler";

import React, { useState } from "react";

import {
  Container,
  Text,
  View,
  Button,
  Icon,
  Form,
  Item,
  Input,
  Label,
  Content,
  Header,
} from "native-base";
import { SafeAreaView, StyleSheet } from "react-native";
import GlobalStyles from "../GlobalStyles";

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View>
        <Text>Welcome Screen</Text>
        <Form>
          <Item style={styles.Item} success={false} inlineLabel rounded>
            <Label style={styles.label}>Username</Label>
            <Input />
          </Item>
          <Item style={styles.Item} success={false} inlineLabel rounded>
            <Label style={styles.label}>Password</Label>
            <Input />
          </Item>
        </Form>
        <Button
          style={{
            alignContent: "center",
            backgroundColor: "rgb(250,91,90)",
          }}
          primary
          iconRight
          rounded
          onPress={() => navigation.navigate("Details")}
          block
        >
          <Text>LOGIN</Text>
          <Icon name="arrow-forward" />
        </Button>
      </View>
    </SafeAreaView>
  );
}
export default HomeScreen;
const styles = StyleSheet.create({
  label: {
    paddingHorizontal: 10,
  },
  Item: {
    margin: 10,
  },
});
