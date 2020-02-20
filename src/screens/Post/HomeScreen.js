import React from "react";
import { View, StyleSheet } from "react-native";

import PostForm from "./PostForm";
import Posts from "./Posts";

const HomeScreen = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <PostForm />
      <Posts />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default HomeScreen;
