import React from 'react'
import { SafeAreaView, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Body,
  Left,
  View,
  Thumbnail,
  Right,
  Header,
  Icon,
  Button,

} from "native-base";

import { Avatar, Title, Caption, TouchableRipple } from "react-native-paper";

const VisitedProfileScreen = ({navigation, route}) => {
    const user = route.params.userData;
    
    return (
        <Container style={styles.container}>
      
        <View style={styles.userInfoSection}>
          <View style={styles.avatar}>
            <Avatar.Image
              source={{
                uri: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
              }}
              size={80}
            />
          </View>

          <View>
            <Title style={styles.title}>
            {user.FirstName + ' ' + user.LastName}
            </Title>
          </View>
          <View>
              <Button rounded style={styles.button}><Text>Add as an emergency contact</Text></Button>
          </View>
        </View>
        </Container>
    )
}

export default VisitedProfileScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    userInfoSection: {
      paddingBottom: 35,
      backgroundColor: "#e8fbff",
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
    button: {
        marginLeft: "auto",
        marginRight: "auto",
    },
  });
