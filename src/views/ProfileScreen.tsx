import React, {useEffect, useState} from 'react';
import {View, Text, Button, ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import LoginForm from '../components/LoginForm';
import ProfileCard from '../components/ProfileCard';
import {User} from '../models/User';
import firestore from '@react-native-firebase/firestore';

interface ProfileScreenProps {
    navigation: any;
    route: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation, route}) => {
    const [user, setUser] = useState<User | null>(null);
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
                        const user = document.data() as User;
                        setUser(user);
                    } else {
                        AsyncStorage.removeItem('user_uid').then(() => {
                            setUser(null);
                        });
                    }
                } catch (error) {
                    AsyncStorage.removeItem('user_uid').then(() => {
                        setUser(null);
                    });
                    console.error('Failed to handle auth state change:', error);
                }
                setLoading(false);
            },
        );

        return subscriber;
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!user) {
        return <LoginForm navigation={navigation} />;
    }

    return (
        <ProfileCard user={user} setUser={setUser} navigation={navigation} />
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});
