import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen({ navigation, route }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState('jane.doe@example.com');
  const [password, setPassword] = useState('SuperSecretPassword!');

    const storeUser = async (user) => {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.log('Error storing user:', error);
      }
    };

  const loadUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user !== null) {
        setUser(JSON.parse(user));
      }
    } catch (error) {
      console.log('Error loading user:', error);
    }
  };

  const register = () => {
    navigation.navigate('RegisterScreen');
  };

  function signOut() {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        setUser(null);
        AsyncStorage.removeItem('user');
      });
  }

  function signIn() {
    auth()
      .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('User signed in!');
            storeUser(userCredential.user);
            console.log(userCredential)
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

  function onAuthStateChanged(user) {
    setUser(user);
    if (user) {
      storeUser(user);
    } else {
      loadUser();
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber;
    }, []);

  if (initializing) return null;

  if (!user) {
    return (
   <ScrollView>
     <View className={'flex min-h-[90vh] w-full items-center justify-center px-2'}>
       <View className={'h-2/3 w-full bg-amber-200/50 rounded-3xl p-4'}>

         <Image
           source={require('./../../assets/images/logo-no-background.png')}
           className={'h-20 self-center mb-10'}
           resizeMode="contain"
         />

         <Text className={'text-3xl text-center font-bold uppercase'}>
           Login
         </Text>

         <TextInput
           placeholder={'Email'}
           value={email}
           className={'border-b-2 border-black/50 bg-black/5 rounded-t-md'}
           onChangeText={setEmail}
         />

         <TextInput
           placeholder={'Password'}
           value={password}
           className={'border-b-2 border-black/50 my-2 bg-black/5 rounded-t-md'}
           secureTextEntry={true}
           onChangeText={setPassword}
         />

         <View className={'flex-row justify-between mt-4 gap-2'}>
           <Pressable
             className={'flex-1 rounded-md bg-white/70 flex items-center justify-center p-2'}
             onPress={() => signIn()}
           >
             <Text>Login</Text>
           </Pressable>

           <Pressable
             className={'flex-1 rounded-md bg-white/70 flex items-center justify-center p-2'}
             onPress={() => register()}
           >
             <Text>Register</Text>
           </Pressable>
         </View>

       </View>
     </View>
   </ScrollView>
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