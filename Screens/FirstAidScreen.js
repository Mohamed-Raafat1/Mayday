import React from 'react';
import { StyleSheet, Button, View, Text } from "react-native";

function FirstAidScreen() {
    return (
      <View style={styles.container}>
        <Text>First Aid Screen</Text>
        
      </View>
    );
  }

export default FirstAidScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});