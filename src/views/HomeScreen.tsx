import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView} from 'react-native';
import {
    faGear,
    faInfo,
    faMap,
    faQrcode,
    faUser,
    faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoggedInHome from '../components/LoggedInHome';
import NotLoggedHome from '../components/NotLoggedHome';

interface HomeScreenProps {
    navigation: any;
}

const screenWidth = Dimensions.get('window').width;

function getIconSize() {
    if (screenWidth <= 640) {
        return 25;
    } else if (screenWidth <= 768) {
        return 45;
    } else {
        return 55;
    }
}

const buttonDataAfterLogin = [
    {icon: faInfo, text: 'About', navigate: 'AboutScreen'},
    {icon: faUtensils, text: 'Restaurants', navigate: 'Restaurants'},
    {icon: faMap, text: 'Map', navigate: 'MapScreen'},
    {icon: faQrcode, text: 'Scan', navigate: 'ChangeThemeSecond'},
    {icon: faGear, text: 'Settings'},
    {icon: faUser, text: 'My profile', navigate: 'ProfileScreen'},
];

function HomeScreen({navigation}: HomeScreenProps) {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        return navigation.addListener('focus', () => {
            AsyncStorage.getItem('user').then(user => {
                if (user) {
                    setUser(JSON.parse(user));
                    AsyncStorage.getItem('user_info').then(userInfo => {
                        if (userInfo) {
                            setIsLogged(true);
                        } else {
                            setIsLogged(false);
                        }
                    });
                } else {
                    setIsLogged(false);
                }
            });
        });
    }, [navigation]);

    return (
        <ScrollView>
            {isLogged ? (
                <LoggedInHome
                    navigation={navigation}
                    buttonDataAfterLogin={buttonDataAfterLogin}
                    getIconSize={getIconSize}
                />
            ) : (
                <NotLoggedHome navigation={navigation} />
            )}
        </ScrollView>
    );
}

export default HomeScreen;
