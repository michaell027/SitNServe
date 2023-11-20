import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEnvelope, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import auth from '@react-native-firebase/auth';

function FirstRegisterStep({navigation, user, updateUser, nextStep}) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleRepeatPasswordVisibility = () => {
        setRepeatPasswordVisible(!repeatPasswordVisible);
    };

    const handleNextStep = () => {
        if (
            user.email.trim() === '' ||
            user.password.trim() === '' ||
            user.repeatPassword.trim() === ''
        ) {
            setError('Please fill all fields');
            return;
        }
        if (user.password !== user.repeatPassword) {
            setError('Passwords do not match');
            return;
        }
        nextStep();
    };

    return (
        <View>
            <Text className={`mb-6 text-lg`}>
                Please enter your email and password
            </Text>
            <Text className={`mb-2 font-[900] text-lg`}>
                <Text className="text-red-400">* </Text>
                Your email:
            </Text>

            <View
                className={`flex flex-row w-full items-center border-2 border-gray-400 pl-2 pr-4 rounded-lg mb-4 justify-between`}>
                <TextInput
                    onChangeText={value => updateUser('email', value)}
                    value={user.email}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <FontAwesomeIcon icon={faEnvelope} size={20} />
            </View>
            <Text className={`mb-2 font-[900] text-lg`}>
                <Text className="text-red-400">* </Text>
                Password:
            </Text>
            <View
                className={`flex flex-row w-full items-center border-2 border-gray-400 pl-2 pr-4 rounded-lg mb-4 justify-between`}>
                <TextInput
                    onChangeText={value => updateUser('password', value)}
                    value={user.password}
                    placeholder="Enter your password"
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                    <FontAwesomeIcon
                        icon={passwordVisible ? faEyeSlash : faEye}
                        size={20}
                    />
                </TouchableOpacity>
            </View>
            <Text className={`mb-2 font-[900] text-lg`}>
                <Text className="text-red-400">* </Text>
                Repeat password:
            </Text>
            <View
                className={`flex flex-row w-full items-center border-2 border-gray-400 pl-2 pr-4 rounded-lg mb-4 justify-between`}>
                <TextInput
                    onChangeText={value => updateUser('repeatPassword', value)}
                    value={user.repeatPassword}
                    placeholder="Repeat password"
                    secureTextEntry={!repeatPasswordVisible}
                />
                <TouchableOpacity onPress={toggleRepeatPasswordVisibility}>
                    <FontAwesomeIcon
                        icon={repeatPasswordVisible ? faEyeSlash : faEye}
                        size={20}
                    />
                </TouchableOpacity>
            </View>
            {error && (
                <Text
                    className={`text-red-500 mb-2 text-center text-[16px] font-bold`}>
                    {error}
                </Text>
            )}
            <Pressable
                className={`bg-[#1FAFBF] rounded-lg py-2 px-4 mb-4 mt-2`}
                onPress={handleNextStep}>
                <Text className={`text-center font-[800] text-lg text-white`}>
                    Next step
                </Text>
            </Pressable>
            <View className={`flex flex-row items-center justify-center mb-2`}>
                <View className={`h-[1px] w-1/3 bg-gray-400`}></View>
                <Text className={`mx-4 text-gray-400`}>OR</Text>
                <View className={`h-[1px] w-1/3 bg-gray-400`}></View>
            </View>
            <View
                className={`flex flex-row items-center justify-center mb-4 items-center`}>
                <Text className={`text-center text-[16px] text-gray-600`}>
                    Already have an account?{' '}
                </Text>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('ProfileScreen');
                    }}>
                    <Text className={`text-center text-[16px] text-[#1FAFBF]`}>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default FirstRegisterStep;
