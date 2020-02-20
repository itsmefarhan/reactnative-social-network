import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  FlatList
} from "react-native";
import { useRoute } from "@react-navigation/native";
import firebase, { addComment, getCurrentUser } from "../../firebase";
import globalStyles from "../../components/GlobalStyles";
import PostOrCommentRender from "./PostOrCommentRender";

const CommentForm = ({ navigation }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  const uid = firebase.auth().currentUser.uid;
  const route = useRoute();
  const { postId } = route.params;

  const getComments = querySnapshot => {
    let comments = [];
    querySnapshot.forEach(doc => {
      const { comment, username, avatar, uid, date } = doc.data();
      comments.unshift({
        commentId: doc.id,
        postId,
        comment,
        username,
        avatar,
        uid,
        date
      });
    });
    setComments(comments);
  };

  useEffect(() => {
    setLoading(true);

    firebase
      .firestore()
      .collection("/comments")
      .where("postId", "==", postId)
      .onSnapshot(getComments);

    setLoading(false);
  }, []);

  useEffect(() => {
    const func = async () => {
      let res = await getCurrentUser(uid);
      res.forEach(doc => setUser(doc.data()));
    };
    func();
  }, [uid]);

  const handleSubmit = async () => {
    const res = await addComment(
      postId,
      comment,
      uid,
      user.name,
      user.photoURL
    );
    setComment("");
    return res;
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="blue"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );

  return (
    <View>
      <View style={styles.container}>
        <View style={globalStyles.container}>
          <Image
            source={{ uri: user && user.photoURL }}
            style={globalStyles.image}
          />
          <TextInput
            placeholder="Reply to the post"
            style={styles.input}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={2}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Post"
            onPress={() => handleSubmit()}
            disabled={comment.trim() === ""}
          />
        </View>
      </View>
      <FlatList
        keyExtractor={item => item.commentId}
        data={comments}
        renderItem={({ item }) => <PostOrCommentRender item={item} />}
      />
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
  button: {
    flex: 1,
    alignSelf: "flex-end",
    marginRight: "5%",
    marginBottom: 10
  }
});

export default CommentForm;
