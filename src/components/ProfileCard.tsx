import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faGears,
    faPhone,
    faAt,
    faLocationDot,
    faHeart,
    faCreditCard,
    faBagShopping,
    faChair,
    faRightFromBracket,
    faStar,
} from '@fortawesome/free-solid-svg-icons';

function ProfileCard({user, setUser}) {
    useEffect(() => {
        const creationDate = new Date(user.metadata.creationTime);
        const formattedCreationDate = creationDate.toLocaleDateString('sk-SK');
        console.log(user);
        console.log(`UID: ${user.uid}`);
        console.log(`Display Name: ${user.displayName || 'not set'}`);
        console.log(`Email: ${user.email}`);
        console.log(`Creation Date: ${formattedCreationDate}`);
        console.log(`Phone Number: ${user.phoneNumber || 'not set'}`);
        console.log(`Photo URL: ${user.photoURL || 'not set'}`);
    }, [user]);

    function signOut() {
        auth()
            .signOut()
            .then(() => {
                console.log('User signed out!');
                AsyncStorage.removeItem('user');
                setUser(null);
                AsyncStorage.removeItem('user_info');
            });
    }

    return (
        <ScrollView>
            <View className="flex-1 p-5 bg-gray-200">
                <View className="p-5 bg-white rounded-2xl shadow-md">
                    <View className="flex flex-row w-full items-center space-x-4">
                        <Image
                            source={require('../../assets/images/avatar.png')}
                            className="w-20 h-20 rounded-full"
                        />
                        <View>
                            <Text className="mt-2 text-2xl font-bold">
                                Andrew Kumar
                            </Text>
                            <Text className="mt-1 text-sm text-gray-500">
                                @andrewkumar
                            </Text>
                        </View>
                    </View>
                    <View className="mt-4 flex flex-row space-x-2 items-center">
                        <FontAwesomeIcon icon={faPhone} size={20} />
                        <Text>+421949327913</Text>
                    </View>
                    <View className="mt-4 flex flex-row space-x-2 items-center">
                        <FontAwesomeIcon icon={faAt} size={20} />
                        <Text>miselka12345@gmail.com</Text>
                    </View>
                    <View className="mt-4 flex flex-row space-x-2 items-center">
                        <FontAwesomeIcon icon={faLocationDot} size={20} />
                        <Text>
                            Sokoľany 259, Košice-okolie, 04457, Slovakia
                        </Text>
                    </View>

                    <View className="flex flex-row justify-between border-gray-300 border-t-2 border-b-2 mt-6">
                        <View className="flex flex-col border-r-2 border-gray-300 items-center w-1/2 p-1">
                            <Text className="text-sm text-gray-500">
                                Member since
                            </Text>
                            <Text className="text-lg font-bold">12.4.2023</Text>
                        </View>
                        <View className="flex flex-col items-center w-1/2 p-1">
                            <Text className="text-sm text-gray-500">
                                Orders
                            </Text>
                            <Text className="text-lg font-bold">12</Text>
                        </View>
                    </View>

                    <View className="flex flex-row mt-6 items-center space-x-4">
                        <FontAwesomeIcon icon={faHeart} size={20} />
                        <Text className="text-lg text-gray-500 ml-2">
                            Favourite
                        </Text>
                    </View>
                    <View className="flex flex-row mt-6 items-center space-x-4">
                        <FontAwesomeIcon icon={faCreditCard} size={20} />
                        <Text className="text-lg text-gray-500 ml-2">
                            Payment methods
                        </Text>
                    </View>
                    <View className="flex flex-row mt-6 items-center space-x-4">
                        <FontAwesomeIcon icon={faBagShopping} size={20} />
                        <Text className="text-lg text-gray-500 ml-2">
                            My orders
                        </Text>
                    </View>
                    <View className="flex flex-row mt-6 items-center space-x-4">
                        <FontAwesomeIcon icon={faChair} size={20} />
                        <Text className="text-lg text-gray-500 ml-2">
                            My reservations
                        </Text>
                    </View>
                    <View className="flex flex-row mt-6 items-center space-x-4">
                        <FontAwesomeIcon icon={faStar} size={20} />
                        <Text className="text-lg text-gray-500 ml-2">
                            Reviews
                        </Text>
                    </View>
                    <View className="border-t-2 border-gray-300 mt-6">
                        <TouchableOpacity className="mt-4 px-4 py-2 bg-[#66b7b7] rounded-lg flex flex-row space-x-2 items-center">
                            <FontAwesomeIcon
                                icon={faGears}
                                color="#fff"
                                size={20}
                            />
                            <Text className="text-white font-bold">
                                Edit Profile
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="mt-4 px-4 py-2 bg-red-400 rounded-lg flex flex-row space-x-2 items-center"
                            onPress={signOut}>
                            <FontAwesomeIcon
                                icon={faRightFromBracket}
                                color={'#fff'}
                                size={20}
                            />
                            <Text className="text-white font-bold">
                                Sign Out
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default ProfileCard;
