import React, {useState, useEffect} from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import {styled} from 'nativewind';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
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

const StyledView = styled(View);
const StyledText = styled(Text);

const screenWidth = Dimensions.get('window').width;

function getIconSize() {
    if (screenWidth <= 640) {
        return 20;
    } else if (screenWidth <= 768) {
        return 40;
    } else {
        return 50;
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

const buttonDataBeforeLogin = [
    {icon: faInfo, text: 'About', navigate: 'AboutScreen'},
    {icon: faUser, text: 'Login', navigate: 'LoginScreen'},
];

function HomeScreen({navigation}) {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);

    //         useEffect(() => {
    //             const unsubscribe = navigation.addListener('focus', () => {
    //                 AsyncStorage.getItem('user').then((user) => {
    //                     if (user) {
    //                         setUser(JSON.parse(user));
    //                         setIsLogged(true);
    //                         console.log(user);
    //                     } else {
    //                         setIsLogged(false);
    //                     }
    //                 });
    //             });
    //             return unsubscribe;
    //         }, [navigation]);

    return (
        <ScrollView>
            {isLogged ? (
                <LoggedInHome
                    navigation={navigation}
                    buttonDataAfterLogin={buttonDataAfterLogin}
                    getIconSize={getIconSize}
                />
            ) : (
                <NotLoggedHome
                    navigation={navigation}
                    buttonData={buttonDataBeforeLogin}
                />
            )}
        </ScrollView>
    );
}

export default HomeScreen;
