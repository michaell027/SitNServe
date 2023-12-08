import React, {useEffect, useState} from 'react';
import {View, Text, Button, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import LoginForm from '../components/LoginForm';
import ProfileCard from '../components/ProfileCard';
import {FirebaseUser} from '../models/FirebaseUser';
import {User} from '../models/User';
import firestore from '@react-native-firebase/firestore';

function ProfileScreen({navigation, route}) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(
            async authenticatedUser => {
                setLoading(true);
                try {
                    if (authenticatedUser) {
                        const userRef = firestore()
                            .collection('users')
                            .doc(authenticatedUser.uid);
                        const document = await userRef.get();
                        const userInfo = document.data() as User;
                        setUserInfo(userInfo);
                        setUser(authenticatedUser.toJSON() as FirebaseUser);
                    } else {
                        await AsyncStorage.removeItem('user');
                        await AsyncStorage.removeItem('user_info');
                        setUser(null);
                        setUserInfo(null);
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

    return (
        <ProfileCard
            user={user}
            setUser={setUser}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            navigation={navigation}
        />
    );
}

export default ProfileScreen;
