import React ,{ useState } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch, Title ,Input} from 'native-base';

function SOS() {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return(
    <Container>
        <Header style={{backgroundColor: "#CD113B"}} >
        <Title>SOS Emergency Contacts</Title>
        </Header>
        <Content>
          <ListItem icon style={{marginBottom:50}}>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active name="person" />
              </Button>
            </Left>
            <Body>
              <Text>Emergency Contacts</Text>
            </Body>
            <Right>
              <Switch onValueChange={toggleSwitch}  value={isEnabled} />
            </Right>
          </ListItem>

          <ListItem icon style={{marginBottom:10}}>
            <Left>
            <Text>1.</Text>
            </Left>
            <Body>
                <Input placeholder='First Contact' />
            </Body>
            <Right>
            <Button style={{ backgroundColor: "#9FE6A0" }}>
                <Icon active name="person" />
              </Button>
            </Right>
          </ListItem>
          <ListItem icon style={{marginBottom:10}}>
            <Left>
            <Text>2.</Text>
            </Left>
            <Body>
                <Input placeholder='Second Contact' />
            </Body>
            <Right>
            <Button style={{ backgroundColor: "#9FE6A0" }}>
                <Icon active name="person" />
              </Button>
            </Right>
          </ListItem>
          <ListItem icon style={{marginBottom:10}}>
            <Left>
            <Text>3.</Text>
            </Left>
            <Body>
                <Input placeholder='Third Contact' />
            </Body>
            <Right>
            <Button style={{ backgroundColor: "#9FE6A0" }}>
                <Icon active name="person" />
              </Button>
            </Right>
          </ListItem>
          <ListItem icon style={{marginBottom:10}}>
            <Left>
            <Text>4.</Text>
            </Left>
            <Body>
                <Input placeholder='Fourth Contact' />
            </Body>
            <Right>
            <Button style={{ backgroundColor: "#9FE6A0" }}>
                <Icon active name="person" />
              </Button>
            </Right>
          </ListItem>
          <ListItem icon style={{marginBottom:10}}>
            <Left>
            <Text>5.</Text>
            </Left>
            <Body>
                <Input placeholder='Fifth Contact' />
            </Body>
            <Right>
            <Button style={{ backgroundColor: "#9FE6A0" }}>
                <Icon active name="person" />
              </Button>
            </Right>
          </ListItem>
        </Content>
      </Container>

    )
}

export default SOS;