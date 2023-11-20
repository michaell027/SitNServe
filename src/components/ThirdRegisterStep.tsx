import React, {useState} from 'react';
import {View, Text, TextInput, Pressable, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faEye,
    faEyeSlash,
    faEnvelope,
    faAngleLeft,
    faAngleRight,
} from '@fortawesome/free-solid-svg-icons';

function ThirdRegisterStep({
    navigation,
    user,
    updateUser,
    nextStep,
    prevStep,
    register,
}) {
    const [error, setError] = useState('');

    const handleRegister = () => {
        if (!user.firstName || !user.lastName || !user.phone) {
            setError('Please fill in all fields');
            return;
        }
        console.log('registering');
    };
    return (
        <View>
            <Text className={`mb-6 text-lg`}>
                Please enter your contact information
            </Text>
            <Text className={`mb-2 font-[900] text-lg`}>
                <Text className="text-red-400">* </Text>
                Your first name:
            </Text>

            <View
                className={`flex w-full border-2 border-gray-400 pl-2 pr-4 rounded-lg mb-4`}>
                <TextInput
                    onChangeText={value => updateUser('firstName', value)}
                    value={user.firstName}
                    placeholder="Enter your first name"
                    autoCapitalize="sentences"
                />
            </View>
            <Text className={`mb-2 font-[900] text-lg`}>
                <Text className="text-red-400">* </Text>
                Your last name:
            </Text>
            <View
                className={`flex w-full border-2 border-gray-400 pl-2 pr-4 rounded-lg mb-4`}>
                <TextInput
                    onChangeText={value => updateUser('lastName', value)}
                    value={user.lastName}
                    placeholder="Enter your last name"
                    autoCapitalize="sentences"
                />
            </View>
            <Text className={`mb-2 font-[900] text-lg`}>
                <Text className="text-red-400">* </Text>
                Your phone number:
            </Text>
            <View
                className={`flex w-full border-2 border-gray-400 pl-2 pr-4 rounded-lg mb-4`}>
                <TextInput
                    onChangeText={value => updateUser('phone', value)}
                    value={user.phone}
                    placeholder="Enter your phone number"
                    keyboardType="numeric"
                />
            </View>

            <View
                className={`justify-between w-full flex-row w-full items-center mb-6 mt-2`}>
                <Pressable
                    className={`bg-gray-500 rounded-lg w-1/6 py-3 px-4 items-center justify-center`}
                    onPress={prevStep}>
                    <FontAwesomeIcon
                        icon={faAngleLeft}
                        color={'#fff'}
                        size={25}
                    />
                </Pressable>
                <Pressable
                    className={`bg-[#1FAFBF] w-4/6 rounded-lg py-2 px-4`}
                    onPress={handleRegister}>
                    <Text
                        className={`text-center font-[800] text-lg text-white`}>
                        Register
                    </Text>
                </Pressable>
            </View>

            <Text className={`text-center text-[16px] text-gray-500 px-4`}>
                By registering you agree to our{' '}
                <Text className={`text-[#1FAFBF]`}>Terms of Service</Text> and{' '}
                <Text className={`text-[#1FAFBF]`}>Privacy Policy</Text>
            </Text>
        </View>
    );
}

export default ThirdRegisterStep;
