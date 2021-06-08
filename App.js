import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppLoading } from 'expo';
import { Container, Text } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import {SafeAreaView,StyleSheet} from 'react-native'
import { useFonts } from 'expo-font';
import GlobalStyles from './GlobalStyles';


export default function App() {
  const [loaded] = useFonts({
    Roboto: require('native-base/Fonts/Roboto.ttf'),
    Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
  });
  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
    <Container>
        <Text>Open up App.js to start working on your app!</Text>
      </Container>
      </SafeAreaView>
  );
}


const styles= StyleSheet.create({
  droidSafeArea: {
      flex: 1,
    
      paddingTop: Platform.OS === 'android' ? 25 : 0
  },
});