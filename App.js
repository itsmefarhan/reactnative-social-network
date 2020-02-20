import React from "react";
import { FontAwesome } from "@expo/vector-icons";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoadingScreen from "./src/screens/Auth/LoadingScreen";
import RegisterScreen from "./src/screens/Auth/RegisterScreen";
import LoginScreen from "./src/screens/Auth/LoginScreen";
import HomeScreen from "./src/screens/Post/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CommentForm from "./src/screens/Post/CommentForm";

import Colors from "./src/components/Colors";

import firebase from "./src/firebase";

const AuthStack = createStackNavigator();
const TabStack = createBottomTabNavigator();
const CommentStack = createStackNavigator();

function Home() {
  return (
    <TabStack.Navigator>
      <TabStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: () => <FontAwesome name="home" size={25} /> }}
      />
      <TabStack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ uid: firebase.auth().currentUser.uid }}
        options={{ tabBarIcon: () => <FontAwesome name="user" size={25} /> }}
      />
    </TabStack.Navigator>
  );
}

function Comment() {
  return (
    <CommentStack.Navigator>
      <CommentStack.Screen
        name="AddComment"
        component={CommentForm}
        options={{ headerShown: false }}
      />
    </CommentStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.header },
          headerTintColor: "white"
        }}
      >
        <AuthStack.Screen name="Loading" component={LoadingScreen} />
        <AuthStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerLeft: null }}
        />
        <AuthStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerLeft: null }}
        />
        <AuthStack.Screen
          name="HomeTab"
          component={Home}
          options={({ route, focused }) => ({
            headerRight: () => (
              <FontAwesome
                name="sign-out"
                size={25}
                style={{ marginRight: 15 }}
                color="white"
                onPress={() => firebase.auth().signOut()}
              />
            )
          })}
        />
        <AuthStack.Screen name="Comment" component={Comment} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}
