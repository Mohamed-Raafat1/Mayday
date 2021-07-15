import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import { Container, Header, View, Content, Card, CardItem, CheckBox, Text, Body, Right, Left } from "native-base"
import YoutubePlayer from 'react-native-youtube-iframe';

function DiagnosisScreen() {

  const [isChecked, setIsChecked] = useState(false);

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
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
            <View style={{ marginBottom: 10, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                Is the person vomitting?
              </Text>
              <Right>
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
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
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem >
          <CardItem bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>

              <Text style={styles.text}>
                does the person have dizziness?
              </Text>
              <Right>
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
          <CardItem bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                does the person have numbness?
              </Text>
              <Right>
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
          <CardItem bordered >
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                does the person have sudden sever headache?
              </Text>
              <Right>
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
          <CardItem bordered>
            <View style={{ marginBottom: 15, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                does the person have difficulty maintaining balance?
              </Text>
              <Right>
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
          <CardItem bordered>
            <View style={{ marginBottom: 10, alignSelf: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.text}>
                does the person have difficulty in expressing themselves or understanding other people?
              </Text>
              <Right>
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
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
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
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
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
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
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
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
                <CheckBox checked={isChecked} onPress={() => setIsChecked(isChecked ? false : true)} color="rgb(250,91,90)" />
              </Right>
            </View>
          </CardItem>
        </Card>


      </Content>
    </Container>
  );
}



export default DiagnosisScreen;

const styles = StyleSheet.create({
  text: {
    paddingRight:15,
  },
});