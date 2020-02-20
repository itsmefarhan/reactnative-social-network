import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Video } from "expo-av";
import Moment from "react-moment";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../../components/GlobalStyles";
import Colors from "../../components/Colors";
import DefaultImage from "../../farhan.jpg";
import firebase, { deletePost, deleteComment, likePost } from "../../firebase";

const PostOrCommentRender = ({
  item: {
    post,
    imageFile,
    videoFile,
    audioFile,
    date,
    username,
    avatar,
    postId,
    comment,
    commentId,
    uid,
    likes
  }
}) => {
  const navigation = useNavigation();

  const { currentUser } = firebase.auth();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (likes && likes.find(like => like === uid)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likes]);

  const handleDelete = async () => {
    let confirm = window.confirm("Are you sure you want to delete this post?");
    if (confirm) {
      if (imageFile) {
        await firebase
          .storage()
          .refFromURL(imageFile)
          .delete();
      }
      if (videoFile) {
        await firebase
          .storage()
          .refFromURL(videoFile)
          .delete();
      }
      deletePost(postId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={globalStyles.container}>
        <Image
          source={{ uri: avatar || DefaultImage }}
          style={globalStyles.image}
        />
        <Text style={styles.name}>{username} - </Text>
        <Moment element={Text} fromNow ago style={styles.date}>
          {date.toDate()}
        </Moment>
        {currentUser && currentUser.uid === uid && (
          <View style={styles.delete}>
            <Ionicons
              name="md-remove-circle"
              size={25}
              color={Colors.icon}
              onPress={() => (post ? handleDelete() : deleteComment(commentId))}
            />
          </View>
        )}
      </View>
      <Text style={styles.post}>{post || comment}</Text>
      {imageFile ? (
        <Image
          source={{ uri: imageFile }}
          style={{ width: 400, height: 200, marginLeft: 90, marginBottom: 10 }}
        />
      ) : null}
      {videoFile ? (
        <Video
          source={{ uri: videoFile }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          useNativeControls
          style={{ width: 400, height: 400, marginLeft: 90, marginBottom: 10 }}
        />
      ) : null}
      {audioFile ? (
        <Video
          source={{ uri: audioFile }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          useNativeControls
          style={{ width: 400, height: 100, marginLeft: 90, marginBottom: 10 }}
        />
      ) : null}
      {post ? (
        <View style={styles.icons}>
          {liked ? (
            <Ionicons
              name="md-heart"
              size={25}
              color={Colors.icon}
              onPress={() => likePost(date, uid)}
            />
          ) : (
            <Ionicons
              name="md-heart-empty"
              size={25}
              color={Colors.header}
              onPress={() => likePost(date, uid)}
            />
          )}

          <FontAwesome
            name="comment-o"
            size={25}
            color={Colors.header}
            onPress={() =>
              navigation.navigate("Comment", {
                screen: "AddComment",
                params: { postId: postId }
              })
            }
          />
        </View>
      ) : null}
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
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    paddingTop: 10
  },
  date: {
    paddingTop: 12
  },
  delete: {
    paddingTop: 6,
    // marginLeft: '20%',
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1
  },
  post: {
    marginLeft: 90,
    marginBottom: 10
  },
  icons: {
    flexDirection: "row",
    marginLeft: 90,
    justifyContent: "space-between",
    width: "50%",
    marginBottom: 10
  }
});

export default PostOrCommentRender;
