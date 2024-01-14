// React & React Native Imports
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    Button,
    DrawerLayoutAndroid,
    StyleSheet,
    Pressable, Platform,
} from 'react-native';

// Navigation Imports
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

// FontAwesome Imports
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faBars,
    faHouse,
    faInfo,
    faPaintBrush,
    faUtensils,
    faArrowLeft
} from '@fortawesome/free-solid-svg-icons';

// Screen Imports
import HomeScreen from './src/views/HomeScreen';
import ChangeTheme from './src/views/ChangeTheme';
import ChangeThemeSecond from './src/views/ChangeThemeSecond';
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
import {RestaurantProvider} from "./src/providers/FavouriteRestaurantContext";
import OrdersScreen from "./src/views/OrdersScreen";
import ReservationsScreen from "./src/views/ReservationsScreen";
import CartScreen from "./src/views/CartScreen";
import ScanQRScreen from "./src/views/ScanQRScreen";

// Context Imports
import {SelectedItemsProvider} from './src/providers/SelectedItemsContext';
import {StripeProvider} from "@stripe/stripe-react-native";
import CheckoutScreen from "./src/views/CheckoutScreen";

// Config Imports
import Config from "./config/config";
import SettingsScreen from "./src/views/SettingsScreen";
import PushNotification, {Importance} from "react-native-push-notification";
import messaging from "@react-native-firebase/messaging";
import firebase from "@react-native-firebase/app";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

function BottomTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: 'purple',
                tabBarInactiveTintColor: 'gray',
                tabBarShowLabel: false,
                tabBarStyle: [
                    {
                        display: 'flex',
                    },
                    null,
                ],
            }}>

            <Tab.Screen
                name="ChangeTheme"
                component={ChangeTheme}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size}) => (
                        <View style={styles.iconCircle}>
                            <FontAwesomeIcon
                                icon={faPaintBrush}
                                color={color}
                                size={size}
                            />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="ChangeThemeSecond"
                component={ChangeThemeSecond}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size}) => (
                        <View style={styles.iconCircle}>
                            <FontAwesomeIcon
                                icon={faPaintBrush}
                                color={color}
                                size={size}
                            />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Restaurants"
                component={RestaurantsScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <View style={styles.iconCircle}>
                            <FontAwesomeIcon
                                icon={faUtensils}
                                color={color}
                                size={size}
                            />
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

function App() {
    const drawerRef = useRef<DrawerLayoutAndroid>(null);
    const [navigationObj, setNavigationObj] = useState(null);

    const createChannel = (channelID) => {
        PushNotification.createChannel(
            {
                channelId: channelID,
                channelName: "Notification Channel",
                channelDescription: "Channel for notifications",
                playSound: true,
                soundName: "default",
                importance: Importance.HIGH,
                vibrate: true,
            },
            (created) => console.log(`createChannel returned '${created}'`)
        );
    }
    const showNotification = (channelId, options) => {
        PushNotification.localNotification({
            channelId: channelId,
            subText: options.subText,
            bigPictureUrl: options.bigPictureUrl,
            bigLargeIconUrl: options.bigPictureUrl,
            color: options.color,
            vibrate: true,
            vibration: 300,
            ongoing: false,
            priority: "high",
            title: options.title,
            message: options.message,
        });
    }

    const handleBackgroundMessage = async (remoteMsg) => {
        console.log('Message handled in the background!', remoteMsg);
    };

    useEffect(() => {
        messaging()
            .getToken(firebase.app().options.messagingSenderId)
            .then((token) => {
                console.log(token);
            });

        const unsubscribeOnMessage = messaging().onMessage(async (remoteMsg) => {
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


    const navigationView = ({navigation}) => (
        <View className="flex-1 bg-gray-200 p-0 dark:bg-gray-500">
            <Text className="p-4 py-16 text-center text-lg text-black dark:text-white">
                app
            </Text>

            <Pressable className="items-center justify-center py-5 px-8 rounded mb-3 bg-black">
                <Text className="text-white text-lg font-bold">aaa</Text>
            </Pressable>

            <Pressable
                className="w-full mb-1 py-3 px-2 rounded bg-blue-500"
                onPress={() => {
                    navigation.navigate('Home');
                    drawerRef.current?.closeDrawer();
                }}>
                <Text className="text-white text-center">Home Screen</Text>
            </Pressable>

            <Pressable
                className="w-full mb-4 py-3 px-2 rounded bg-gray-300"
                onPress={() => {
                    navigation.navigate('Details');
                    drawerRef.current?.closeDrawer();
                }}>
                <Text className="text-black text-center">Details Screen</Text>
            </Pressable>

            <Pressable
                className="w-full mb-4 py-3 px-2 rounded bg-gray-300"
                onPress={() => {
                    navigation.navigate('Details');
                    drawerRef.current?.closeDrawer();
                }}>
                <Text style="text-black text-center">Details Screen</Text>
            </Pressable>
        </View>
    );

    // @ts-ignore
    return (
        <RestaurantProvider>
            <SelectedItemsProvider>
                <StripeProvider
                    publishableKey={PUBLISHABLE_KEY}
                    urlScheme={'payments-example'}
                >
            <DrawerLayoutAndroid
            ref={drawerRef}
            drawerWidth={300}
            drawerPosition="left"
            renderNavigationView={() =>
                navigationView({navigation: navigationObj})
            }>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        listeners={({navigation}) => {
                            setNavigationObj(navigation);
                        }}
                        options={{
                            title: `Seat's App`,
                            headerLeft: () => (
                                <HeaderButtons>
                                    <Pressable
                                        onPress={() =>
                                            drawerRef.current?.openDrawer()
                                        }>
                                        <FontAwesomeIcon icon={faBars} />
                                    </Pressable>
                                </HeaderButtons>
                            ),
                        }}
                    />
                    <Stack.Screen
                        name="Main"
                        component={BottomTabNavigator}
                        listeners={({navigation}) => {
                            setNavigationObj(navigation);
                        }}
                        options={{
                            title: 'Názov App',
                            headerLeft: () => (
                                <HeaderButtons>
                                    <Pressable
                                        onPress={() =>
                                            drawerRef.current?.openDrawer()
                                        }>
                                        <FontAwesomeIcon icon={faBars} />
                                    </Pressable>
                                </HeaderButtons>
                            ),
                        }}
                    />

                    <Stack.Screen
                        name="Details"
                        component={( BottomTabNavigator)}
                        options={{
                            title: 'Details',
                            headerLeft: () => (
                                <HeaderButtons>
                                    <Item
                                        title="Menu"
                                        iconName="md-menu"
                                        onPress={() =>
                                            drawerRef.current?.openDrawer()
                                        }
                                    />
                                </HeaderButtons>
                            ),
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
                    <Stack.Screen name="ChangeTheme" component={ChangeTheme} />
                    <Stack.Screen
                        name="ChangeThemeSecond"
                        component={ChangeThemeSecond}
                    />
                    <Stack.Screen
                        name="ReserveSeatScreen"
                        component={ReserveSeatScreen}
                    />
                    <Stack.Screen name="ScanScreen" component={ScanScreen} />
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

                                    <Pressable onPress={() => {
                                        // @ts-ignore
                                        navigationObj.navigate('Home')}
                                    }>
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </Pressable>

                                </HeaderButtons>
                            ),
                        }}
                    />
                    <Stack.Screen
                        name="RegisterScreen"
                        component={RegisterScreen}
                    />
                    <Stack.Screen name="MapScreen" component={MapScreen} />
                    <Stack.Screen name="AboutScreen" component={AboutScreen} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="FavoriteRestaurantsScreen" component={FavoriteRestaurantsScreen}/>
                    <Stack.Screen
                        name="OrdersScreen"
                        options={{
                            headerLeft: () => (
                                <HeaderButtons>

                                    <Pressable onPress={() => {
                                        // @ts-ignore
                                        navigationObj.navigate('ProfileScreen')}
                                    }>
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </Pressable>

                                </HeaderButtons>
                            ),
                        }}
                        component={OrdersScreen}/>
                    <Stack.Screen name="ReservationsScreen" component={ReservationsScreen}/>
                    <Stack.Screen name="CartScreen" component={CartScreen}/>
                    <Stack.Screen name="ScanQRScreen" component={ScanQRScreen}/>
                    <Stack.Screen name="CheckoutScreen" component={CheckoutScreen}/>
                    <Stack.Screen name="SettingsScreen" component={SettingsScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </DrawerLayoutAndroid>
                </StripeProvider>
            </SelectedItemsProvider>
        </RestaurantProvider>
    );
}

export default App;
