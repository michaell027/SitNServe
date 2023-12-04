import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Platform,
    PermissionsAndroid,
    ActivityIndicator,
    ScrollView,
    Pressable,
    Image,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {getCurrentPosition} from '../services/locationService';
import {
    getRestaurants,
    getCoordinatesFromRestaurants,
} from '../services/restaurantsService';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUtensils} from '@fortawesome/free-solid-svg-icons';

function MapScreen({navigation, route}) {
    const [position, setPosition] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantCoordinates, setRestaurantCoordinates] = useState([]);
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.04,
        longitudeDelta: 0.02,
    });
    const [nearbyRestaurants, setNearbyRestaurants] = useState([]);

    const handleRegionChange = newRegion => {
        setRegion(newRegion);
        fetchRestaurantsInView(newRegion);
    };

    const truncateDescription = (description, length) => {
        const splitDescription = description.split(' ');
        if (splitDescription.length > length) {
            return splitDescription.slice(0, length).join(' ') + '...';
        } else {
            return description;
        }
    };

    const fetchRestaurantsInView = newRegion => {
        const nearbyRestaurants = restaurantCoordinates.filter(restaurant => {
            return (
                restaurant.coordinates.latitude <=
                    newRegion.latitude + newRegion.latitudeDelta / 2 &&
                restaurant.coordinates.latitude >=
                    newRegion.latitude - newRegion.latitudeDelta / 2 &&
                restaurant.coordinates.longitude <=
                    newRegion.longitude + newRegion.longitudeDelta / 2 &&
                restaurant.coordinates.longitude >=
                    newRegion.longitude - newRegion.longitudeDelta / 2
            );
        });
        setNearbyRestaurants(nearbyRestaurants);
    };

    const fetchRestaurants = async () => {
        try {
            const fetchedRestaurants = await getRestaurants();
            setRestaurants(fetchedRestaurants);
            const fetchedRestaurantCoordinates =
                await getCoordinatesFromRestaurants(fetchedRestaurants);
            setRestaurantCoordinates(fetchedRestaurantCoordinates);
            fetchNearbyRestaurants(fetchedRestaurantCoordinates);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
                Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const deg2rad = deg => {
        return deg * (Math.PI / 180);
    };

    const fetchNearbyRestaurants = fetchedRestaurantCoordinates => {
        const nearbyRestaurants = fetchedRestaurantCoordinates.filter(
            restaurant => {
                const distance = getDistanceFromLatLonInKm(
                    position.coords.latitude,
                    position.coords.longitude,
                    restaurant.coordinates.latitude,
                    restaurant.coordinates.longitude,
                );
                return distance < 5;
            },
        );
        //console.log('nearbyRestaurants: ', nearbyRestaurants);
        setNearbyRestaurants(nearbyRestaurants);
    };

    useEffect(() => {
        if (position) {
            fetchRestaurants();
        }
    }, [position]);

    useEffect(() => {
        requestPermission();
    }, []);

    const requestPermission = () => {
        getCurrentPosition()
            .then(response => {
                if (response.status === 'granted') {
                    setPosition(response.position);
                    setRegion({
                        latitude: response.position.coords.latitude,
                        longitude: response.position.coords.longitude,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.02,
                    });
                    setPermissionStatus(null);
                } else if (response.status === 'denied') {
                    setPermissionStatus('denied');
                }
            })
            .catch(error => {
                console.log(error.message);
            });
    };

    return (
        <ScrollView>
            <View className="w-[100%] px-2 pb-4">
                <View className="h-[450px] items-center">
                    <View className="flex w-full items-center h-[300px] bg-[#F2BF91]/50 rounded-b-2xl">
                        <Text className="text-3xl text-center text-black font-bold py-6">
                            Discover Nearby Dining Options
                        </Text>
                        {permissionStatus === 'denied' && (
                            <>
                                <Pressable
                                    className="mt-3 p-2 rounded bg-[#171E26]"
                                    onPress={requestPermission}>
                                    <Text className="text-white text-[15px] text-center">
                                        Grant Location Permission
                                    </Text>
                                </Pressable>
                                <View className="mt-3 flex flex-row w-1/2 items-center">
                                    <View className="w-1/3 bg-[#171E26] h-1"></View>
                                    <Text className="text-[#171E26] text-center w-1/3 font-bold text-center">
                                        OR
                                    </Text>

                                    <View className="w-1/3 bg-[#171E26] h-1"></View>
                                </View>
                                <Pressable className="mt-3 p-2 rounded bg-[#171E26]">
                                    <Text className="text-white text-[15px] text-center">
                                        Use my address
                                    </Text>
                                </Pressable>
                            </>
                        )}
                        {!position && permissionStatus != 'denied' && (
                            <View className="flex flex-col items-center justify-center pt-4">
                                <ActivityIndicator
                                    size="large"
                                    color="#0000ff"
                                />
                                <Text className="text-xl text-center text-black font-bold py-6">
                                    Loading...
                                </Text>
                            </View>
                        )}
                    </View>
                    {position && (
                        <MapView
                            style={{
                                width: '90%',
                                height: 300,
                                marginTop: '-45%',
                            }}
                            initialRegion={{
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                latitudeDelta: 0.04,
                                longitudeDelta: 0.02,
                            }}
                            onRegionChangeComplete={handleRegionChange}
                            zoomEnabled={true}
                            scrollEnabled={true}
                            rotateEnabled={true}
                            pitchEnabled={true}>
                            <Marker
                                coordinate={{
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                }}
                                title="My Location"
                                description="This is my current location">
                                <View>
                                    <Image
                                        source={require('../../assets/images/29.png')}
                                        style={{width: 40, height: 40}}
                                        resizeMode="contain"
                                    />
                                </View>
                            </Marker>
                            {nearbyRestaurants.map((restaurant, index) => (
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude:
                                            restaurant.coordinates.latitude,
                                        longitude:
                                            restaurant.coordinates.longitude,
                                    }}
                                    title={restaurant.restaurant.name}
                                    description={truncateDescription(
                                        restaurant.addressString,
                                        5,
                                    )}>
                                    <View>
                                        <Image
                                            source={require('../../assets/images/30.png')}
                                            style={{width: 40, height: 40}}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    )}
                </View>
                <View className="flex space-y-2">
                    {nearbyRestaurants.length > 0 ? (
                        <Text className="text-3xl text-center text-black font-bold">
                            Nearby Restaurants:{' '}
                        </Text>
                    ) : (
                        <Text className="text-xl text-center text-black font-bold">
                            No Nearby Restaurants...
                        </Text>
                    )}
                    {nearbyRestaurants.map((restaurant, index) => (
                        <Pressable
                            onPress={() =>
                                navigation.navigate('Restaurant', {
                                    restaurantId: restaurant.restaurant.id,
                                })
                            }
                            key={index}
                            className={
                                'flex flex-row w-full h-fit rounded-3xl mt-2 p-4 bg-gray-400/30 items-center'
                            }>
                            <View
                                className={
                                    'w-1/3 sm:w-1/4 h-44 items-center flex justify-center'
                                }>
                                <Image
                                    source={{
                                        uri: restaurant.restaurant.imageUrl,
                                    }}
                                    className={
                                        'h-full w-full self-center rounded-xl'
                                    }
                                    resizeMode="cover"
                                />
                            </View>
                            <View
                                className={
                                    'flex-col w-2/3 sm:w-3/4 justify-between p-4 leading-normal'
                                }>
                                <Text
                                    className={
                                        'mb-2 text-2xl font-bold tracking-tight text-gray-900'
                                    }>
                                    {restaurant.restaurant.name}
                                </Text>
                                <Text className={'mb-3 font-normal'}>
                                    {truncateDescription(
                                        restaurant.restaurant.description,
                                        20,
                                    )}
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

export default MapScreen;
