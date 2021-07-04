import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Button } from "native-base";

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image
          style={styles.sosButton}
          source={require("../assets/red-button.png")}
        />
      </TouchableOpacity>
    </View>
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
