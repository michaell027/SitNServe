import React, {useContext, useEffect, useState} from 'react';
import {Text, View, FlatList, TouchableOpacity, StyleSheet, Alert, Button} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import {SelectedItemsContext} from '../providers/SelectedItemsContext';
import {MenuItem} from './MenuListScreen';


const CartScreen = ({navigation, route}: {navigation: any; route: any}) => {
    const {selectedItems, updateSelectedItems} =
        useContext(SelectedItemsContext);
    const {restaurantIdAndSeat} = route.params;

    useEffect(() => {
        console.log(restaurantIdAndSeat);
    }   , []);

    const getTotalAmount = () => {
        return selectedItems
            .reduce((total, item) => {
                return total + item.price * (item.quantity || 0);
            }, 0)
            .toFixed(2);
    };

    const increaseAmount = (id: string) => {
        if (!selectedItems) {
            return;
        }

        const newSelectedItems: MenuItem[] = [...selectedItems];
        const index = newSelectedItems.findIndex(i => i.id === id);

        if (index !== -1 && newSelectedItems[index]) {
            newSelectedItems[index].quantity =
                (newSelectedItems[index].quantity || 0) + 1;
        }

        updateSelectedItems(newSelectedItems);
    };

    const decreaseAmount = (id: string) => {
        if (!selectedItems) {
            return;
        }

        const newSelectedItems: MenuItem[] = [...selectedItems];
        const index = newSelectedItems.findIndex(i => i.id === id);

        if (
            index !== -1 &&
            newSelectedItems[index] &&
            newSelectedItems[index].quantity
        ) {
            newSelectedItems[index].quantity =
                (newSelectedItems[index].quantity || 0) - 1;

            if (newSelectedItems[index].quantity === 0) {
                newSelectedItems.splice(index, 1);
            }
        }

        updateSelectedItems(newSelectedItems);
    };

    const renderItem = ({item}: {item: MenuItem}) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.amountAndPriceContainer}>
                <View style={styles.amountContainer}>
                    <TouchableOpacity
                        onPress={() => decreaseAmount(item.id)}
                        style={styles.amountButton}>
                        <Text style={styles.amountButtonText}>
                            <FontAwesomeIcon icon={faMinus} size={12} />
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.amountText}>{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => increaseAmount(item.id)}
                        style={styles.amountButton}>
                        <Text style={styles.amountButtonText}>
                            <FontAwesomeIcon icon={faPlus} size={12} />
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={selectedItems}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <Text style={styles.totalAmountText}>
                Total: ${getTotalAmount()}
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('CheckoutScreen', {restaurantIdAndSeat: restaurantIdAndSeat})}
                style={styles.orderButton}>
                <Text style={styles.orderButtonText}>Checkout</Text>
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
    totalAmountText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CartScreen;
