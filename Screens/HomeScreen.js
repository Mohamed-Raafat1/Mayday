import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { Button, Container, Content, View } from "native-base";

function HomeScreen({ navigation }) {
  return (
    <Container style={styles.container}>
        <View>
      <TouchableOpacity onPress={()=> navigation.navigate("DiagnosisScreen")}>
        <Image
          style={styles.sosButton}
          source={require("../assets/red-button.png")}
          on
        />
      </TouchableOpacity>
      </View>
    </Container>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  sosButton: {
    width: 200,
    height: 200,
  },
});
