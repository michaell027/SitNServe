import React, {useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {FloatingLabelInput} from 'react-native-floating-label-input';

const LoginForm: React.FC = ({navigation}) => {
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
            .then(userCredential => {
                console.log('User signed in!');
                storeUser(userCredential.user);
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

    const storeUser = async (user: any) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.log('Error storing user:', error);
        }
    };

    return (
        <View className="flex-1 w-full items-center justify-center">
            <Text className="text-3xl font-[900] text-teal-600 uppercase">
                Welcome back
            </Text>
            <View className="h-20 w-full my-8">
                <Image
                    source={require('./../../assets/images/logo-no-background.png')}
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
                                    color="#00AEB5"
                                />
                            ) : (
                                <FontAwesomeIcon icon={faEye} color="#00AEB5" />
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
                            tintColors={{true: '#00AEB5', false: '#00AEB5'}}
                        />
                        <Text>Remember me</Text>
                    </View>
                    <Text className="text-teal-600">Forgot password?</Text>
                </View>
                <Pressable
                    onPress={signIn}
                    className="w-3/4 h-10 bg-teal-600 rounded-md flex items-center justify-center shadow-lg">
                    <Text className="text-white text-xl font-bold">Login</Text>
                </Pressable>
                {error !== '' && <Text className="text-red-500">{error}</Text>}
                <View className="flex flex-row items-center justify-center">
                    <Text>Don't have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('RegisterScreen')}>
                        <Text className="text-teal-600">Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginForm;
