import React, {useState, useEffect} from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {User} from '../models/User';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoggedInHomeProps {
    navigation: any;
    buttonDataAfterLogin: ButtonData[];
    getIconSize: () => number;
    user: User;
}

interface ButtonData {
    icon: any;
    navigate: string;
    text: string;
}

const windowHeight = Dimensions.get('window').height;

function LoggedInHome({
    navigation,
    buttonDataAfterLogin,
    getIconSize,
    user,
}: LoggedInHomeProps) {
    const [userInfo, setUserInfo] = useState<User | null>(null);

    const fetchUserInfo = () => {
        AsyncStorage.getItem('user_info').then(userInfo => {
            if (userInfo) {
                setUserInfo(JSON.parse(userInfo));
                console.log('User data storage: ', userInfo);
            } else {
                console.log('No user data in storage, fetching from firestore');
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
        }).catch(error => {
            console.error('Error fetching user info:', error);
        });
    };

    useEffect(() => {
        fetchUserInfo();
        const unsubscribe = navigation.addListener('focus', fetchUserInfo);
        return unsubscribe;
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('./../../assets/images/breakfast2.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.buttonsContainer}>
                    {buttonDataAfterLogin?.map((button, index) => (
                        <View key={index} style={styles.buttonWrapper}>
                            <Pressable
                                onPress={() =>
                                    navigation.navigate(button.navigate)
                                }
                                style={styles.pressable}>
                                <FontAwesomeIcon
                                    icon={button.icon}
                                    size={getIconSize()}
                                    color="#012840"
                                />
                            </Pressable>
                            <Text style={styles.buttonText}>{button.text}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

export default LoggedInHome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: windowHeight,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    mainContainer: {
        width: '100%',
        height: '90%',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 6,
    },
    imageContainer: {
        maxHeight: '50%',
        paddingVertical: 6,
        paddingHorizontal: 2,
        width: '100%',
        alignItems: 'center',
    },
    image: {
        width: '75%',
        height: '100%',
        borderRadius: 20,
    },
    buttonsContainer: {
        maxHeight: '50%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    buttonWrapper: {
        width: '33%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 15,
    },
    pressable: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 23,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#012840',
        marginBottom: 8,
    },
    buttonText: {
        color: '#012840',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
