import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import MyOrdersHolder from '../components/MyOrdersHolder';

const OrdersScreen = () => {
    return (
        <ScrollView>
            <MyOrdersHolder />
        </ScrollView>
    );
};

export default OrdersScreen;
