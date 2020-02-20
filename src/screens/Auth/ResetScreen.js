import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  TextInput,
  Button
} from "react-native";


const ResetScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Reset</Text>
    </View>
  );
};

ResetScreen.navigationOptions = ({ navigation }) => {
  return {
    title: 'Reset'    
  };
};

const styles = StyleSheet.create({
  container: {
   flex:1,
   justifyContent:'center',
   alignItems:'center'
  }
});

export default ResetScreen;
