import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image } from 'react-native';
import auth from '@react-native-firebase/auth';

function RegisterScreen({ navigation, route }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState('jane.doe@example.com');
  const [password, setPassword] = useState('SuperSecretPassword!');

  function register() {
    auth()
      .createUserWithEmailAndPassword(email, password)
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

  const signIn = () => {
    navigation.navigate('LoginScreen');
  };

  function onAuthStateChanged(user) {
    setUser(user);
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
           className={'border-b-2 border-black/50 bg-black/5 rounded-t-md'}
           onChangeText={setEmail}
              value={email}
         />

         <TextInput
           placeholder={'Password'}
           className={'border-b-2 border-black/50 my-2 bg-black/5 rounded-t-md'}
           secureTextEntry={true}
           onChangeText={setPassword}
           value={password}
         />

         <View className={'flex-row justify-between mt-4 gap-2'}>
                    <Pressable
                      className={'flex-1 rounded-md bg-white/70 flex items-center justify-center p-2'}
                      onPress={() => register()}
                    >
                      <Text>Register</Text>
                    </Pressable>
           <Pressable
             className={'flex-1 rounded-md bg-white/70 flex items-center justify-center p-2'}
             onPress={() => signIn()}
           >
             <Text>Login</Text>
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

export default RegisterScreen;