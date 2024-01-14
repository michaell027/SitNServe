import React, {useEffect, useState} from 'react';
import {View, Text, Button, ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import LoginForm from '../components/LoginForm';
import ProfileCard from '../components/ProfileCard';
import {User} from '../models/User';
import firestore from '@react-native-firebase/firestore';
import {Address} from "../models/Address";

interface ProfileScreenProps {
    navigation: any;
    route: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation, route}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function getNumberOfOrders(uid: string) {
            const ordersRef = firestore()
                .collection('users')
                .doc(uid)
                .collection('orders');
            const orders = await ordersRef.get();
            return orders.docs.length;
        }

        const subscriber = auth().onAuthStateChanged(
            async authenticatedUser => {
                setLoading(true);
                try {
                    if (authenticatedUser) {
                        const userRef = firestore()
                            .collection('users')
                            .doc(authenticatedUser.uid);
                        const document = await userRef.get();
                        const orders = getNumberOfOrders(authenticatedUser.uid);
                        const user = {
                            uid: authenticatedUser.uid,
                            email: authenticatedUser.email,
                            address: {
                                state: document.get('address.state'),
                                street: document.get('address.street'),
                                number: document.get('address.number'),
                                address: document.get('address.address'),
                                city: document.get('address.city'),
                                ZIPcode: document.get('address.ZIPcode'),
                            } as Address,
                            firstName: document.get('firstName'),
                            lastName: document.get('lastName'),
                            phone: document.get('phone'),
                            creationDate: document.get('creationDate'),
                            orders: await orders,
                        } as User;
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
