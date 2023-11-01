import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

function ProfileScreen ({ navigation, route }) {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [user, setUser] = useState();

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                console.log('User:', user);
                setUser(user);
                setIsLoggedIn(!!user);
                if (!user) {
                    navigation.navigate('LoginScreen');
                }
            } catch (error) {
                console.log('Error getting user:', error);
            }
        };

        checkLoggedIn();
    }, []);

      function signOut() {
        auth()
          .signOut()
          .then(() => {
            console.log('User signed out!');
            setUser(null);
            AsyncStorage.removeItem('user');
            console.log('logged out: ' + AsyncStorage.getItem('user'));
            navigation.navigate('LoginScreen');
          });
      }

    if (isLoggedIn === null) {
        // Zobraziť načítavací spinner alebo iný indikátor načítania
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Profile Screen</Text>
            <Text>{user}</Text>
            <Button title="Sign Out" onPress={signOut} />
        </View>
    );
}

export default ProfileScreen;
