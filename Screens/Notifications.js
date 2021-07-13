import React from 'react'
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
const Notifications = () => {
    return (
        <Container>
        <Content>
          <List>
            <ListItem thumbnail>
              <Left>
              <Thumbnail source={{ uri: 'https://i.pinimg.com/474x/dc/e6/c0/dce6c0923a316554572841bb6f857c31.jpg' }} />
              </Left>
              <Body>
                <Text>Sankhadeep</Text>
                <Text note numberOfLines={1}>Its time to build a difference . .</Text>
              </Body>
              <Right>
                <Button transparent>
                  <Text>View</Text>
                </Button>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    )
}

export default Notifications
