import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, Alert, Pressable} from 'react-native';
import { SelectedItemsContext } from '../providers/SelectedItemsContext';
import {usePaymentSheet} from "@stripe/stripe-react-native";
import Config from "../../config/config";
import firestore from "@react-native-firebase/firestore";
import {firebase} from "@react-native-firebase/database";

const API_URL = Config.API_URL;

const CheckoutScreen = ({navigation, route}: {navigation: any; route: any}) => {
    const [ready, setReady] = useState(false);
    const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();
    const [userUid, setUserUid] = useState<string|null>(null);
    const { selectedItems, updateSelectedItems } = useContext(SelectedItemsContext);
    const {restaurantIdAndSeat} = route.params;

    useEffect(() => {
        console.log(restaurantIdAndSeat);
    }   , []);
    const calculateTotal = () => {
        return selectedItems.reduce((total, item) => total + item.price * item.quantity!, 0);
    };

    useEffect(() => {
        initializePaymentSheet().then();
    }, []);

    const fetchUserUid = async () => {
        const user = firebase.auth().currentUser;
        if (user) {
            setUserUid(user.uid);
        } else {
            setUserUid(null);
            navigation.navigate('LoginScreen');
        }
    };

    useEffect(() => {
        fetchUserUid().then();
    }, []);

    useEffect(() => {
        console.log(userUid);
        console.log(restaurantIdAndSeat.restaurant_id);
        console.log(restaurantIdAndSeat.seat);
    }  , []);

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: true,
            defaultBillingDetails: {
                name: 'Jane Doe',
            },
        });
        if (!error) {
            setReady(true);
        }
    };

    const fetchPaymentSheetParams = async () => {
        const totalAmount = getTotalAmount();
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ totalAmount }),
        });

        const {paymentIntent, ephemeralKey, customer, publishableKey} = await response.json();

        console.log(paymentIntent, ephemeralKey, customer, publishableKey);

        return {paymentIntent, ephemeralKey, customer, publishableKey};
    }

    const openPaymentSheet = async () => {
        if (userUid === null) {
            Alert.alert('Error', 'You are not logged in!');
            return;
        }
        if (selectedItems.length === 0) {
            Alert.alert('Error', 'Your cart is empty!');
            return;
        }

        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
            firestore()
                .collection('users')
                .doc(userUid)
                .collection('orders')
                .add({
                    restaurantId: restaurantIdAndSeat.restaurant_id,
                    seat: restaurantIdAndSeat.seat,
                    items: selectedItems,
                    total: calculateTotal(),
                    date: new Date(),
                })
                .then(() => {
                    navigation.navigate('OrdersScreen');
                    updateSelectedItems([]);
                })
                .catch(error => {
                    console.log('Error adding reservation to user:', error);
                });
        }
    };


    const getTotalAmount = () => {
        return selectedItems
            .reduce((total, item) => {
                return total + item.price * (item.quantity || 0);
            }, 0)
            .toFixed(2);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Checkout</Text>
            <FlatList
                data={selectedItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailText}>Quantity: {item.quantity}</Text>
                            <Text style={styles.detailText}>Price: ${item.price.toFixed(2)}</Text>
                        </View>
                    </View>
                )}
            />
            <View style={styles.footer}>
                <Text style={styles.total}>Total: ${calculateTotal().toFixed(2)}</Text>
                <Pressable style={styles.button} onPress={() => {openPaymentSheet()}} >
                    <Text style={styles.buttonText}>Checkout</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    item: {
        backgroundColor: '#f7f7f7',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 3
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    detailText: {
        fontSize: 16
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#f7f7f7',
        marginHorizontal: 5,
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 3
    },
    total: {
        fontSize: 20
    },
    button: {
        backgroundColor: '#66b7b7',
        padding: 10,
        borderRadius: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default CheckoutScreen;
