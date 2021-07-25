import React from "react";
import { StyleSheet, Text, Image, TouchableOpacity, Alert, StatusBar } from "react-native";
import { Button, Container, Content, View, Icon } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ViewNearestHospital from "../Screens/ViewNearestHospital";

function HomeScreen({ navigation }) {
  
  const RequestType = () =>
  Alert.alert(
    "Request Type",
    "Send Help For",
    [
      {
        text: "ME",
        onPress: () => {
          navigation.navigate("EmergencyTab")},
        
      },
      {
        text: "Someone Else",
        onPress: () => {navigation.navigate("EmergencyTab", {screen:"Diagnosis"})}
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
        <View style={{ alignItems: 'center', marginBottom: 10, }}>
          <TouchableOpacity onPress={RequestType}>
            <Image
              style={styles.sosButton}
              source={require("../assets/red-button.png")}
              on
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttons}>
          <Button style={styles.buttons} iconLeft rounded danger onPress={() => { navigation.navigate("View Nearest Hospital") }}>
            <MaterialCommunityIcons name="hospital-box" size={24} color="white" style={{ padding: 10}}   />
            <Text style={{color:"white", paddingRight: 10}}>Hospital</Text>
          </Button>
          <Button style={styles.buttons} iconLeft rounded danger onPress={() => { navigation.navigate("Chat")}}>
            <Icon name="call-outline"/>
            
            <Text style={{color:"white", paddingRight: 10, paddingLeft: 10}}>Contact Doctor</Text>
          </Button>
        </View>

      </View>
    </Container>
  );
}



export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
    justifyContent: "center",
  },
  sosButton: {
    width: 200,
    height: 200,
  },
  button: {
    shadowColor: "rgba(0, 0, 255, 255)",
    shadowOpacity: 1,
    elevation: 20,
    shadowRadius: 20,
    shadowOffset: { width: 100, height: 100 },
    backgroundColor: "rgb(250,91,90)", 
    padding: 50,
  },
  views:{
   
    

  },
  buttons:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 50,
}
});
