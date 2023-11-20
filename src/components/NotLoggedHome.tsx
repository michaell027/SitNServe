import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faCalendar,
    faMobile,
    faUtensils,
    faBowlFood,
    faRightToBracket,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {styled} from 'nativewind';

const StyledView = styled(View);
const StyledPressable = styled(Pressable);

function NotLoggedHome({navigation}) {
    return (
        <StyledView className="flex-1 h-[90vh] items-center justify-start px-6 py-6 bg-white">
            <StyledView className="flex w-full h-full bg-[#1FAFBF]/30 rounded-2xl">
                <StyledView className="w-full h-[100%] items-center py-4">
                    <StyledView className="max-h-[8%] w-full">
                        <Image
                            source={require('./../../assets/images/welcome_to.png')}
                            className="w-full h-full rounded-3xl"
                            resizeMode="contain"
                        />
                    </StyledView>
                    <StyledView className="max-h-[32%] w-full pb-1">
                        <Image
                            source={require('./../../assets/images/matus_logo.png')}
                            className="w-full h-full rounded-3xl"
                            resizeMode="contain"
                        />
                    </StyledView>
                    <StyledView className="max-h-[60%] flex-row flex-wrap justify-between px-4">
                        <StyledView className="flex items-center w-full mb-4">
                            <Text className="text-center text-black font-bold text-[20px] w-full">
                                <FontAwesomeIcon
                                    icon={faBowlFood}
                                    size={20}
                                    color="#171E26"
                                />{' '}
                                Find{' '}
                                <FontAwesomeIcon
                                    icon={faBowlFood}
                                    size={20}
                                    color="#171E26"
                                />
                            </Text>
                            <Text className="text-center text-black text-[17px] w-full">
                                Explore the best dining spots near you.
                            </Text>
                        </StyledView>
                        <StyledView className="flex items-center w-full mb-4">
                            <Text className="text-center text-black font-bold text-[20px] w-full">
                                <FontAwesomeIcon
                                    icon={faCalendar}
                                    size={20}
                                    color="#F24452"
                                />{' '}
                                Reserve{' '}
                                <FontAwesomeIcon
                                    icon={faCalendar}
                                    size={20}
                                    color="#F24452"
                                />
                            </Text>
                            <Text className="text-center text-black text-[17px] w-full">
                                Secure your table in advance.
                            </Text>
                        </StyledView>
                        <StyledView className="flex items-center w-full mb-4">
                            <Text className="text-center text-black font-bold text-[20px] w-full">
                                <FontAwesomeIcon
                                    icon={faMobile}
                                    size={20}
                                    color="#F2A413"
                                />{' '}
                                Order & Pay{' '}
                                <FontAwesomeIcon
                                    icon={faMobile}
                                    size={20}
                                    color="#F2A413"
                                />
                            </Text>
                            <Text className="text-center text-black text-[17px] w-full">
                                Scan, order, and pay right from your phone.
                            </Text>
                        </StyledView>

                        <StyledView className="flex items-center w-full mb-4">
                            <Text className="text-center text-black font-bold text-[20px] w-full">
                                <FontAwesomeIcon
                                    icon={faUtensils}
                                    size={20}
                                    color="#1FAFBF"
                                />{' '}
                                Enjoy{' '}
                                <FontAwesomeIcon
                                    icon={faUtensils}
                                    size={20}
                                    color="#1FAFBF"
                                />
                            </Text>
                            <Text className="text-center text-black text-[17px] w-full">
                                Sit back, relax, and enjoy your meal.
                            </Text>
                        </StyledView>

                        <StyledView className="flex-row justify-between w-full mt-4 px-6">
                            <StyledPressable
                                onPress={() =>
                                    navigation.navigate('ProfileScreen')
                                }
                                className="bg-[#1FAFBF] py-3 flex-row space-x-2 px-7 rounded-lg">
                                <FontAwesomeIcon
                                    icon={faRightToBracket}
                                    color="white"
                                    size={20}
                                />
                                <Text className="text-white font-[500] text-[16px] text-center">
                                    Login
                                </Text>
                            </StyledPressable>
                            <StyledPressable
                                className="bg-[#1FAFBF] py-3 flex-row space-x-2 px-7 rounded-lg"
                                onPress={() =>
                                    navigation.navigate('RegisterScreen')
                                }>
                                <FontAwesomeIcon
                                    icon={faUserPlus}
                                    color="white"
                                    size={20}
                                />
                                <Text className="text-white font-[500] text-[16px] text-center">
                                    Sign Up
                                </Text>
                            </StyledPressable>
                        </StyledView>
                    </StyledView>
                </StyledView>
            </StyledView>
        </StyledView>
    );
}

export default NotLoggedHome;
