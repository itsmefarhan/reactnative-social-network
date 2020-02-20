import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Text, Button, Input, Icon } from "react-native-elements";
import firebase from "../../firebase.js";
import Colors from "../../components/Colors";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const handleSubmit = async () => {
    setLoading(true);
    setError();
    try {
      const login = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      if (login.user) {
        setLoading(false);
        navigation.navigate("Home");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="blue"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  if (firebase.auth().currentUser) {
    navigation.navigate("Main");
  }

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text h4 style={{ color: Colors.primary }}>
          Log into your account
        </Text>
      </View>
      <View style={styles.error}>
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      </View>
      <View style={styles.form}>
        <Input
          style={styles.input}
          placeholder="Email"
          leftIcon={<Icon name="mail" color={Colors.primary} size={25} />}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.form}>
        <Input
          secureTextEntry
          style={styles.input}
          placeholder="Password"
          leftIcon={<Icon name="lock" color={Colors.primary} size={25} />}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.form}>
        <Button
          title="Login"
          // icon={<Icon name="input" size={25} style={{ marginRight: 10 }} />}
          onPress={handleSubmit}
        />
      </View>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => navigation.navigate("Reset")}
      >
        <Text style={{ color: "blue" }}>Forgot Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => navigation.navigate("Register")}
      >
        <Text>Don't have an account?</Text>
        <Text style={{ color: "blue", marginLeft: 5 }}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

LoginScreen.navigationOptions = ({ navigation }) => {
  return {
    title: "Login"
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  error: {
    alignItems: "center",
    marginHorizontal: 40
  },
  heading: {
    alignItems: "center",
    marginBottom: 40
  },
  form: {
    marginHorizontal: 30,
    marginVertical: 10
  },
  touchable: {
    marginHorizontal: 30,
    marginVertical: 10,
    justifyContent: "center",
    flexDirection: "row"
  }
});

export default LoginScreen;
