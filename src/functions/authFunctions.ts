import AsyncStorage from '@react-native-async-storage/async-storage';
import {FirebaseUser} from '../models/FirebaseUser';
import firestore from '@react-native-firebase/firestore';
import {User} from '../models/User';

const isLoggedIn = async (): Promise<boolean> => {
    const user = await AsyncStorage.getItem('user');
    if (user === null) {
        return false;
    } else {
        const userInfo = await AsyncStorage.getItem('user_info');
        return userInfo !== null;
    }
};

const isVerified = async (): Promise<boolean> => {
    try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
            const currentUser = JSON.parse(user); // Assuming FirebaseUser type is known in your context
            return currentUser.emailVerified;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        return false;
    }
};

const getUser = async (): Promise<FirebaseUser | null> => {
    try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
            return JSON.parse(user);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
};

const setUser = (user: FirebaseUser) => {
    AsyncStorage.setItem('user', JSON.stringify(user))
        .then(r => console.log('User stored: ', user))
        .catch(error => {
            console.error('Error storing user info:', error);
        });
};

const getUserInfo = async (): Promise<User | null> => {
    try {
        const userInfo = await AsyncStorage.getItem('user_info');
        if (userInfo) {
            return JSON.parse(userInfo);
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
};

const setUserInfo = (userInfo: User) => {
    AsyncStorage.setItem('user_info', JSON.stringify(userInfo))
        .then(r => console.log('User info stored: ', userInfo))
        .catch(error => {
            console.error('Error storing user info:', error);
        });
};

const fetchUserInfo = async (currentUser: FirebaseUser) => {
    if (!currentUser) return;

    const query = firestore()
        .collection('users')
        .where('uid', '==', currentUser.uid);
    const querySnapshot = await query.get();
    if (querySnapshot.size > 0) {
        const user = querySnapshot.docs[0].data() as User;
        setUserInfo(user);
    }
};

export {
    isLoggedIn,
    isVerified,
    fetchUserInfo,
    getUser,
    getUserInfo,
    setUserInfo,
    setUser,
};
