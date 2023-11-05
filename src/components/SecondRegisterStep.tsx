import React from 'react';
import {View, Text, Pressable, TouchableOpacity, TextInput} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faEnvelope,
    faEye,
    faEyeSlash,
    faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';

function SecondRegisterStep({
    navigation,
    user,
    updateUser,
    nextStep,
    prevStep,
}) {
    return (
        <View>
            <Text className={`mb-6 text-lg`}>
                Please enter your email and password
            </Text>
            <Text className={`mb-2 font-[900] text-lg`}>Your email:</Text>

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
            <Text className={`mb-2 font-[900] text-lg`}>Password:</Text>
            <Text className={`mb-2 font-[900] text-lg`}>Repeat password:</Text>
            <Text
                className={`text-red-500 mb-2 text-center text-[16px] font-bold`}>
                error
            </Text>
            <View
                className={`justify-between w-full flex-row w-full items-center`}>
                <Pressable
                    className={`bg-gray-500 rounded-lg w-1/6 py-3 px-4 mb-4 mt-2 items-center justify-center`}
                    onPress={prevStep}>
                    <FontAwesomeIcon
                        icon={faAngleLeft}
                        color={'#fff'}
                        size={25}
                    />
                </Pressable>
                <Pressable
                    className={`bg-teal-600 w-4/6 rounded-lg py-2 px-4 mb-4 mt-2`}>
                    <Text
                        className={`text-center font-[800] text-lg text-white`}>
                        Next step
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

export default SecondRegisterStep;
