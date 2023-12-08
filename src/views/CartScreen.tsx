import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";

interface CartItem {
    id: string;
    name: string;
    price: number;
    amount: number;
}

const CartScreen = () => {
    const [cartItems, setCartItems] = useState([
        { id: '1', name: 'Coffee', price: 2.99, amount: 1 },
        { id: '2', name: 'Pasta', price: 11.50, amount: 1 },
        { id: '3', name: 'Pizza', price: 8.99, amount: 1 },
        { id: '4', name: 'Salad', price: 5.99, amount: 1 },
        { id: '5', name: 'Burger', price: 7.99, amount: 1 },
        { id: '6', name: 'Coke', price: 1.99, amount: 1 },
        { id: '7', name: 'Fries', price: 3.99, amount: 1 },
        { id: '8', name: 'Tea', price: 2.99, amount: 1 },
        { id: '9', name: 'Water', price: 1.99, amount: 1 },
        { id: '10', name: 'Beer', price: 3.99, amount: 1 },
        // Add more items here...
    ]);

    const increaseAmount = (id: string) => {
        const newCartItems = cartItems.map(item => {
            if (item.id === id) {
                return { ...item, amount: item.amount + 1 };
            }
            return item;
        });
        setCartItems(newCartItems);
    };

    const decreaseAmount = (id: string) => {
        const newCartItems = cartItems.map(item => {
            if (item.id === id && item.amount > 1) {
                return { ...item, amount: item.amount - 1 };
            }
            return item;
        });
        setCartItems(newCartItems);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.amountAndPriceContainer}>
                <View style={styles.amountContainer}>
                    <TouchableOpacity onPress={() => decreaseAmount(item.id)} style={styles.amountButton}>
                        <Text style={styles.amountButtonText}>
                            <FontAwesomeIcon icon={faMinus} size={12}  />
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.amountText}>{item.amount}</Text>
                    <TouchableOpacity onPress={() => increaseAmount(item.id)} style={styles.amountButton}>
                        <Text style={styles.amountButtonText}>
                            <FontAwesomeIcon icon={faPlus} size={12}  />
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>${(item.price * item.amount).toFixed(2)}</Text>
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <TouchableOpacity style={styles.orderButton}>
                <Text style={styles.orderButtonText}>Order</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    itemName: {
        fontSize: 18,
    },
    amountButton: {
        marginHorizontal: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
    },
    amountButtonText: {
        fontSize: 15,
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    amountText: {
        fontSize: 18,
        marginHorizontal: 8,
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    orderButton: {
        backgroundColor: '#66b7b7',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    orderButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    amountAndPriceContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
});

export default CartScreen;
