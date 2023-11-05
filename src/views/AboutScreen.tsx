import React from 'react';
import {View, Text, Image, Button} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from './../components/Carousel';

export default function AboutScreen() {
    return (
        <View className="flex-1">
            <Carousel />
        </View>
    );
}
