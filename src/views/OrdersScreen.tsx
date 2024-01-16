import React, {useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import MyOrdersHolder from '../components/MyOrdersHolder';
import firestore from '@react-native-firebase/firestore';
import {Order} from '../models/Order';

interface OrdersScreenProps {
    navigation: any;
    route: any;
}

const OrdersScreen = ({navigation, route}: OrdersScreenProps) => {
    const {userUid} = route.params;
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchOrders().then(orders => {
            setOrders(orders);
            setLoading(false);
        });
    }, []);

    const fetchOrders = async () => {
        const fetchRestaurantImageUrlAndName = async (restaurantId: string) => {
            try {
                const snapshot = await firestore()
                    .collection('restaurants')
                    .doc(restaurantId)
                    .get();

                const data = snapshot.data();

                if (data) {
                    return {
                        restaurantName: data.name,
                        restaurantImageUrl: data.imageUrl,
                    };
                } else {
                    return null;
                }
            } catch (error) {
                console.error('Error fetching restaurant image url:', error);
                throw error;
            }
        };

        try {
            const snapshot = await firestore()
                .collection('users')
                .doc(userUid)
                .collection('orders')
                .get();

            const orders: Order[] = [];

            for (const doc of snapshot.docs) {
                try {
                    const imageUrlAndName =
                        await fetchRestaurantImageUrlAndName(
                            doc.data().restaurantId,
                        );

                    const seconds = doc.data().date.seconds;
                    const milliseconds = doc.data().date.nanoseconds / 1000000;

                    const date = new Date(0);
                    date.setUTCSeconds(seconds);
                    date.setUTCMilliseconds(milliseconds);

                    if (imageUrlAndName) {
                        const order: Order = {
                            id: doc.id,
                            restaurantId: doc.data().restaurantId,
                            restaurantName: imageUrlAndName.restaurantName,
                            restaurantImage: imageUrlAndName.restaurantImageUrl,
                            seat: doc.data().seat,
                            total: doc.data().total,
                            date: doc.data().date,
                            dateFormatDate: date,
                            items: doc.data().items,
                        };

                        orders.push(order);
                    } else {
                        console.error(
                            'No data found for restaurant ID:',
                            doc.data().restaurantId,
                        );
                    }
                } catch (error) {
                    console.error('Error processing order:', error);
                }
            }

            orders.sort((a, b) => {
                return b.dateFormatDate.getTime() - a.dateFormatDate.getTime();
            });

            return orders;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView>
            <MyOrdersHolder orders={orders} />
        </ScrollView>
    );
};

export default OrdersScreen;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
