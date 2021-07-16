import { Container,Text ,Content,ListItem,Left,Icon,Button,Right,Switch,Body} from 'native-base'
import React from 'react'
import { useState } from 'react';


function LocationSettings() {
      //Toggle Switch to enable Location
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
    return (
<Container>
      <Content>
        {/* Switch  */}
        <ListItem icon style={{ marginBottom: 50 }}>
          <Left>
            <Button style={{ backgroundColor: "#FF9501" }}>
              <Icon active name="location" />
            </Button>
          </Left>
          <Body>
            <Text>Location Permission</Text>
          </Body>
          <Right>
            <Switch onValueChange={toggleSwitch} value={isEnabled} />
          </Right>
        </ListItem>
        </Content>
</Container>
    )
}

export default LocationSettings
