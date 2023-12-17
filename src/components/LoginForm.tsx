import React, {useState} from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import {FirebaseUser} from '../models/FirebaseUser';
import firestore from '@react-native-firebase/firestore';
import {User} from '../models/User';
import {setUserUid} from '../functions/authFunctions';

const height = Dimensions.get('window').height;

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
                await setUserUid(userCredential.user.uid);
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

    return (
        <View style={styles.container}>
            <View style={styles.introductionHolder}>
                <Image
                    source={require('./../../assets/images/welcome_back.png')}
                    style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'contain',
                    }}
                />
            </View>
            <View style={styles.logoHolder}>
                <Image
                    source={require('./../../assets/images/matus_logo.png')}
                    style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'contain',
                    }}
                />
            </View>
            <View style={styles.labelsHolder}>
                <FloatingLabelInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    customLabelStyles={{
                        colorFocused: '#777777',
                        colorBlurred: '#777777',
                    }}
                    containerStyles={styles.containerStyles}
                    labelStyles={styles.labelStyles}
                    inputStyles={styles.inputStyles}
                />
                <FloatingLabelInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    customLabelStyles={{
                        colorFocused: '#777777',
                        colorBlurred: '#777777',
                    }}
                    containerStyles={styles.containerStyles}
                    labelStyles={styles.labelStyles}
                    inputStyles={styles.inputStyles}
                    isPassword={true}
                    customShowPasswordComponent={
                        <Pressable
                            onPress={toggleShowPassword}
                            style={styles.pressable}>
                            <FontAwesomeIcon
                                icon={faEye}
                                color="#1FAFBF"
                                size={20}
                            />
                        </Pressable>
                    }
                    customHidePasswordComponent={
                        <Pressable
                            onPress={toggleShowPassword}
                            style={styles.pressable}>
                            <FontAwesomeIcon
                                icon={faEyeSlash}
                                color="#1FAFBF"
                                size={20}
                            />
                        </Pressable>
                    }
                    togglePassword={showPassword}
                />
                <View style={styles.optionsHolder}>
                    <View style={styles.checkBox}>
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
                    <Text style={styles.forgotPass}>Forgot password?</Text>
                </View>
                <Pressable style={styles.button} onPress={signIn}>
                    <Text style={styles.login}>Login</Text>
                </Pressable>
                {error !== '' && <Text style={styles.error}>{error}</Text>}
                <View style={styles.singUpHolder}>
                    <Text>Don't have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('RegisterScreen')}>
                        <Text style={styles.signUp}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: height * 0.9,
    },
    introductionHolder: {
        height: height * 0.1,
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoHolder: {
        height: height * 0.25,
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    labelsHolder: {
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerStyles: {
        borderRadius: 4,
        paddingHorizontal: 8,
        height: 48,
        width: '80%',
        borderColor: '#b3b2ae',
        borderWidth: 1.5,
        marginBottom: 6,
    },
    labelStyles: {
        paddingHorizontal: 4,
    },
    inputStyles: {
        paddingHorizontal: 6,
        color: '#000',
    },
    pressable: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsHolder: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    checkBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    forgotPass: {
        color: '#1FAFBF',
    },
    button: {
        backgroundColor: '#1FAFBF',
        height: 48,
        width: '80%',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    singUpHolder: {
        flexDirection: 'row',
    },
    signUp: {
        color: '#1FAFBF',
    },
    login: {
        color: '#fff',
    },
    error: {
        color: '#ff0000',
        marginBottom: 6,
    },
});
