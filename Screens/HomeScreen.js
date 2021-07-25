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
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableOpacity onPress={RequestType}>
            <Image
              style={styles.sosButton}
              source={require("../assets/red-button.png")}
              on
            />
          </TouchableOpacity>
        </View>
        <View style={{
          flex: 0.2, alignSelf: 'stretch',
          flexDirection:'row',
          justifyContent: 'space-between',
          
        }}>
          <Button style={styles.Button} iconleft onPress={() => { navigation.navigate("View Nearest Hospital") }}>
            <MaterialCommunityIcons name="hospital-box" size={24} color="white"  />
            <Text style={{color:"white"}}>Hospital</Text>
          </Button>
          <Button style={styles.Button} iconleft rounded onPress={() => { navigation.navigate("Chat")}}>
            
            <Text>Contact Doctor</Text>
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
    alignItems: "center",
    justifyContent: "center",
  },
  sosButton: {
    width: 200,
    height: 200,
  },
  Button: {
    shadowColor: "rgba(0, 0, 255, 255)",
    shadowOpacity: 1,
    elevation: 20,
    shadowRadius: 20,
    shadowOffset: { width: 100, height: 100 },
    backgroundColor: "rgb(250,91,90)",
    marginBottom: 10,
    justifyContent:'center',
    
    
  },
  views:{
   
    

  },
});
