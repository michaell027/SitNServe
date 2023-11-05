import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, View} from 'react-native';
import ProfileCard from '../components/ProfileCard';
import RegisterForm from '../components/RegisterForm';

function RegisterScreen({navigation}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(authenticatedUser => {
            setLoading(true);
            if (authenticatedUser) {
                AsyncStorage.setItem('user', JSON.stringify(authenticatedUser))
                    .then(() => {
                        setUser(authenticatedUser);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error(
                            'Failed to save user to async storage:',
                            error,
                        );
                        setLoading(false);
                    });
            } else {
                AsyncStorage.removeItem('user')
                    .then(() => {
                        setUser(null);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error(
                            'Failed to remove user from async storage:',
                            error,
                        );
                        setLoading(false);
                    });
            }
        });

        return subscriber;
    }, []);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (user) {
        return <ProfileCard user={user} setUser={setUser} />;
    } else {
        return <RegisterForm navigation={navigation} />;
    }
}

export default RegisterScreen;
