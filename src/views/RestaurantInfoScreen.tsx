import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleInfo, faClock, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';

function RestaurantInfoScreen({ navigation, route }) {
    // State Declarations
    const [restaurant, setRestaurant] = useState({});
    const [content, setContent] = useState("info");

    // Fetch restaurant data on component mount
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const doc = await firestore().collection('restaurants').doc(route.params.restaurantId).get();
                if (doc.exists) {
                    setRestaurant(doc.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRestaurantData();
    }, [route.params.restaurantId]);

    // Tab Icons UI
    const renderTabIcon = (selectedContent, icon) => (
        <Pressable
            className={`w-fit h-fit p-3 rounded-xl ${content === selectedContent ? 'border-b-2 bg-gray-300/70' : ''}`}
            onPress={() => setContent(selectedContent)}
        >
            <FontAwesomeIcon icon={icon} size="25" />
        </Pressable>
    );

    return (
        <ScrollView>
            <View className={'min-h-[90vh]'}>
                {/* Restaurant Image */}
                <View className={'h-2/5 justify-center items-center'}>
                    <ImageBackground source={{ uri: restaurant.imageUrl }} className={'h-full w-full items-start justify-end'}>
                        <View className={'h-fit w-fit bg-white/50 p-4 rounded-xl mb-1 ml-1'}>
                            <Text style={{ textShadowColor: 'black', textShadowRadius: 10, textShadowOffset: { width: 2, height: 2 } }} className={'text-4xl font-bold text-white'}>{restaurant.name}</Text>
                        </View>
                    </ImageBackground>
                </View>

                {/* Tabs */}
                <View className={'w-full flex flex-row w-full justify-between px-8 mb-1 mt-2'}>
                    {renderTabIcon('info', faCircleInfo)}
                    {renderTabIcon('menu', faClock)}
                    {renderTabIcon('reviews', faMapLocationDot)}
                </View>

                {/* Restaurant Description */}
                {content == 'info' && (
                    <View className={'px-2'}>
                        <View className={'flex flex-row justify-between items-center mt-2'}>
                            <Text className={'text-black text-lg font-bold'}>About the restaurant...</Text>
                            <Text className={'text-black text-lg font-bold'}>{restaurant.rating}</Text>
                        </View>
                        <Text className={'text-black text-lg mt-2'}>{restaurant.description}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

export default RestaurantInfoScreen;
