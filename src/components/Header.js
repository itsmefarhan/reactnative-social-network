import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "../components/Colors";
import firebase from '../firebase'

const Header = props => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Ionicons name="md-arrow-back" size={25} style={{ color: "white" }} />
      </TouchableOpacity>
      <Text style={{ fontSize: 18, color: "white" }}>{props.title}</Text>
      <TouchableOpacity onPress={() => firebase.auth().signOut()}>
        <AntDesign name="logout" size={25} style={{ color: "white" }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.header,
    height: 60,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between"
    // alignItems:'center'
  }
});

export default Header;
