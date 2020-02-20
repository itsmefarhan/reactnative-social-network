import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, TextInput, Button } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Video } from "expo-av";
import firebase, { getCurrentUser, addPost } from "../../firebase";
import globalStyles from "../../components/GlobalStyles";

const PostForm = () => {
  const [post, setPost] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [videoFile, setVideoFile] = useState("");
  const [audioFile, setAudioFile] = useState("");
  const [user, setUser] = useState();
  const uid = firebase.auth().currentUser.uid;

  useEffect(() => {
    getCurrentUser(uid).then(res => res.forEach(doc => setUser(doc.data())));
  }, []);

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

      const storageRef = await firebase
        .storage()
        .ref()
        .child("postImages/" + Math.round(Math.random() * 1000000))
        .put(blob);

      const url = await storageRef.ref.getDownloadURL();
      console.log("file available at", url);
      setImageFile(url);
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: Video,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      const response = await fetch(result.uri);
      const blob = await response.blob();

      const storageRef = await firebase
        .storage()
        .ref()
        .child("postVideos/" + Math.round(Math.random() * 1000000))
        .put(blob);

      const url = await storageRef.ref.getDownloadURL();
      console.log("file available at", url);
      setVideoFile(url);
    }
  };

  const pickAudio = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false,
        type: "audio/*"
      });
      if (result.uri) {
        const response = await fetch(result.uri);
        const blob = await response.blob();

        const storageRef = await firebase
          .storage()
          .ref()
          .child("postAudios/" + Math.round(Math.random() * 1000000))
          .put(blob);

        const url = await storageRef.ref.getDownloadURL();
        console.log("file available at", url);
        setAudioFile(url)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    addPost(post, imageFile, videoFile, audioFile, uid, user.name, user.photoURL);
    setPost("");
    setImageFile("");
    setVideoFile("");
    setAudioFile("");
  };

  return (
    <View style={styles.container}>
      <View style={globalStyles.container}>
        <Image
          source={{ uri: user && user.photoURL }}
          style={globalStyles.image}
        />
        <TextInput
          placeholder="Share your thoughts"
          style={styles.input}
          value={post}
          onChangeText={setPost}
          multiline
          numberOfLines={2}
        />
      </View>
      <View style={styles.actions}>
        <FontAwesome
          name="image"
          size={25}
          color="blue"
          onPress={() => pickImage()}
        />
        <FontAwesome
          name="video-camera"
          size={25}
          color="blue"
          onPress={() => pickVideo()}
        />
        <FontAwesome
          name="file-audio-o"
          size={25}
          color="blue"
          onPress={() => pickAudio()}
        />
        <Button
          title="Post"
          onPress={() => handleSubmit()}
          disabled={post.trim() === ""}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginVertical: 3,
    width: "90%",
    alignSelf: "center"
  },
  input: {
    borderColor: "#c2b8b8",
    borderWidth: 1,
    padding: 10,
    marginLeft: 20,
    width: "75%"
  },
  actions: {
    flex: 1,
    marginHorizontal: "5%",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%"
  }
});

export default PostForm;
