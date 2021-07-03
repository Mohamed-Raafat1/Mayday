import React ,{ useState } from 'react';
import {Picker,Item,Label,Content, Container, Header, Button, ListItem, Text, Icon, Left, Body, Right, Switch, Title ,Input ,Form} from 'native-base';

function CurrentReport() {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return(
    <Container>
        <Header style={{backgroundColor: "#CD113B"}} >
        <Title>Incident Report</Title>
        </Header>
        <Content>
        <Form>
            <Item floatingLabel style={{padding:10}}>
              <Label>Patient Name</Label>
              <Input />
            </Item>
            <Item floatingLabel last style={{padding:10}}>
              <Label>Doctor Name</Label>
              <Input />
            </Item>
            <Item picker style={{padding:10}}>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholder="Select Accident Type"
                placeholderStyle={{ color: "#bfc6ea" }}
                placeholderIconColor="#007aff"
                // selectedValue={this.state.selected2}
                // onValueChange={this.onValueChange2.bind(this)}
              >
                <Picker.Item label="Accident Type" value="key0" />
                <Picker.Item label="Car Accident" value="key1" />
                <Picker.Item label="Heart Attack" value="key2" />
              </Picker>
            </Item>
            <Item floatingLabel last style={{padding:10}}>
              <Label>Location</Label>
              <Input />
            </Item>
            <Item floatingLabel last style={{padding:10}}>
              <Label>Condition</Label>
              <Input />
            </Item>
            
          </Form>
        </Content>
      </Container>

    )
}

export default CurrentReport;