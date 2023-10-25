import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import auth from '@react-native-firebase/auth';

function LoginScreen({ navigation, route }) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function register() {
    auth()
      .createUserWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }

  function signOut() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  function signIn() {
    auth()
      .signInWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
        .then(() => {
            console.log('User signed in!');
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
            }

            if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            }

            console.error(error);
        });
    }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
      <Pressable onPress={()=>signIn()}>
        <Text>Login</Text>
      </Pressable>
        <Pressable onPress={()=>register()}>
            <Text>Register</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
      <Pressable onPress={()=>signOut()}>
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}

export default LoginScreen;