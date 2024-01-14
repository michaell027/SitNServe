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
import LoggedInHome from '../components/LoggedInHome';
import NotLoggedHome from '../components/NotLoggedHome';
import {setUserUid} from '../functions/authFunctions';
import firebase from '@react-native-firebase/app';

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
    {icon: faQrcode, text: 'Scan', navigate: 'ScanQRScreen'},
    {icon: faGear, text: 'Settings', navigate: 'SettingsScreen'},
    {icon: faUser, text: 'My profile', navigate: 'ProfileScreen'},
];

function HomeScreen({navigation}: HomeScreenProps) {
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                await setUserUid(user.uid);
                setIsLogged(true);
            } else {
                setIsLogged(false);
            }
        });

        return () => unsubscribe();
    }, []);

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
