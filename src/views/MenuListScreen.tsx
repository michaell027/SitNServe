// Import from React and React Native
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, Alert } from 'react-native';

// FontAwesome icons for displaying the cart icon
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

// Firestore database from Firebase
import firestore from '@react-native-firebase/firestore';

// Definition of TypeScript interfaces for data transfer between screens
interface RestaurantIdAndSeat {
    restaurant_id: string;
    seat: number;
}

interface Route {
    params: {
        restaurantIdAndSeat: RestaurantIdAndSeat;
    };
}

interface MenuItem {
    name: string;
    price: string;
}

interface Props {
    navigation: any;
    route: Route;
}

// Main component of the menu screen
const MenuListScreen: React.FC<Props> = ({ navigation, route }) => {
    const { restaurantIdAndSeat } = route.params;
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // useEffect hook for loading data from the Firestore database
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                // Load the document for a specific restaurant ID
                const doc = await firestore().collection('restaurants').doc(restaurantIdAndSeat.restaurant_id).get();
                if (doc.exists) {
                    // If the document exists, set the menu items
                    setMenuItems(doc.data()!.menu);
                    console.log('Document data:', doc.data()!.menu);
                } else {
                    Alert.alert(
                        "No data",
                        "This menu is not available.",
                        [
                            { text: "OK", onPress: () => console.log("Wrong QR code alert closed.") }
                        ]
                    );
                    console.log('No such document!');
                }
            } catch (error) {
                // In case of error, print the error to the console
                console.error('Error fetching data:', error);
            } finally {
                // Set loading to false after fetching data
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [restaurantIdAndSeat]);

    // Rendering components on the screen
    return (
        <ScrollView>
            {loading ? (
                <View className={'h-screen w-full items-center justify-center'}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <View className={'space-y-2 p-2'}>
                    {menuItems.map((item, index) => (
                        <View key={index} className={'flex w-full flex-row p-2 bg-[#DDDDDD] rounded-xl items-center'}>
                            <View className={'w-1/5 items-center justify-center bg-white rounded-xl'}>
                                <Image source={require('./../../assets/images/menu/coca_cola.png')} style={{ height: 80 }} resizeMode="contain" />
                            </View>
                            <Text className={'w-2/5 text-lg font-bold pl-2'}>{item.name}</Text>
                            <View className={'w-2/5 flex flex-row items-center justify-center space-x-8'}>
                                <Text className={'text-lg'}>{item.price}€</Text>
                                <Pressable>
                                    <FontAwesomeIcon icon={faCartPlus} size={30} />
                                </Pressable>
                            </View>
                        </View>
                    ))}
                    <Text>MenuListScreen</Text>
                    <Text>{restaurantIdAndSeat.restaurant_id}</Text>
                    <Text>{restaurantIdAndSeat.seat}</Text>
                </View>
            )}
        </ScrollView>
    );
};

export default MenuListScreen;
