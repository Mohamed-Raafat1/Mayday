import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import { Container, Text, Content, Card, CardItem, Body, Left, View } from "native-base"

import {
  Avatar,
  Title,
  Caption,
  TouchableRipple,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


function ProfileScreen() {
    return(
        <Container style={styles.container}>
            <View style={styles.userInfoSection}>
              
                <View style={styles.avatar}>
                    <Avatar.Image
                      source={{uri: 'https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png',}}
                      size={80}
                    />
                </View>
                <View>
                  <Title style={styles.title}>Omar Hesham</Title>
                </View>
                <View>
                  <Text style={{color:"#777777", textAlign: 'center'}}>5 May, 2000 (21 years)</Text>
                </View>
            </View>

            <View>
              <View style={styles.row}>
                <MaterialCommunityIcons name="phone" color="#777777" size={20}/>
                <Text style={{color:"#777777", marginLeft: 20}}>0123456789</Text>
              </View>
              <View style={styles.row}>
                <MaterialCommunityIcons name="email" color="#777777" size={20}/>
                <Text style={{color:"#777777", marginLeft: 20}}>omar@gmail.com</Text>
              </View>
            </View>
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: 1,
              }}
            />
            
      <Content padder>
        <Card>
          <CardItem header bordered>
            <Text>Medical ID</Text>
          </CardItem>
          <CardItem style={{ flexDirection: 'column'}}bordered>
            <View style={{ marginBottom:15, alignSelf: 'flex-start',flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>
              Blood type:
              </Text>
            </View>

            <View style={{ marginBottom:15, alignSelf: 'flex-start',flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>
              Blood type:
              </Text>
            </View>
          </CardItem>
        </Card>
      </Content>
    </Container>
    )
}

export default ProfileScreen;



const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    userInfoSection: {
      paddingHorizontal: 30,
      paddingBottom: 35,
      backgroundColor: "#e8fbff",
    },
    avatar:{
      alignItems: 'center',
      marginTop: 15,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop:3,
      marginBottom: 5,
      textAlign: 'center',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
      fontWeight: '500',
    },
    row: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    medicalID:{
      marginTop: 15,
      paddingHorizontal: 30,
    },
    medicalIDTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    medicalIDItem:{
      marginTop:10,
      fontSize: 20,
      color:"#777777",
    },
    infoBoxWrapper: {
      borderBottomColor: '#dddddd',
      borderBottomWidth: 1,
      borderTopColor: '#dddddd',
      borderTopWidth: 1,
      flexDirection: 'row',
      height: 100,
    },
    infoBox: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuWrapper: {
      marginTop: 10,
    },
    menuItem: {
      flexDirection: 'row',
      paddingVertical: 15,
      paddingHorizontal: 30,
    },
    menuItemText: {
      color: '#777777',
      marginLeft: 20,
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 26,
    },
  });