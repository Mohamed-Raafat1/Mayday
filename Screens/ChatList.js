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
                <Thumbnail source={{ uri: 'data:image/jpeg;base64,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' }} />
              </Left>
              <Body>
                <Text>Ragy </Text>
                <Text note>الحقوووووناااااى</Text>
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
                <Text note>خدت إيه من الكآبة؟</Text>
              </Body>
              <Right>
                <Text note>5:00 pm</Text>
              </Right>
            </ListItem>

            <ListItem avatar>
              <Left>
                <Thumbnail source={{ uri: 'https://www.dictionary.com/e/wp-content/uploads/2018/06/pics-300x300.jpg' }} />
              </Left>
              <Body>
                <Text>Mohameden</Text>
                <Text note>Heeelp!!!</Text>
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

export default ChatList
const styles = StyleSheet.create(
    {
      button:{
          marginTop: 50,
          marginBottom: 10,
          alignContent: "center",
          backgroundColor: "rgb(250,91,90)"
      } 
    });