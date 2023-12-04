// React & React Native Imports
import * as React from 'react';
import {useRef, useState} from 'react';
import {
    View,
    Text,
    Button,
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
    faBars,
    faHouse,
    faInfo,
    faPaintBrush,
    faUtensils,
} from '@fortawesome/free-solid-svg-icons';

// Screen Imports
import HomeScreen from './src/views/HomeScreen';
import DetailsScreen from './src/views/DetailsScreen';
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
import {RestaurantProvider} from "./src/services/FavouriteRestaurantContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
                name="Details"
                component={DetailsScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size}) => (
                        <View style={styles.iconCircle}>
                            <FontAwesomeIcon
                                icon={faInfo}
                                color={color}
                                size={size}
                            />
                        </View>
                    ),
                }}
            />
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

    return (
        <RestaurantProvider>
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
                        component={(DetailsScreen, BottomTabNavigator)}
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
                    />
                    <Stack.Screen
                        name="RegisterScreen"
                        component={RegisterScreen}
                    />
                    <Stack.Screen name="MapScreen" component={MapScreen} />
                    <Stack.Screen name="AboutScreen" component={AboutScreen} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="FavoriteRestaurantsScreen" component={FavoriteRestaurantsScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </DrawerLayoutAndroid>
        </RestaurantProvider>
    );
}

export default App;
