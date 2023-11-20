import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, ImageBackground, Pressable} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faCircleInfo,
    faClock,
    faMapLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';

function RestaurantInfoScreen({navigation, route}) {
    // State Declarations
    const [restaurant, setRestaurant] = useState({});
    const [content, setContent] = useState('info');
    const [region, setRegion] = useState(null);

    // Fetch restaurant data on component mount
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const doc = await firestore()
                    .collection('restaurants')
                    .doc(route.params.restaurantId)
                    .get();
                if (doc.exists) {
                    setRestaurant(doc.data());
                    const AddressString = `${doc.data().address.street} ${
                        doc.data().address.number
                    }, ${doc.data().address.city}, ${
                        doc.data().address.postalCode
                    }, ${doc.data().address.country}`;
                    console.log(AddressString);
                    // Geocoding
                    fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                            AddressString,
                        )}&key=AIzaSyCPe1QYMUIJW_Tq8lkDLTZY1LQ-M9wi6S0`,
                    )
                        .then(response => response.json())
                        .then(data => {
                            const location = data.results[0].geometry.location;
                            setRegion({
                                latitude: location.lat,
                                longitude: location.lng,
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            });
                        })
                        .catch(error =>
                            console.error('Error during geocoding:', error),
                        );
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRestaurantData();
    }, [route.params.restaurantId]);

    const renderOpeningHours = () => {
        const daysOfWeek = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ];
        const openingHours = restaurant.openingHours || {};

        return daysOfWeek.map(day => (
            <View
                key={day}
                className={
                    'flex flex-row justify-between py-1 sm:border-b-[1px] sm:mb-4'
                }>
                <Text className={'text-black text-lg'}>{day}</Text>
                <Text className={'text-black text-lg'}>
                    {openingHours[day] || 'Closed'}
                </Text>
            </View>
        ));
    };

    // Tab Icons UI
    const renderTabIcon = (selectedContent, icon) => (
        <Pressable
            className={`w-fit h-fit p-3 rounded-xl ${
                content === selectedContent ? 'border-b-2 bg-gray-300/70' : ''
            }`}
            onPress={() => setContent(selectedContent)}>
            <FontAwesomeIcon icon={icon} size="25" />
        </Pressable>
    );

    return (
        <ScrollView className={'h-full w-full'}>
            <View className={'min-h-[90vh]'}>
                {/* Restaurant Image */}
                <View className={'h-[35vh] justify-center items-center'}>
                    <ImageBackground
                        source={{uri: restaurant.imageUrl}}
                        className={'h-full w-full items-start justify-end'}>
                        <View
                            className={
                                'h-fit w-fit bg-white/50 p-4 rounded-xl mb-1 ml-1'
                            }>
                            <Text
                                style={{
                                    textShadowColor: 'black',
                                    textShadowRadius: 10,
                                    textShadowOffset: {width: 2, height: 2},
                                }}
                                className={'text-4xl font-bold text-white'}>
                                {restaurant.name}
                            </Text>
                        </View>
                    </ImageBackground>
                </View>

                {/* Tabs */}
                <View
                    className={
                        'w-full flex flex-row w-full justify-between px-8 mb-1 mt-2'
                    }>
                    {renderTabIcon('info', faCircleInfo)}
                    {renderTabIcon('openingHours', faClock)}
                    {renderTabIcon('map', faMapLocationDot)}
                </View>

                {/* Restaurant Description */}
                {content == 'info' && (
                    <View className={'px-2 mt-4'}>
                        <View
                            className={
                                'flex flex-row justify-between items-center mt-2'
                            }>
                            <Text className={'text-black text-xl font-bold'}>
                                About the restaurant...
                            </Text>
                            <Text className={'text-black text-lg font-bold'}>
                                {restaurant.rating}
                            </Text>
                        </View>
                        <Text className={'text-black text-lg mt-2'}>
                            {restaurant.description}
                        </Text>
                    </View>
                )}
                {content == 'openingHours' && (
                    <View className={'mt-4 px-2'}>
                        <Text
                            className={
                                'text-black text-xl font-bold mb-2 sm:mb-6'
                            }>
                            Opening Hours
                        </Text>
                        {renderOpeningHours()}
                    </View>
                )}
                {content == 'map' && (
                    <View className={'mt-4 px-2'}>
                        <Text className={'text-black text-xl font-bold mb-2'}>
                            Location
                        </Text>
                        {region ? (
                            <MapView
                                style={{width: '100%', height: 300}}
                                initialRegion={region}>
                                <Marker
                                    coordinate={{
                                        latitude: region.latitude,
                                        longitude: region.longitude,
                                    }}
                                    title={restaurant.name}
                                    description={restaurant.description}
                                />
                            </MapView>
                        ) : (
                            <Text>Loading map...</Text>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

export default RestaurantInfoScreen;
