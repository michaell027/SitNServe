import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import MyOrdersHolder from '../components/MyOrdersHolder';
import firestore from "@react-native-firebase/firestore";
import {Order} from "../models/Order";

interface OrdersScreenProps {
    navigation: any;
    route: any;
}

const OrdersScreen = ({navigation, route}: OrdersScreenProps) => {
    const {userUid} = route.params;
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetchOrders().then((orders) => {
            setOrders(orders);
        } );
    } , []);

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
                    const imageUrlAndName = await fetchRestaurantImageUrlAndName(doc.data().restaurantId);

                    if (imageUrlAndName) {
                        const order: Order = {
                            id: doc.id,
                            restaurantId: doc.data().restaurantId,
                            restaurantName: imageUrlAndName.restaurantName,
                            restaurantImage: imageUrlAndName.restaurantImageUrl,
                            seat: doc.data().seat,
                            total: doc.data().total,
                            date: doc.data().date,
                            items: doc.data().items,
                        };

                        orders.push(order);
                    } else {
                        console.error('No data found for restaurant ID:', doc.data().restaurantId);
                    }
                } catch (error) {
                    console.error('Error processing order:', error);
                }
            }

            const sortedOrders = orders.sort((a, b) => {

                const dateA = new Date(a.date);
                const dateB = new Date(b.date);

                return dateB.getTime() - dateA.getTime();
            } );

            return orders;

        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }

    };


    return (
        <ScrollView>
            <MyOrdersHolder orders={orders} />
        </ScrollView>
    );
};

export default OrdersScreen;
