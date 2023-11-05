import React, {useEffect, useState} from 'react';
import {View, Text, Button, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import LoginForm from '../components/LoginForm';
import ProfileCard from '../components/ProfileCard';

function ProfileScreen({navigation, route}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(
            async authenticatedUser => {
                setLoading(true); // Start loading
                try {
                    if (authenticatedUser) {
                        await AsyncStorage.setItem(
                            'user',
                            JSON.stringify(authenticatedUser),
                        );
                        setUser(authenticatedUser);
                    } else {
                        await AsyncStorage.removeItem('user');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Failed to handle auth state change:', error);
                }
                setLoading(false);
            },
        );

        return subscriber;
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!user) {
        return <LoginForm navigation={navigation} />;
    }

    return <ProfileCard user={user} setUser={setUser} />;
}

export default ProfileScreen;
