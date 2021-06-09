import React from "react";
import { Button, Text } from "native-base";
import { SafeAreaView } from "react-native";
//Impelement homescreen here

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView>
      <Button onPress={() => navigation.navigate("Login")}>
        <Text> Go home</Text>
      </Button>
    </SafeAreaView>
  );
}

export default HomeScreen;
