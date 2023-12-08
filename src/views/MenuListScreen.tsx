import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Image,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCartShopping} from '@fortawesome/free-solid-svg-icons';

import firestore from '@react-native-firebase/firestore';
import MenuItemCard from '../components/MenuItemCard';

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

const CartIconWithBadge = ({count}) => {
    return (
        <View style={styles.container}>
            <FontAwesomeIcon icon={faCartShopping} size={30} />
            {count > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{count}</Text>
                </View>
            )}
        </View>
    );
};

const MenuListScreen: React.FC<Props> = ({navigation, route}) => {
    const {restaurantIdAndSeat} = route.params;
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [count, setCount] = useState<number>(0);
    const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={() => navigation.navigate('CartScreen')}>
                    <CartIconWithBadge count={5} />
                </Pressable>
            ),
        });
    }, [navigation]);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const doc = await firestore()
                    .collection('restaurants')
                    .doc(restaurantIdAndSeat.restaurant_id)
                    .get();
                if (doc.exists) {
                    setMenuItems(doc.data()!.menu);
                    console.log('Document data:', doc.data()!.menu);
                } else {
                    Alert.alert('No data', 'This menu is not available.', [
                        {
                            text: 'OK',
                            onPress: () =>
                                console.log('Wrong QR code alert closed.'),
                        },
                    ]);
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData().then(r => console.log('Fetching data...'));
    }, [restaurantIdAndSeat]);

    return (
        <ScrollView className="bg-gray-100">
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <View className="space-y-2 p-4">
                    {menuItems.map((item, index) => (
                        <MenuItemCard key={index} item={item} />
                    ))}
                    <Text className="text-center text-lg">
                        {restaurantIdAndSeat.restaurant_id}
                    </Text>
                    <Text className="text-center text-lg">
                        {restaurantIdAndSeat.seat}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

export default MenuListScreen;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: -6,
        top: -10,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
