import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity, Alert, StatusBar } from "react-native";
import { Button, Container, Content, View } from "native-base";

function HomeScreen({ navigation }) {
  
  const RequestType = () =>
  Alert.alert(
    "Request Type",
    "Send Help For",
    [
      {
        text: "ME",
        onPress: () => {
          navigation.navigate("RequestDoctor")},
        
      },
      {
        text: "Someone Else",
        onPress: () => {navigation.navigate("EmergencyTab")}
      }
    ],
    {
      cancelable: true,
    }
  );
  return (
    <Container style={styles.container}>
      <StatusBar backgroundColor={'grey'}/>
        <View>
      <TouchableOpacity onPress={RequestType}>
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
