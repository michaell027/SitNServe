import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Pressable,
    Image,
    StyleSheet,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {getCurrentPosition} from '../services/locationService';
import {
    getRestaurants,
    getCoordinatesFromRestaurants,
} from '../services/restaurantsService';
import {Restaurant} from '../models/Restaurant';

interface MapScreenProps {
    navigation: any;
    route: any;
}

interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

export interface RestaurantCoordinates {
    restaurant: Restaurant;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    addressString: string;
}

interface Position {
    coords: {
        latitude: number;
        longitude: number;
    };
}

function MapScreen({navigation, route}: MapScreenProps) {
    const [position, setPosition] = useState<Position | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<string | null>(
        null,
    );
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [restaurantCoordinates, setRestaurantCoordinates] = useState<
        RestaurantCoordinates[]
    >([]);
    const [region, setRegion] = useState<Region>({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.04,
        longitudeDelta: 0.02,
    });
    const [nearbyRestaurants, setNearbyRestaurants] = useState<
        RestaurantCoordinates[]
    >([]);

    const handleRegionChange = (newRegion: Region) => {
        setRegion(newRegion);
        fetchRestaurantsInView(newRegion);
    };

    const truncateDescription = (description: string, length: number) => {
        const splitDescription = description.split(' ');
        if (splitDescription.length > length) {
            return splitDescription.slice(0, length).join(' ') + '...';
        } else {
            return description;
        }
    };

    const fetchRestaurantsInView = (newRegion: Region) => {
        const nearbyRestaurants: RestaurantCoordinates[] =
            restaurantCoordinates.filter(restaurant => {
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
            const fetchedRestaurantCoordinates: RestaurantCoordinates[] =
                await getCoordinatesFromRestaurants(fetchedRestaurants);
            console.log(
                'fetchedRestaurantCoordinates: ',
                fetchedRestaurantCoordinates,
            );
            setRestaurantCoordinates(fetchedRestaurantCoordinates);
            fetchNearbyRestaurants(fetchedRestaurantCoordinates);
            console.log(
                'fetchedRestaurantCoordinates: ',
                fetchedRestaurantCoordinates,
            );
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const getDistanceFromLatLonInKm = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
    ) => {
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

    const deg2rad = (deg: number) => {
        return deg * (Math.PI / 180);
    };

    const fetchNearbyRestaurants = (
        fetchedRestaurantCoordinates: RestaurantCoordinates[],
    ) => {
        if (!position || !position.coords) {
            return;
        }
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
        setNearbyRestaurants(nearbyRestaurants);
    };

    useEffect(() => {
        if (position) {
            fetchRestaurants().then();
        }
    }, [position]);

    useEffect(() => {
        requestPermission();
    }, []);

    const requestPermission = () => {
        getCurrentPosition()
            .then((response: any) => {
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
            <View style={styles.container}>
                <View style={styles.mapContainer}>
                    <View style={styles.mapHolder}>
                        <Text style={styles.mapText}>
                            Discover Nearby Dining Options
                        </Text>
                        {permissionStatus === 'denied' && (
                            <>
                                <Pressable
                                    style={{
                                        marginTop: 10,
                                        padding: 10,
                                        borderRadius: 10,
                                        backgroundColor: '#171E26',
                                    }}
                                    onPress={requestPermission}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: 15,
                                            textAlign: 'center',
                                        }}>
                                        Grant Location Permission
                                    </Text>
                                </Pressable>
                                <View
                                    style={{
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        width: '50%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <View
                                        style={{
                                            width: '33%',
                                            backgroundColor: '#171E26',
                                            height: 3,
                                        }}></View>
                                    <Text
                                        style={{
                                            color: '#171E26',
                                            fontSize: 15,
                                            textAlign: 'center',
                                            width: '33%',
                                            fontWeight: 'bold',
                                        }}>
                                        OR
                                    </Text>

                                    <View
                                        style={{
                                            width: '33%',
                                            backgroundColor: '#171E26',
                                            height: 3,
                                        }}></View>
                                </View>
                                <Pressable
                                    style={{
                                        marginTop: 10,
                                        padding: 10,
                                        borderRadius: 10,
                                        backgroundColor: '#171E26',
                                    }}>
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: 15,
                                            textAlign: 'center',
                                        }}>
                                        Use my address
                                    </Text>
                                </Pressable>
                            </>
                        )}
                        {!position && permissionStatus != 'denied' && (
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <ActivityIndicator
                                    size="large"
                                    color="#0000ff"
                                />
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        color: '#171E26',
                                    }}>
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
                <View
                    //className="flex space-y-2"
                    style={{
                        marginBottom: 20,
                    }}>
                    {nearbyRestaurants.length > 0 ? (
                        <Text
                            style={{
                                marginBottom: 10,
                                fontSize: 30,
                                fontWeight: '800',
                                textAlign: 'center',
                                color: '#171E26',
                            }}>
                            Nearby Restaurants:{' '}
                        </Text>
                    ) : (
                        <Text
                            style={{
                                marginBottom: 10,
                                fontSize: 30,
                                fontWeight: '800',
                                textAlign: 'center',
                                color: '#171E26',
                            }}>
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
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                marginTop: 10,
                                padding: 10,
                                borderRadius: 10,
                                backgroundColor: 'rgba(200, 200, 200, 0.5)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <View
                                style={{
                                    width: '30%',
                                    height: 100,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    source={{
                                        uri: restaurant.restaurant.imageUrl,
                                    }}
                                    // className={
                                    //     'h-full w-full self-center rounded-xl'
                                    // }
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 10,
                                    }}
                                    resizeMode="cover"
                                />
                            </View>
                            <View
                                // className={
                                //     'flex-col w-2/3 sm:w-3/4 justify-between p-4 leading-normal'
                                // }
                                style={{
                                    width: '70%',
                                    paddingLeft: 15,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        color: '#171E26',
                                        marginBottom: 5,
                                    }}>
                                    {restaurant.restaurant.name}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: '#171E26',
                                        marginBottom: 5,
                                    }}>
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

const styles = StyleSheet.create({
    container: {width: '100%', paddingHorizontal: 10},
    mapContainer: {width: '100%', alignItems: 'center', paddingBottom: 20},
    mapHolder: {
        width: '100%',
        height: 300,
        marginTop: -5,
        backgroundColor: 'rgba(242, 191, 145, 0.5)',
        borderRadius: 20,
        alignItems: 'center',
    },
    mapText: {
        fontSize: 30,
        fontWeight: '800',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
        color: '#171E26',
    },
});
