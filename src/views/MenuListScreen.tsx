import React from 'react';
import {View, Text} from 'react-native';

function MenuListScreen ({navigation, route}) {
    const {restaurant} = route.params;
    return (
        <View>
            <Text>MenuListScreen</Text>
            <Text>{restaurant.restaurant_id}</Text>
            <Text>{restaurant.seat}</Text>
        </View>
    )
}

export default MenuListScreen;