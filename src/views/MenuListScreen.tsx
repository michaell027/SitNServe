import React, {useState, useEffect, useLayoutEffect, useContext} from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCartShopping} from '@fortawesome/free-solid-svg-icons';

import firestore from '@react-native-firebase/firestore';
import MenuItemCard from '../components/MenuItemCard';
import {SelectedItemsContext} from '../providers/SelectedItemsContext';

interface RestaurantIdAndSeat {
    restaurant_id: string;
    seat: number;
}

interface Route {
    params: {
        restaurantIdAndSeat: RestaurantIdAndSeat;
    };
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    quantity?: number;
}

interface Props {
    navigation: any;
    route: Route;
}

const CartIconWithBadge = () => {
    const {cartCount} = useContext(SelectedItemsContext);

    return (
        <View style={styles.container}>
            <FontAwesomeIcon icon={faCartShopping} size={30} />
            {cartCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
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
    const {selectedItems: selectedItemsContext, updateSelectedItems} =
        useContext(SelectedItemsContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Pressable onPress={() => navigation.navigate('CartScreen')}>
                    <CartIconWithBadge />
                </Pressable>
            ),
        });
    }, [navigation, count]);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const querySnapshot = await firestore()
                    .collection('restaurants')
                    .doc(restaurantIdAndSeat.restaurant_id)
                    .collection('menu')
                    .get();

                const menus: MenuItem[] = [];
                querySnapshot.forEach(doc => {
                    menus.push({
                        id: doc.id,
                        name: doc.data().name,
                        price: doc.data().price,
                    });
                });

                if (menus.length > 0) {
                    setMenuItems(menus);
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

    useEffect(() => {
        const newCount = selectedItems.reduce(
            (acc, item) => acc + (item.quantity || 0),
            0,
        );
        setCount(newCount);
    }, [selectedItems]);

    useEffect(() => {
        const newMenuItems = menuItems.map(item => {
            const index = selectedItems.findIndex(i => i.id === item.id);
            if (index !== -1) {
                return {...item, quantity: selectedItems[index].quantity};
            }
            return item;
        });
        setMenuItems(newMenuItems);
    }, [selectedItems]);

    const incrementQuantity = (index: number) => {
        const newMenuItems = [...menuItems];
        const item = newMenuItems[index];

        item.quantity = (item.quantity || 0) + 1;

        setMenuItems(newMenuItems);

        const selectedItemIndex = selectedItems.findIndex(
            i => i.id === item.id,
        );
        if (selectedItemIndex >= 0) {
            selectedItems[selectedItemIndex].quantity = item.quantity;
        } else {
            selectedItems.push({...item});
        }
        setSelectedItems([...selectedItems]);
        updateSelectedItems([...selectedItems]);
    };

    const decrementQuantity = (index: number) => {
        const newMenuItems = [...menuItems];
        const item = newMenuItems[index];

        if (item.quantity && item.quantity > 1) {
            item.quantity -= 1;
        } else {
            item.quantity = 0;
        }

        setMenuItems(newMenuItems);

        const selectedItemIndex = selectedItems.findIndex(
            i => i.id === item.id,
        );
        if (selectedItemIndex >= 0) {
            if (item.quantity > 0) {
                selectedItems[selectedItemIndex].quantity = item.quantity;
            } else {
                // Remove the item from selectedItems if its quantity is 0
                selectedItems.splice(selectedItemIndex, 1);
            }
        }

        setSelectedItems([...selectedItems]);
        updateSelectedItems([...selectedItems]);
    };

    useEffect(() => {
        const newSelectedItems = [...selectedItemsContext];
        const newMenuItems = menuItems.map(item => {
            const index = newSelectedItems.findIndex(i => i.id === item.id);
            if (index !== -1) {
                return {...item, quantity: newSelectedItems[index].quantity};
            }
            return item;
        });
        setMenuItems(newMenuItems);
        setSelectedItems(newSelectedItems);
        setCount(
            newSelectedItems.reduce(
                (acc, item) => acc + (item.quantity || 0),
                0,
            ),
        );
    }, [selectedItemsContext]);

    useEffect(() => {
        selectedItems.forEach(item => {
            const index = menuItems.findIndex(i => i.id === item.id);
            if (index !== -1) {
                menuItems[index].quantity = item.quantity;
            }
        });
    }, [selectedItemsContext]);

    return (
        <ScrollView style={styles.scrollView}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <View style={styles.menuItemsContainer}>
                    {menuItems.map((item, index) => (
                        <MenuItemCard
                            key={index}
                            item={item}
                            onIncrement={() => incrementQuantity(index)}
                            onDecrement={() => decrementQuantity(index)}
                            quantity={item.quantity || 0}
                            totalPrice={(item.quantity || 0) * item.price}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            count={count}
                            setCount={setCount}
                            menuItems={menuItems}
                            setMenuItems={setMenuItems}
                        />
                    ))}
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
    scrollView: {
        backgroundColor: '#f3f4f6',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemsContainer: {
        padding: 16,
        spaceY: 8,
    },
    menuItemText: {
        textAlign: 'center',
        fontSize: 18,
    },
});
