import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {Container,Text, List, ListItem, Content,Body,Left,Right,Icon,Thumbnail} from "native-base";
import { StyleSheet, Touchable, TouchableOpacity} from "react-native";
import Hypothermia from '../First-Aid Screens/Hypothermia';
import Meningitis from '../First-Aid Screens/Meningitis';
import Poisoning from '../First-Aid Screens/Poisoning';
import Seizure from '../First-Aid Screens/Seizure';
import { shadow } from 'react-native-paper';
export default function FirstAidSection() {

  const navigation = useNavigation();

  return (

    <Container >
      
        <Content style={{marginLeft:5,width:'95%'}}>

          <List>
          <ListItem noIndent style={styles.Buttons}  onPress={() => navigation.navigate(Hypothermia)}>
              <Left >
              <Thumbnail resizeMode="contain" style={{width: 30, height: 30}} source={require("../assets/Hypothermia.png")} />
              <Text style={{fontSize:20,marginLeft:15}}>Hypothermia</Text>
              </Left>
              <Right>
                <Icon style={{color:'black'}} name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem noIndent style={styles.Buttons}  onPress={() => navigation.navigate(Meningitis)}>
              <Left >
              <Thumbnail resizeMode="contain" style={{width: 30, height: 30}} source={require("../assets/Meningitis.png")} />
              <Text style={{fontSize:20,marginLeft:15}}>Meningitis</Text>
              </Left>
              <Right>
                <Icon style={{color:'black'}} name="arrow-forward" />
              </Right>
            </ListItem>
            
            <ListItem noIndent style={styles.Buttons}  onPress={() => navigation.navigate(Poisoning)}>
              <Left>
              <Thumbnail resizeMode="contain" style={{width: 30, height: 30}} source={require("../assets/Poisoning.png")} />
              <Text style={{fontSize:20,marginLeft:15}}>Poisoning</Text>
              </Left>
              <Right>
                <Icon style={{color:'black'}} name="arrow-forward" />
              </Right>
            </ListItem>

            <ListItem noIndent style={styles.Buttons}  onPress={() => navigation.navigate(Seizure)}>
              <Left >
              <Thumbnail resizeMode="contain" style={{width: 30, height: 30}} source={require("../assets/Seizure.png")} />
              <Text style={{fontSize:20,marginLeft:15}}>Seizure</Text>
              </Left>
              <Right>
                <Icon style={{color:'black'}} name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
  );
}

const styles = StyleSheet.create({
  content:{
    backgroundColor: '#f6f6f6',
  },
  Buttons: {
    marginTop:10,
    marginBottom:10,
    marginLeft:5,
    marginRight:5,
    borderTopRightRadius:20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: '#f6f6f6',
    borderRadius:20,
    shadowColor: 'rgba(46, 229, 157, 0.4)',
    elevation: 6,

  }

});

