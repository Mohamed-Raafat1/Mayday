import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import React from 'react'
import { StyleSheet } from 'react-native';


const ChatList = ({navigation}) => {
    return (
        <Container>
        <Content>
          <List>

            <ListItem avatar onPress={() => navigation.navigate("Chat")}>
              <Left>
                <Thumbnail source={{ uri: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png' }} />
              </Left>
              <Body>
                <Text>Ragy </Text>
                <Text note>Someone is having heart attack..</Text>
              </Body>
              <Right>
                <Text note>3:50 pm</Text>
              </Right>
            </ListItem>

            <ListItem avatar>
              <Left>
                <Thumbnail source={{ uri: 'https://image.winudf.com/v2/image1/Y29tLnNhZGxvdmVpbWFnZXMuYWxvbmV3YWxscGFwZXJzX3NjcmVlbl8wXzE1NzMxMzY1ODJfMDQ4/screen-0.jpg?fakeurl=1&type=.jpg' }} />
              </Left>
              <Body>
                <Text>ٌRaafat</Text>
                <Text note>Help! Someone is bleeding</Text>
              </Body>
              <Right>
                <Text note>5:00 pm</Text>
              </Right>
            </ListItem>

            <ListItem avatar>
              <Left>
                <Thumbnail source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEto-hmQKT941VVnlZlMEmUQNBzT6TXMAb5w&usqp=CAU' }} />
              </Left>
              <Body>
                <Text>Badawi</Text>
                <Text note>Can't Breathe..</Text>
              </Body>
              <Right>
                <Text note>7:43 pm</Text>
              </Right>
            </ListItem>

          </List>
        </Content>
      </Container>
    )
}

export default ChatList;
const styles = StyleSheet.create(
    {
      button:{
          marginTop: 50,
          marginBottom: 10,
          alignContent: "center",
          backgroundColor: "rgb(250,91,90)"
      } 
    });