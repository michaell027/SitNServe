import React, {useState} from 'react';
import {View, Text, Image, Pressable, TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import {FirebaseUser} from '../models/FirebaseUser';
import firestore from '@react-native-firebase/firestore';
import {User} from '../models/User';

interface LoginFormProps {
    navigation: any;
}

const LoginForm = ({navigation}: LoginFormProps) => {
    const [username, setUsername] = useState<string>('jane.doe@example.com');
    const [password, setPassword] = useState<string>('SuperSecretPassword!');
    const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const signIn = () => {
        if (username === '') {
            setError('Please enter your email address!');
            return;
        }

        if (password === '') {
            setError('Please enter your password!');
            return;
        }

        auth()
            .signInWithEmailAndPassword(username, password)
            .then(async userCredential => {
                console.log('User signed in!');
                await storeUser(userCredential.user.toJSON() as FirebaseUser);
            })
            .catch(error => {
                console.log('Error signing in:', error.code);
                switch (error.code) {
                    case 'auth/user-not-found':
                        setError('That user does not exist!');
                        break;
                    case 'auth/invalid-login':
                        setError('That email address / password is invalid!');
                        break;
                    case 'auth/too-many-requests':
                        setError('Too many requests. Try again later!');
                        break;
                    default:
                        setError('An unknown error occurred!');
                        break;
                }
            });
    };

    const storeUser = async (user: FirebaseUser) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await storeUserInfo(user);
        } catch (error) {
            console.log('Error storing user:', error);
        }
    };

    const storeUserInfo = async (user: FirebaseUser) => {
        const query = firestore().collection('users').doc(user.uid);
        query.onSnapshot(querySnapshot => {
            const userInfo = querySnapshot.data() as User;
            AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
            navigation.navigate('Home');
        });
    };

    return (
        <View className="flex w-full items-center justify-center py-10">
            <View className="w-3/4">
                <Image
                    source={require('./../../assets/images/welcome_back.png')}
                    className="self-center w-full"
                    resizeMode="contain"
                />
            </View>
            <View className="h-48 w-full my-3">
                <Image
                    source={require('./../../assets/images/matus_logo.png')}
                    className="h-full self-center"
                    resizeMode="contain"
                />
            </View>
            <View className="flex w-full space-y-2 items-center px-10">
                <FloatingLabelInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    customLabelStyles={{
                        colorFocused: '#777777',
                        colorBlurred: '#777777',
                    }}
                    containerStyles={{
                        borderRadius: 4,
                        paddingHorizontal: 8,
                        height: 48,
                        width: '100%',
                        borderColor: '#b3b2ae',
                        borderWidth: 1.5,
                        marginBottom: 8,
                    }}
                    labelStyles={{
                        paddingHorizontal: 4,
                    }}
                    inputStyles={{
                        paddingHorizontal: 4,
                        color: '#000',
                    }}
                />
                <FloatingLabelInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    width={200}
                    customLabelStyles={{
                        colorFocused: '#777777',
                        colorBlurred: '#777777',
                    }}
                    containerStyles={{
                        borderRadius: 4,
                        paddingHorizontal: 8,
                        height: 48,
                        width: '80%',
                        borderColor: '#b3b2ae',
                        borderWidth: 1.5,
                    }}
                    labelStyles={{
                        paddingHorizontal: 4,
                    }}
                    inputStyles={{
                        paddingHorizontal: 4,
                        color: '#000',
                    }}
                    secureTextEntry={!showPassword}
                    rightComponent={
                        <Pressable
                            onPress={toggleShowPassword}
                            className="flex items-center justify-center">
                            {showPassword ? (
                                <FontAwesomeIcon
                                    icon={faEyeSlash}
                                    color="#1FAFBF"
                                />
                            ) : (
                                <FontAwesomeIcon icon={faEye} color="#1FAFBF" />
                            )}
                        </Pressable>
                    }
                />
                <View className="flex flex-row justify-between w-full items-center">
                    <View className="flex flex-row items-center justify-left">
                        <CheckBox
                            disabled={false}
                            value={toggleCheckBox}
                            onValueChange={newValue =>
                                setToggleCheckBox(newValue)
                            }
                            tintColors={{true: '#1FAFBF', false: '#1FAFBF'}}
                        />
                        <Text>Remember me</Text>
                    </View>
                    <Text className="text-[#1FAFBF]">Forgot password?</Text>
                </View>
                <Pressable
                    className="w-3/4 h-10 bg-[#1FAFBF] rounded-md flex items-center justify-center shadow-lg"
                    onPress={signIn}>
                    <Text className="text-white text-xl font-bold">Login</Text>
                </Pressable>
                {error !== '' && <Text className="text-red-500">{error}</Text>}
                <View className="flex flex-row items-center justify-center">
                    <Text>Don't have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('RegisterScreen')}>
                        <Text className="text-[#1FAFBF]">Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginForm;
