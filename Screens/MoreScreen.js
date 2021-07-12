import React from "react";
import { StyleSheet, Button, View, Text } from "react-native";

function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text>More Screen</Text>
    </View>
  );
}

export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

