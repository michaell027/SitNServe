import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {
    DrawerLayoutAndroid,
    StyleSheet,
    Pressable,
} from 'react-native';

// Navigation Imports
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

// FontAwesome Imports
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

// Screen Imports
import HomeScreen from './src/views/HomeScreen';
import RestaurantsScreen from './src/views/RestaurantsScreen';
import RestaurantScreen from './src/views/RestaurantScreen';
import ReserveSeatScreen from './src/views/ReserveSeatScreen';
import ScanScreen from './src/views/ScanScreen';
import RestaurantInfoScreen from './src/views/RestaurantInfoScreen';
import MenuListScreen from './src/views/MenuListScreen';
import RegisterScreen from './src/views/RegisterScreen';
import MapScreen from './src/views/MapScreen';
import AboutScreen from './src/views/AboutScreen';
import ProfileScreen from './src/views/ProfileScreen';
import LoginScreen from './src/views/LoginScreen';
import FavoriteRestaurantsScreen from './src/views/FavoriteRestaurantsScreen';
import {RestaurantProvider} from './src/providers/FavouriteRestaurantContext';
import OrdersScreen from './src/views/OrdersScreen';
import ReservationsScreen from './src/views/ReservationsScreen';
import CartScreen from './src/views/CartScreen';
import ScanQRScreen from './src/views/ScanQRScreen';

// Context Imports
import {SelectedItemsProvider} from './src/providers/SelectedItemsContext';
import {StripeProvider} from '@stripe/stripe-react-native';
import CheckoutScreen from './src/views/CheckoutScreen';

// Config Imports
import Config from './config/config';
import SettingsScreen from './src/views/SettingsScreen';
import PushNotification, {Importance} from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import EditProfileScreen from './src/views/EditProfileScreen';

const Stack = createNativeStackNavigator();

const PUBLISHABLE_KEY = Config.PUBLISHABLE_KEY;

const styles = StyleSheet.create({
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 50,
    },
});

function App() {
    const drawerRef = useRef<DrawerLayoutAndroid>(null);
    const [navigationObj, setNavigationObj] = useState(null);

    const createChannel = (channelID: string) => {
        PushNotification.createChannel(
            {
                channelId: channelID,
                channelName: 'Notification Channel',
                channelDescription: 'Channel for notifications',
                playSound: true,
                soundName: 'default',
                importance: Importance.HIGH,
                vibrate: true,
            },
            created => console.log(`createChannel returned '${created}'`),
        );
    };
    const showNotification = (channelId: string, options: any) => {
        PushNotification.localNotification({
            channelId: channelId,
            subText: options.subText,
            bigPictureUrl: options.bigPictureUrl,
            bigLargeIconUrl: options.bigPictureUrl,
            color: options.color,
            vibrate: true,
            vibration: 300,
            ongoing: false,
            priority: 'high',
            title: options.title,
            message: options.message,
        });
    };

    const handleBackgroundMessage = async (remoteMsg: any) => {
        console.log('Message handled in the background!', remoteMsg);
    };

    useEffect(() => {
        messaging()
            // @ts-ignore
            .getToken(firebase.app().options.messagingSenderId)
            .then(token => {
                console.log(token);
            });

        const unsubscribeOnMessage = messaging().onMessage(async remoteMsg => {
            const channelId = Math.random().toString(36).substring(7);
            createChannel(channelId);
            showNotification(channelId, remoteMsg.notification);
            console.log('A new FCM message arrived!', remoteMsg);
        });

        messaging().setBackgroundMessageHandler(handleBackgroundMessage);

        return () => {
            unsubscribeOnMessage();
        };
    }, []);

    return (
        <RestaurantProvider>
            <SelectedItemsProvider>
                <StripeProvider
                    publishableKey={PUBLISHABLE_KEY}
                    urlScheme={'payments-example'}>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName="Home">
                            <Stack.Screen
                                name="Home"
                                component={HomeScreen}
                                options={{
                                    title: `Sitn'serve`,
                                    // headerLeft: () => (
                                    //     <HeaderButtons>
                                    //         <Pressable
                                    //             onPress={() =>
                                    //                 drawerRef.current?.openDrawer()
                                    //             }>
                                    //             <FontAwesomeIcon icon={faBars} />
                                    //         </Pressable>
                                    //     </HeaderButtons>
                                    // ),
                                }}
                            />

                            <Stack.Screen
                                name="Restaurants"
                                component={RestaurantsScreen}
                            />
                            <Stack.Screen
                                name="Restaurant"
                                component={RestaurantScreen}
                            />
                            <Stack.Screen
                                name="ReserveSeatScreen"
                                component={ReserveSeatScreen}
                            />
                            <Stack.Screen
                                name="ScanScreen"
                                component={ScanScreen}
                            />
                            <Stack.Screen
                                name="RestaurantInfoScreen"
                                component={RestaurantInfoScreen}
                            />
                            <Stack.Screen
                                name="MenuListScreen"
                                component={MenuListScreen}
                            />
                            <Stack.Screen
                                name="ProfileScreen"
                                component={ProfileScreen}
                                options={{
                                    headerLeft: () => (
                                        <HeaderButtons>
                                            <Pressable
                                                onPress={() => {
                                                    // @ts-ignore
                                                    navigationObj.navigate(
                                                        'Home',
                                                    );
                                                }}>
                                                <FontAwesomeIcon
                                                    icon={faArrowLeft}
                                                />
                                            </Pressable>
                                        </HeaderButtons>
                                    ),
                                }}
                            />
                            <Stack.Screen
                                name="RegisterScreen"
                                component={RegisterScreen}
                            />
                            <Stack.Screen
                                name="MapScreen"
                                component={MapScreen}
                            />
                            <Stack.Screen
                                name="AboutScreen"
                                component={AboutScreen}
                            />
                            <Stack.Screen
                                name="LoginScreen"
                                component={LoginScreen}
                            />
                            <Stack.Screen
                                name="FavoriteRestaurantsScreen"
                                component={FavoriteRestaurantsScreen}
                            />
                            <Stack.Screen
                                name="OrdersScreen"
                                options={{
                                    headerLeft: () => (
                                        <HeaderButtons>
                                            <Pressable
                                                onPress={() => {
                                                    // @ts-ignore
                                                    navigationObj.navigate(
                                                        'ProfileScreen',
                                                    );
                                                }}>
                                                <FontAwesomeIcon
                                                    icon={faArrowLeft}
                                                />
                                            </Pressable>
                                        </HeaderButtons>
                                    ),
                                }}
                                component={OrdersScreen}
                            />
                            <Stack.Screen
                                name="ReservationsScreen"
                                component={ReservationsScreen}
                            />
                            <Stack.Screen
                                name="CartScreen"
                                component={CartScreen}
                            />
                            <Stack.Screen
                                name="ScanQRScreen"
                                component={ScanQRScreen}
                            />
                            <Stack.Screen
                                name="CheckoutScreen"
                                component={CheckoutScreen}
                            />
                            <Stack.Screen
                                name="SettingsScreen"
                                component={SettingsScreen}
                            />
                            <Stack.Screen
                                name="EditProfileScreen"
                                component={EditProfileScreen}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </StripeProvider>
            </SelectedItemsProvider>
        </RestaurantProvider>
    );
}

export default App;
