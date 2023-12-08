import React, {useState, useEffect} from 'react';
import {
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import FirstRegisterStep from './FirstRegisterStep';
import SecondRegisterStep from './SecondRegisterStep';
import ThirdRegisterStep from './ThirdRegisterStep';
import {User} from '../models/User';
import {Address} from '../models/Address';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FirebaseUser} from '../models/FirebaseUser';

type Props = {
    navigation: any;
};

const initialState: User = {
    uid: '',
    email: 'jane.doe@example.com',
    password: 'SuperSecretPassword!',
    repeatPassword: 'SuperSecretPassword!',
    address: {
        street: 'Sokolovska',
        number: '1',
        city: 'Kosice',
        state: 'Slovakia',
        zip: '03389',
    },
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '+421 123 456 789',
};

function RegisterForm({navigation}: Props) {
    const [user, setUser] = useState<User>(initialState);
    const [step, setStep] = useState(1);

    useEffect(() => {
        console.log(user);
    }, [user]);

    const updateUser = (key: keyof User, value: string) => {
        setUser(prevUser => ({
            ...prevUser,
            [key]: value,
        }));
    };

    const updateUserAddress = (key: keyof Address, value: string) => {
        console.log(key, value);
        setUser(prevUser => ({
            ...prevUser,
            address: {
                ...prevUser.address,
                [key]: value,
            },
        }));
    };

    const nextStep = () => {
        setStep(prevStep => {
            const newStep = prevStep + 1;
            console.log(newStep);
            return newStep;
        });
    };

    const prevStep = () => {
        if (step >= 1) {
            setStep(prevStep => {
                const newStep = prevStep - 1;
                console.log(newStep);
                return newStep;
            });
        }
    };

    function register() {
        auth()
            .createUserWithEmailAndPassword(user.email, user.password)
            .then(userCredential => {
                console.log('User account created & signed in!');
                firestore()
                    .collection('users')
                    .doc(userCredential.user.uid)
                    .set({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                        address: user.address,
                        uid: userCredential.user.uid,
                    })
                    .then(async () => {
                        await AsyncStorage.setItem(
                            'user',
                            JSON.stringify(
                                userCredential.user.toJSON() as FirebaseUser,
                            ),
                        );
                        await AsyncStorage.setItem(
                            'user_info',
                            JSON.stringify(user),
                        );
                        console.log('User added!');
                        navigation.navigate('Home');
                    });

                userCredential.user
                    .sendEmailVerification()
                    .then(() => {
                        console.log('Verification email sent!');
                    })
                    .catch(emailError => {
                        console.error(
                            'Error sending verification email:',
                            emailError,
                        );
                    });
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

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.headerText}>Create account</Text>
                {step === 1 && (
                    <FirstRegisterStep
                        navigation={navigation}
                        user={user}
                        updateUser={updateUser}
                        nextStep={nextStep}
                    />
                )}
                {step === 2 && (
                    <SecondRegisterStep
                        navigation={navigation}
                        user={user}
                        updateUser={updateUser}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        updateUserAddress={updateUserAddress}
                    />
                )}

                {step === 3 && (
                    <ThirdRegisterStep
                        navigation={navigation}
                        user={user}
                        updateUser={updateUser}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        register={register}
                    />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default RegisterForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    scrollView: {
        paddingHorizontal: 4,
        paddingVertical: 5,
    },
    headerText: {
        fontSize: 32,
        color: '#1FAFBF',
        fontWeight: 'bold',
        marginBottom: 2,
    },
});
