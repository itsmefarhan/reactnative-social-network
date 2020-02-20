import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

import firebase from "../../firebase";

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      navigation.navigate(user ? "HomeTab" : "Login");
    });
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="blue"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default LoadingScreen;
