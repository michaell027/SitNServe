import React, {useState, useEffect} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faUtensils,
    faUser,
    faCalendarAlt,
    faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import {styled} from 'nativewind';
import User from '../../models/User';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StyledView = styled(View);
const StyledText = styled(Text);

function LoggedInHome({navigation, buttonDataAfterLogin, getIconSize, user}) {
    const [userInfo, setUserInfo] = useState<User>(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('user_info').then(userInfo => {
                if (userInfo) {
                    setUserInfo(JSON.parse(userInfo));
                    console.log('User data storage: ', userInfo);
                } else {
                    const query = firestore()
                        .collection('users')
                        .where('uid', '==', user.uid);
                    const subscriber = query.onSnapshot(querySnapshot => {
                        if (querySnapshot.size > 0) {
                            const user = querySnapshot.docs[0].data() as User;
                            AsyncStorage.setItem(
                                'user_info',
                                JSON.stringify(user),
                            );
                            setUserInfo(user);
                            console.log('User data: ', user);
                        }
                    });
                    return () => subscriber();
                }
            });
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <StyledView className="flex-1 h-[90vh] items-center justify-start">
            <StyledView className={'w-full h-[90%] items-center my-6'}>
                <StyledView className="max-h-[60%] py-6 px-2 w-full items-center">
                    <Image
                        source={require('./../../assets/images/breakfast2.png')}
                        className={'w-3/4 h-full rounded-2xl'}
                        resizeMode="contain"
                    />
                </StyledView>

                <StyledView
                    className={
                        'max-h-[40%] flex-row flex-wrap justify-between'
                    }>
                    {buttonDataAfterLogin?.map((button, index) => (
                        <StyledView
                            key={index}
                            className="w-1/3 items-center justify-center py-4">
                            <Pressable
                                onPress={() =>
                                    navigation.navigate(button.navigate)
                                }
                                className={
                                    'items-center justify-center p-5 sm:p-8 rounded-full border-4 border-[#012840]'
                                }>
                                <FontAwesomeIcon
                                    icon={button.icon}
                                    size={getIconSize()}
                                    color="#012840"
                                />
                            </Pressable>
                            <Text
                                className={
                                    'text-[#012840] font-bold tracking-wider'
                                }>
                                {button.text}
                            </Text>
                        </StyledView>
                    ))}
                </StyledView>
            </StyledView>
        </StyledView>
    );
}

export default LoggedInHome;
