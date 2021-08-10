import {
    Container,
    Header,
    Content,
    List,
    ListItem,
    Left,
    Body,
    Right,
    Thumbnail,
    Text,
  } from "native-base";
  import React from "react";
  import { StyleSheet } from "react-native";
  import { createStackNavigator } from "@react-navigation/stack";
  import { useRoute, useNavigation } from "@react-navigation/native";
  import { useNavigationState } from "@react-navigation/native";
  

 function AccidentsList({navigation}){
  
   
    
  
    return (
      <Container>
        <Content>
          <List>
            <ListItem avatar onPress={() => navigation.navigate("CurrentReport")}>
              <Left>
                <Thumbnail
                  source={{
                    uri: "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png",
                  }}
                />
              </Left>
              <Body>
                <Text>Ragy </Text>
                <Text note>Accident Type: Bleeding case</Text>
              </Body>
              <Right>
                <Text note>25/1/2021, 3:50 pm</Text>
              </Right>
            </ListItem>
  
            <ListItem avatar onPress={() => navigation.navigate("CurrentReport")}>
              <Left>
                <Thumbnail
                  source={{
                    uri: "https://image.winudf.com/v2/image1/Y29tLnNhZGxvdmVpbWFnZXMuYWxvbmV3YWxscGFwZXJzX3NjcmVlbl8wXzE1NzMxMzY1ODJfMDQ4/screen-0.jpg?fakeurl=1&type=.jpg",
                  }}
                />
              </Left>
              <Body>
                <Text>ٌRaafat</Text>
                <Text note>Accident Type: Burn case</Text>
              </Body>
              <Right>
                <Text note>3/5/2021, 5:00 pm</Text>
              </Right>
            </ListItem>
  
            <ListItem avatar onPress={() => navigation.navigate("CurrentReport")}>
              <Left>
                <Thumbnail
                  source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEto-hmQKT941VVnlZlMEmUQNBzT6TXMAb5w&usqp=CAU",
                  }}
                />
              </Left>
              <Body>
                <Text>Badawi</Text>
                <Text note>Accident Type: Cut case</Text>
              </Body>
              <Right>
                <Text note>8/7/2021, 7:43 pm</Text>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  
 }
  export default AccidentsList;

//  const AccidentListStackScreen = ({ navigation, previous }) => (
//     <AccidentListStack.Navigator>
//       <AccidentListStack.Screen
//         name="AccidentList"
//         component={AccidentList}
//         options={{
//           title: "Accidents",
//           headerShown: usePreviousRouteName() == "Home" ? true : false,
//         }}
//       />
//       {/* <AccidentListStack.Screen
//         name="Current Report"
//         component={CurrentReport}
//         options={{ title: "Current Report" }}
//       /> */}
//     </AccidentListStack.Navigator>
//   );
//   export default AccidentListStackScreen;
  const styles = StyleSheet.create({
    button: {
      marginTop: 50,
      marginBottom: 10,
      alignContent: "center",
      backgroundColor: "rgb(250,91,90)",
    },
  });
  