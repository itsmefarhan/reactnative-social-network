import React, { useState, useEffect } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import PostOrCommentRender from "./PostOrCommentRender";
import firebase from "../../firebase";

const Posts = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const getPosts = querySnapshot => {
    let posts = [];
    querySnapshot.forEach(doc => {
      const {
        post,
        imageFile,
        videoFile,
        audioFile,
        username,
        avatar,
        uid,
        date,
        likes
      } = doc.data();
      posts.push({
        postId: doc.id,
        post,
        imageFile,
        videoFile,
        audioFile,
        username,
        avatar,
        uid,
        date,
        likes
      });
    });
    setPosts(posts);
  };

  useEffect(() => {
    setLoading(true);

    firebase
      .firestore()
      .collection("/posts")
      .orderBy("date", "desc")
      .onSnapshot(getPosts);

    setLoading(false);
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="blue"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );

  return (
    <FlatList
      keyExtractor={item => item.postId}
      data={posts}
      renderItem={({ item }) => <PostOrCommentRender item={item} />}
    />
  );
};

export default Posts;
