import React ,{ useState, Component } from 'react';
import {Picker,Item,Label,Content, Container,Textarea, DatePicker, Radio, Header, Button, ListItem, Text, View, Icon, Left, Body, Right, Switch, Title ,Input ,Form} from 'native-base';
import { StyleSheet,ScrollView }from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';

function EditProfileScreen({navigation}) {
    const [Selected,SetSelected]= useState(true);
    const printme = () => {console.log(Selected);}
    const Radio = [{
        id: 'Male', // acts as primary key, should be unique and non-empty string
        label: 'Male',
        value: 'Male'
    }, {
        id: 'Female',
        label: 'Female',
        value: 'Female'
    }]
    const [radioButtons, setRadioButtons] = useState(Radio);
    function onPressRadioButton(radioButtonsArray) {
        setRadioButtons(radioButtonsArray);
    }

    const [BloodType, SetBloodType] = useState("A+");
    function ChangeBloodType(inputBloodType){
      SetBloodType(inputBloodType);
    }

    // const [Dates, SetDate] = useState( ()=>{new Date()});
    // function ChangeDate(newDate) {
    //   setDate( newDate );
    // }

    return(
        
      <Container style={styles.container}>
        <Content>
          <View style={styles.userInfoSection}>
            <Item style={{ alignSelf: "center", borderBottomWidth: 0, flexDirection: "row", padding: 10 }}>
              <RadioGroup
                radioButtons={radioButtons}
                onPress={onPressRadioButton}
              />
            </Item>
            <View >
              <Item style={{ marginBottom: 20 }} floatingLabel>
                <Label>Name</Label>
                <Input style={styles.title}>Omar Hesham</Input>
              </Item>
            </View>
            <View>
              {/* <DatePicker
                // defaultDate={ ChangeDate=(2018, 4, 4)}
                // minimumDate={ ChangeDate=(2018, 1, 1)}
                // maximumDate={ ChangeDate=(2018, 12, 31)}
                locale={"en"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText="Select date"
                textStyle={{ color: "green" }}
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={SetDate}
              /> */}
              <Text style={{ color: "#777777", textAlign: 'center' }}>5 May, 2000 (21 years)</Text>
            </View>

          </View>


          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, }}>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, color: "#777777" }}>
                HEIGHT{"\n"}
                <Item style={{ borderBottomWidth: 0}}>
                  <Input style={{paddingHorizontal:5}} >170</Input>
                  <Text>cm</Text>
                </Item>

              </Text>
            </View>

            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, color: "#777777" }}>
                WEIGHT{"\n"}
                <Item style={{ borderBottomWidth: 0 }}>
                  <Input >70</Input>
                  <Text>kg</Text>
                </Item>
              </Text>
            </View>
            
            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, color: "#777777" }}>BLOOD TYPE{"\n"}
                <Item style={{ borderBottomWidth: 0 }}>
                  <Input >A+</Input>
                </Item>
              </Text>
            </View>
          </View>

          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 0.5,
              marginTop: 20
            }}
          />

          <View>
            <Text style={styles.medicalIDItem}>MEDICAL CONDITIONS</Text>
            <Textarea style={styles.medicalIdData}>Asthma</Textarea>
            <Text style={styles.medicalIDItem}>ALLERGIES</Text>
            <Textarea style={styles.medicalIdData}>Peanut allergy</Textarea>
            <Text style={styles.medicalIDItem}>MEDICATIONS</Text>
            <Textarea style={styles.medicalIdData}>Atenolol once a day</Textarea>

          </View>
          

        </Content>
      </Container>

   
     

    )
}

export default EditProfileScreen;

const styles = StyleSheet.create(
{
  button:{
      marginTop: 50,
      marginBottom: 10,
      alignContent: "center",
      backgroundColor: "rgb(250,91,90)"
  },
  container: {
    flex: 1,
    justifyContent:'space-between'
  },
  userInfoSection: {
    height:"30%",
    justifyContent:"space-evenly",
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
    marginTop:20,
    marginLeft:15,
    fontSize: 20,
    color:"#8fccd9",
    fontWeight: 'bold',
  },
  medicalIdData:{
    marginLeft:10,
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