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

type Props = {
    navigation: any;
};

const initialState: User = {
    uid: '',
    email: 'miselka12345@gmail.com',
    password: 'password123',
    repeatPassword: 'password123',
    address: {
        street: 'Sokolany',
        number: '1',
        city: 'Kosice',
        state: 'Slovakia',
        ZIPcode: '04001',
    },
    firstName: 'Michaela',
    lastName: 'Majorošová',
    phone: '+421 949 327 913',
};

function RegisterForm({navigation}: Props) {
    const [user, setUser] = useState<User>(initialState);
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string>('');

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
        if (user.password != null) {
            auth()
                .createUserWithEmailAndPassword(user.email, user.password)
                .then(userCredential => {
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
                            creationDate: formattedCreationDate(
                                userCredential.user.metadata.creationTime,
                            ),
                            emailVerified: userCredential.user.emailVerified,
                        })
                        .then(async () => {
                            await AsyncStorage.setItem(
                                'user_uid',
                                userCredential.user.uid,
                            );
                            navigation.navigate('Home');
                        });

                    userCredential.user
                        .sendEmailVerification()
                        .then(() => {
                            console.log('Verification email sent!');
                        })
                        .catch(emailError => {
                            setError(
                                'Error sending verification email:' + emailError,
                            );
                        });
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        setError('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        setError('That email address is invalid!');
                    }
                    setError(error.message);
                });
        }
    }

    const formattedCreationDate = (creationDateStr: string | undefined) => {
        if (!creationDateStr) {
            return '';
        }
        const creationDate = new Date(creationDateStr);
        const formattedCreationDate = creationDate.toLocaleDateString('sk-SK');
        return formattedCreationDate;
    };

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
                        prevStep={prevStep}
                        register={register}
                        error={error}
                        setError={setError}
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
