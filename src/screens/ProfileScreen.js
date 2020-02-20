import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import firebase from "../firebase";
import DefaultImage from "../farhan.jpg";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";

const Profile = ({ route }) => {
  const uid = route.params.uid;
  const [profile, setProfile] = useState();

  useFocusEffect(
    React.useCallback(() => {
      let profile = {};
      firebase
        .firestore()
        .collection("/users")
        .where("uid", "==", uid)
        .get()
        .then(snapshot => {
          snapshot.forEach(
            doc => (
              (profile.id = doc.id),
              (profile.name = doc.data().name),
              (profile.email = doc.data().email),
              (profile.photoURL = doc.data().photoURL),
              (profile.uid = doc.data().uid)
            )
          );
          setProfile(profile);
        });
      return () => profile;
    }, [profile && profile.photoURL])
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      const response = await fetch(result.uri);
      const blob = await response.blob();

      // Delete current image
      if (profile && profile.photoURL) {
        await firebase
          .storage()
          .refFromURL(profile.photoURL)
          .delete();
      }
      // Add new image
      const storageRef = await firebase
        .storage()
        .ref()
        .child("images/" + Math.round(Math.random() * 1000000))
        .put(blob);

      // Get download url and update db
      const url = await storageRef.ref.getDownloadURL();
      console.log("file available at", url);
      const upd = await firebase
        .firestore()
        .collection("/users")
        .doc(profile.id)
        .update({ photoURL: url });

      // it will re-render component
      return setProfile(upd);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Image
          source={{ uri: (profile && profile.photoURL) || DefaultImage }}
          style={styles.image}
        />
        <Text style={styles.text}>{profile && profile.name}</Text>
        <View style={styles.button}>
          <Button title="Pick Image" onPress={() => pickImage()} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
    // flexDirection: "row",
    // margin: "5%"
  },
  info: {
    flexDirection: "row",
    margin: 10
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 30
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
    paddingTop: 10
  },
  button: {
    alignItems: "center",
    marginLeft: "5%",
    paddingTop: 5
  }
});

export default Profile;
