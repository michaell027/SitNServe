import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { styled } from 'nativewind';

function DetailsScreen({ navigation }) {
    return (
        <ScrollView>
            <View className={"flex flex-col w-full h-full"}>
                <View className={"flex flex-row w-full h-fit rounded-3xl mx-4 mt-2 p-2 bg-gray-400/30"}>
                    <View className={'w-1/4 h-40'}>
                        <Image source={require('./../../assets/images/restaurants/restaurant-paris.jpg')} className={"w-full flex-1"} style={{resizeMode: 'cover' }} />
                    </View>
                    <View className={"flex-col w-3/4 justify-between p-4 leading-normal"}>
                        <Text className={"mb-2 text-2xl font-bold tracking-tight text-gray-900"}>Restaurant in Paris</Text>
                        <Text className={"mb-3 font-normal"}>Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order. Orders are here the best you can have.</Text>
                    </View>
                </View>
                <View className={"flex flex-row w-full h-fit rounded-3xl mx-4 mt-2 p-2 bg-gray-400/30"}>
                    <View className={'w-1/4 h-40'}>
                        <Image source={require('./../../assets/images/restaurants/restaurant-paris.jpg')} className={"w-full flex-1"} style={{resizeMode: 'cover' }} />
                    </View>
                    <View className={"flex-col w-3/4 justify-between p-4 leading-normal"}>
                        <Text className={"mb-2 text-2xl font-bold tracking-tight text-gray-900"}>Restaurant in Paris</Text>
                        <Text className={"mb-3 font-normal"}>Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order. Orders are here the best you can have.</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default DetailsScreen;
