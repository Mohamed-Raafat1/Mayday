import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Header, Container, Tabs, Tab, ScrollableTab, Text, List, ListItem, Content, Card, CardItem, Body,Item,Icon,Input,Button } from "native-base"
import YoutubePlayer from 'react-native-youtube-iframe';
import Tab1 from './tabOne';
import Tab2 from './tabTwo';
import { color } from 'react-native-reanimated';
import { Title } from 'react-native-paper';
export default function FirstAidSection() {

  const navigation = useNavigation();

  function FirstAidNav() {
    navigation.navigate("Home");
  }

  return (

    <Container>
       <Header searchBar rounded style={{backgroundColor:'transparent'}}>
       <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
       </Header>
      <Content>
      <List>
        <ListItem itemDivider>
          <Text>Cuts and Scrapes</Text>
        </ListItem>
        <ListItem>
          <Card style={{ width: '95%' }}>
            <CardItem header bordered>
              <Text>Tip #1</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  Blood is a vital component of our bodies. When someone is bleeding, you want to prevent as much blood from leaving their body as possible. Try and find a clean cloth or bandage. Then:

                </Text>
                <Text>Apply gentle pressure for 20 to 30 minutes.</Text>
                <Text>Clean the wound by gently running clean water over it. Avoid using soap on an open wound.
                </Text>
                <Text>Apply antibiotic to the wound, like Neosporin.</Text>
                <Text>Cover the wound with a bandage.</Text>
              </Body>
            </CardItem>
            <YoutubePlayer
              height={300}
              play={false}
              videoId={'4e7evinsfm0'}
            />
          </Card>
        </ListItem>
        <ListItem itemDivider>
          <Text>Miscellaneous</Text>
        </ListItem>
        <ListItem>
        <Card style={{ width: '95%' }}>
            <CardItem header bordered>
              <Text>Tip #1</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                  Remember The "Three P's"
                  The “Three P’s” are the primary goals of first aid. They are:
                </Text>
                <Text>Preserve life</Text>
                <Text>Prevent further injury </Text>
                <Text>Promote recovery</Text>
              </Body>
            </CardItem>
            <YoutubePlayer
        height={300}
        play={false}
        videoId={'8YREVVM2n7g'}
      />
          </Card>
        </ListItem>
      </List>
      </Content>
    </Container>
  );
}



