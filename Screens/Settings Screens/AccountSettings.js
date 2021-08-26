import { Container, Header, Content, List, ListItem, Text, Input ,Item ,Label ,Button} from 'native-base';
import React from 'react'
import { useState } from 'react';


function AccountSettings() {

    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("+20");
    const [CurrentPassword, setCurrentPassword] = useState("");
    const [Password, setPassword] = useState("");
    
    return (
        <Container>
        <Content>
          <List>
            <ListItem itemHeader  style={{marginBottom:-10}} >
              <Text>Change Name</Text>
            </ListItem>
            

            <ListItem itemHeader  style={{marginBottom:-10}}>
              <Text>Change Password</Text>
            </ListItem>
            <ListItem style={{flexDirection:'column'}}>             
            <Item floatingLabel style={{padding:10}}>
              <Label>Current Password</Label>
              <Input           
              secureTextEntry={true}
              value={CurrentPassword}
              onChangeText={setCurrentPassword} />
            </Item>
            <Item  floatingLabel style={{padding:10}}>
              <Label>New Password</Label>
              <Input           
              secureTextEntry={true}
              value={Password}
              onChangeText={setPassword} />
            </Item>
            </ListItem>

            <ListItem itemHeader style={{marginBottom:-10}}>
              <Text>Change Phone Number</Text>
            </ListItem>
            <ListItem>
           <Item  floatingLabel style={{padding:10}}>
              <Label>Phone Number</Label>
              <Input           
              value={PhoneNumber}
              onChangeText={setPhoneNumber} />
            </Item>
            </ListItem>
          </List>
          <Button
          style={{
            marginBottom: 10,
            alignContent: "center",
            backgroundColor: "rgb(250,91,90)",
          }}
          primary iconRight rounded block
        ><Text>Save</Text></Button>
        </Content>
      </Container>
    )
}

export default AccountSettings
