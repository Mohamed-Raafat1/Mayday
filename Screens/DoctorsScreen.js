import React, {useState, useEffect} from 'react';
import MapView from "react-native-maps";

import { StyleSheet, Dimensions} from "react-native";
import {Container, Header,Button, View,Text, Content, Spinner, Left, Body, Right} from "native-base";
import { Avatar, Title } from "react-native-paper";

function DoctorsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  
{/*if u want to make button call the loading:
const apiCall = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };*/}

  useEffect(()=>{
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); 
  }, []);


    return (

      <Container style={styles.container}>
   
      <Content >

        {/* if you want to activate request doctor with button
         <Button 
        rounded  
        style={{marginTop: 10, backgroundColor: "rgb(250,91,90)"}}>
          <Text>Request Doctor</Text>
        </Button> */}

          {/*add a spinner once you open the screen*/}
        {isLoading?  (<Spinner />) : ( 

          <View>
            <MapView style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height / 2,}}
              initialRegion={{
                latitude: 30.0930721,
                longitude: 31.3298159,
                latitudeDelta: 0.0,
                longitudeDelta: 0.0,
              }}
              mapType={"standard"}
            >
              <MapView.Marker
                coordinate={{
                  latitude: 30.0930721,
                  longitude: 31.3298159
                }}
                title={"title"}
                description={"description"}
              />
            </MapView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, marginBottom:15 }}>
              <Left>
                <Text style={{ fontSize: 18, color: "#777777", marginLeft: 15 }}>Nearest Hospital:{"\n"}<Text style={{ fontSize: 18, color: "#777777", fontWeight: "bold" }}>5 Mins Away</Text></Text>
              </Left>
              <Body>
                <Text style={{ fontSize: 18, color: "#777777", marginLeft: 15 }}>Location:{"\n"}<Text style={{ fontSize: 18, color: "#777777", fontWeight: "bold" }}>Masr El Gedida</Text></Text>
              </Body>
              <Right>
                <Text style={{ fontSize: 18, color: "#777777", marginLeft: 15 }}>Name:{"\n"}<Text style={{ fontSize: 18, color: "#777777", fontWeight: "bold" }}>Cleopatra Hospital</Text></Text>
              </Right>
            </View>
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
                <Title style={styles.title}>Dr Ahmed Samir</Title>
              </View>
            </View>
          </View>
        )}
        </Content>
      </Container>
    );
  }

export default DoctorsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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