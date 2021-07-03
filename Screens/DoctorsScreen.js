import React from 'react';
import { StyleSheet, Button, View, Text } from "react-native";

function DoctorsScreen() {
    return (
      <View style={styles.container}>
        <Text>Doctors Screen</Text>
        
      </View>
    );
  }

export default DoctorsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});