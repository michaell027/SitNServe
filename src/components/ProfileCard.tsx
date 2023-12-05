import React, {useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
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
import {styled} from 'nativewind';

interface ProfileCardProps {
    user: any;
    setUser: any;
    navigation: any;
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ProfileCard = ({user, setUser, navigation}: ProfileCardProps) => {
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
            <StyledView className="flex-1 p-5 bg-gray-200">
                <StyledView className="p-5 bg-white rounded-2xl shadow-md">
                    <StyledView className="flex flex-row w-full items-center space-x-4">
                        <StyledImage
                            source={require('../../assets/images/avatar.png')}
                            className="w-20 h-20 rounded-full"
                        />
                        <View>
                            <StyledText className="mt-2 text-2xl font-bold">
                                Andrew Kumar
                            </StyledText>
                            <StyledText className="mt-1 text-sm text-gray-500">
                                @andrewkumar
                            </StyledText>
                        </View>
                    </StyledView>
                    <StyledView className="mt-4 flex flex-row space-x-2 items-center">
                        <FontAwesomeIcon icon={faPhone} size={20} />
                        <Text>+421949327913</Text>
                    </StyledView>
                    <StyledView className="mt-4 flex flex-row space-x-2 items-center">
                        <FontAwesomeIcon icon={faAt} size={20} />
                        <Text>miselka12345@gmail.com</Text>
                    </StyledView>
                    <StyledView className="mt-4 flex flex-row space-x-2 items-center">
                        <FontAwesomeIcon icon={faLocationDot} size={20} />
                        <Text>
                            Sokoľany 259, Košice-okolie, 04457, Slovakia
                        </Text>
                    </StyledView>

                    <StyledView className="flex flex-row justify-between border-gray-300 border-t-2 border-b-2 mt-6">
                        <StyledView className="flex flex-col border-r-2 border-gray-300 items-center w-1/2 p-1">
                            <StyledText className="text-sm text-gray-500">
                                Member since
                            </StyledText>
                            <StyledText className="text-lg font-bold">
                                12.4.2023
                            </StyledText>
                        </StyledView>
                        <StyledView className="flex flex-col items-center w-1/2 p-1">
                            <StyledText className="text-sm text-gray-500">
                                Orders
                            </StyledText>
                            <StyledText className="text-lg font-bold">
                                12
                            </StyledText>
                        </StyledView>
                    </StyledView>

                    <StyledTouchableOpacity
                        className="flex flex-row mt-6 items-center space-x-4"
                        onPress={() =>
                            navigation.navigate('FavoriteRestaurantsScreen')
                        }>
                        <FontAwesomeIcon icon={faHeart} size={20} />
                        <StyledText className="text-lg text-gray-500 ml-2">
                            Favourite
                        </StyledText>
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className="flex flex-row mt-6 items-center space-x-4">
                        <FontAwesomeIcon icon={faCreditCard} size={20} />
                        <StyledText className="text-lg text-gray-500 ml-2">
                            Payment methods
                        </StyledText>
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity
                        onPress={() => navigation.navigate('OrdersScreen')}
                        className="flex flex-row mt-6 items-center space-x-4">
                        <FontAwesomeIcon icon={faBagShopping} size={20} />
                        <StyledText className="text-lg text-gray-500 ml-2">
                            My orders
                        </StyledText>
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity
                        onPress={() =>
                            navigation.navigate('ReservationsScreen')
                        }
                        className="flex flex-row mt-6 items-center space-x-4">
                        <FontAwesomeIcon icon={faChair} size={20} />
                        <StyledText className="text-lg text-gray-500 ml-2">
                            My reservations
                        </StyledText>
                    </StyledTouchableOpacity>
                    <StyledTouchableOpacity className="flex flex-row mt-6 items-center space-x-4">
                        <FontAwesomeIcon icon={faStar} size={20} />
                        <StyledText className="text-lg text-gray-500 ml-2">
                            Reviews
                        </StyledText>
                    </StyledTouchableOpacity>
                    <StyledView className="border-t-2 border-gray-300 mt-6">
                        <StyledTouchableOpacity className="mt-4 px-4 py-2 bg-[#66b7b7] rounded-lg flex flex-row space-x-2 items-center">
                            <FontAwesomeIcon
                                icon={faGears}
                                color="#fff"
                                size={20}
                            />
                            <StyledText className="text-white font-bold">
                                Edit Profile
                            </StyledText>
                        </StyledTouchableOpacity>
                        <StyledTouchableOpacity
                            className="mt-4 px-4 py-2 bg-red-400 rounded-lg flex flex-row space-x-2 items-center"
                            onPress={signOut}>
                            <FontAwesomeIcon
                                icon={faRightFromBracket}
                                color={'#fff'}
                                size={20}
                            />
                            <StyledText className="text-white font-bold">
                                Sign Out
                            </StyledText>
                        </StyledTouchableOpacity>
                    </StyledView>
                </StyledView>
            </StyledView>
        </ScrollView>
    );
};

export default ProfileCard;
