import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import { Container, Header, View, Content, Card, CardItem, CheckBox, Text, Body, Right, Left, Button, Footer } from "native-base"
import YoutubePlayer from 'react-native-youtube-iframe';

function DiagnosisScreen({navigation}) {

  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isChecked4, setIsChecked4] = useState(false);
  const [isChecked5, setIsChecked5] = useState(false);
  const [isChecked6, setIsChecked6] = useState(false);
  const [isChecked7, setIsChecked7] = useState(false);
  const [isChecked8, setIsChecked8] = useState(false);
  const [isChecked9, setIsChecked9] = useState(false);
  const [isChecked10, setIsChecked10] = useState(false);
  const [isChecked11, setIsChecked11] = useState(false);
  const [isChecked12, setIsChecked12] = useState(false);
  
  return (

    <Container>
      <Content padder>
        <Card>
          <CardItem header>
            <Text style={{fontWeight:'bold'}}>Allergy</Text>
          </CardItem>
          <CardItem style={{ flexDirection: 'column' }} bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                Does the person have any rash, itchiness?

              </Text>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked1} onPress={() => setIsChecked1(isChecked1 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                Is the person vomitting?
              </Text>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked2} onPress={() => setIsChecked2(isChecked2 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
        </Card>

        <Card>
          <CardItem header>
            <Text style={{fontWeight:'bold'}}>Stroke</Text>
          </CardItem>
          <CardItem  bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                Can the person raise their arms?
              </Text>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked3} onPress={() => setIsChecked3(isChecked3 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem >
          <CardItem bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>

              <Text style={styles.text}>
                does the person have dizziness?
              </Text>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked4} onPress={() => setIsChecked4(isChecked4 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
          <CardItem bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                does the person have numbness?
              </Text>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked5} onPress={() => setIsChecked5(isChecked5 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
          <CardItem bordered >
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                does the person have sudden sever headache?
              </Text>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked6} onPress={() => setIsChecked6(isChecked6 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
          <CardItem bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                does the person have difficulty maintaining balance?
              </Text>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked7} onPress={() => setIsChecked7(isChecked7 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
          <CardItem bordered>
            <View style={{ marginBottom: 10, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                does the person have difficulty in expressing themselves or understanding other people?
              </Text>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked8} onPress={() => setIsChecked8(isChecked8 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
          <CardItem bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Body>
                <Text style={styles.text}>
                  does the person have blurred vision?
                </Text>
              </Body>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked9} onPress={() => setIsChecked9(isChecked9 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
        </Card>

        <Card>
          <CardItem header>
            <Text style={{fontWeight:'bold'}}>Choking</Text>
          </CardItem>
          <CardItem bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                Does the person stopped talking suddenly, turned red or clutching his/her throat?
              </Text>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked10} onPress={() => setIsChecked10(isChecked10 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
        </Card>

        <Card>
          <CardItem header>
            <Text style={{fontWeight:'bold'}} >Broken Bones</Text>
          </CardItem>
          <CardItem bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                Does the person have any bruising, pain or swelling?

              </Text>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked11} onPress={() => setIsChecked11(isChecked11 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
        </Card>


        <Card>
          <CardItem header>
            <Text style={{fontWeight:'bold'}}>Head Injury</Text>
          </CardItem>
          <CardItem style={{ flexDirection: 'column' }} bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style ={styles.text}>
                Do you see any change in behaviour, vomitting, loss of consciousness or there is a persitent headache?

              </Text>
              <Right>
                <CheckBox style={{marginRight:10}} checked={isChecked12} onPress={() => setIsChecked12(isChecked12 ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
        </Card>
    
      </Content>

      <Footer >
         <Button onPress={()=>navigation.navigate("Home")} 
         style={{width:"100%", height:"100%", display:'flex', justifyContent:"center", alignItems:"center" , backgroundColor:"rgb(250,91,90)"}}>
            <Text >
              Send
            </Text>
          </Button>
      </Footer>

    </Container>
  );
}



export default DiagnosisScreen;

const styles = StyleSheet.create({
  text: {
    paddingRight:15,
  },
});