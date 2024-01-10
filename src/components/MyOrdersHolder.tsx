import React, {useEffect} from 'react';
import {View} from 'react-native';
import MyOrderCard from './MyOrderCard';
import {styled} from 'nativewind';
import firestore from "@react-native-firebase/firestore";
import {Order} from "../models/Order";


const MyOrdersHolder = ({orders}: { orders: Order[] }) => {

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
