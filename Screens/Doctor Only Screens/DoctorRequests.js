import React from 'react'
import { Container, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button,Item,Icon,View } from 'native-base';
const DoctorRequests = ({navigation}) => {
    return (
        <Container>
        <Content>
          <List>
            <ListItem itemHeader first style={{marginBottom:-30}}>
                <Text>Nearby Location Requests</Text>
            </ListItem>
            <ListItem thumbnail >
              <Left>
              <Thumbnail source={{ uri: 'https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png' }} />
              </Left>
              <Body style={{flexDirection:"column"}}>
              <Text style={{fontWeight: 'bold'}}>Sherif Mohamed</Text>
                <Text>Distance: 2 km</Text>
                <Text note numberOfLines={1}>Accident Type: Bleeding case</Text>
               <View style={{flexDirection:"row" ,justifyContent:'flex-end'}}>
               <Button transparent  >
               <Icon style={{marginRight:-10}} active name="location" />
                  <Text>Location</Text>
                </Button>
                <Button transparent >
                  <Text >Accept</Text>
                </Button>
                <Button transparent >
                  <Text style={{color:"red"}}>Decline</Text>
                </Button>
               </View>
              </Body>
            </ListItem>

            <ListItem itemHeader first style={{marginBottom:-30}}>
                <Text>Contact Requests</Text>
            </ListItem>

            <ListItem thumbnail>
              <Left>
              <Thumbnail source={{ uri: 'https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png' }} />
              </Left>
              <Body style={{flexDirection:"column"}}>
                <Text style={{fontWeight: 'bold'}}>Ahmed Mohamed</Text>
                <Text note numberOfLines={2}>Accident Type: Burn case</Text>
               <Item >
               <Button transparent onPress={() => navigation.navigate("DoctorChat")} >
                  <Text >Accept</Text>
                </Button>
                <Button transparent >
                  <Text style={{color:"red"}}>Decline</Text>
                </Button>
               </Item>
              </Body>
            </ListItem>
            
            <ListItem thumbnail>
              <Left>
              <Thumbnail source={{ uri: 'https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png' }} />
              </Left>
              <Body style={{flexDirection:"column"}}>
                <Text style={{fontWeight: 'bold'}}>Abdullah Ahmed</Text>
                <Text note numberOfLines={2}>Accident Type: Cut case</Text>
               <Item >
               <Button transparent onPress={() => navigation.navigate("DoctorChat")} >
                  <Text >Accept</Text>
                </Button>
                <Button transparent >
                  <Text style={{color:"red"}}>Decline</Text>
                </Button>
               </Item>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
}

export default DoctorRequests
