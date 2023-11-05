import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEnvelope, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import FirstRegisterStep from './FirstRegisterStep';
import SecondRegisterStep from './SecondRegisterStep';

interface User {
    email: string;
    password: string;
    repeatPassword: string;
}

const initialState: User = {
    email: 'jane.doe@example.com',
    password: 'SuperSecretPassword!',
    repeatPassword: 'SuperSecretPassword!',
};

function RegisterForm({navigation}) {
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

    return (
        <ScrollView className={`px-4 py-5`}>
            <Text className={`text-3xl text-teal-600 font-bold mb-2`}>
                Create account
            </Text>
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
                />
            )}

            <Text className={`text-center text-[16px] text-gray-500 mb-4`}>
                By registering you agree to our{' '}
                <Text className={`text-teal-600`}>Terms of Service</Text> and{' '}
                <Text className={`text-teal-600`}>Privacy Policy</Text>
            </Text>
        </ScrollView>
    );
}

export default RegisterForm;
