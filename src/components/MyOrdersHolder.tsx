import React from 'react';
import {View} from 'react-native';
import MyOrderCard from './MyOrderCard';
import {styled} from 'nativewind';


const MyOrdersHolder = () => {
    const orders = [
        {
            name: 'Restaurant 1',
            description: '22-04-2023 11:03',
            price: 10.99,
        },
        {
            name: 'Restaurant 2',
            description: 'Cheese Burger',
            price: 5.99,
        },
        {
            name: 'Restaurant 3',
            description: 'French Fries',
            price: 2.99,
        },
    ];

    return (
        <View style={{flex: 1}}>
            <View>
                {orders.map((order, index) => {
                    return <MyOrderCard order={order} key={index} />;
                })}
            </View>
        </View>
    );
};

export default MyOrdersHolder;
