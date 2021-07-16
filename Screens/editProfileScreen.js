import React ,{ useState } from 'react';
import {Picker,Item,Label,Content, Container,Textarea, Radio, Header, Button, ListItem, Text, View, Icon, Left, Body, Right, Switch, Title ,Input ,Form} from 'native-base';
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

    return(
        

  
    <Container>
        <Content>
            
            <Form>
            <View>
            <Item floatingLabel style={{padding:10}}>
              <Label>Patient Name</Label>
              <Input />
            </Item>
            <Item style={{flexDirection:"row" ,padding:10}}>
             <RadioGroup 
            radioButtons={radioButtons} 
            onPress={onPressRadioButton} 
             />

            </Item>
            
       
            <Textarea rowSpan={5} bordered placeholder="Medical Conditions" />
          
            <Item floatingLabel last style={{padding:10}}>
              <Label>Allergies</Label>
              <Input />
            </Item>
            <Textarea rowSpan={5} bordered placeholder="Current Medications" />
            <Item floatingLabel last style={{padding:50}}>
              <Label>Treatment Considerations or Restrictions</Label>

              <Input />
            </Item>
            
            </View>
          </Form>
          
        
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
  } 
});