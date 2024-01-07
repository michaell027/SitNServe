import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    Pressable,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faCircleInfo,
    faClock,
    faMapLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import {faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons';
import {faHeart as faHeartSolid} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OpeningHours, Restaurant} from '../models/Restaurant';
import {User} from '../models/User';

const width = Dimensions.get('window').width;

interface RestaurantInfoScreenProps {
    navigation: any;
    route: any;
}

interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

const RestaurantInfoScreen = ({
    navigation,
    route,
}: RestaurantInfoScreenProps) => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [content, setContent] = useState<String>('info');
    const [region, setRegion] = useState<Region>({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    });
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const doc = await firestore()
                    .collection('restaurants')
                    .doc(route.params.restaurantId)
                    .get();
                if (doc.exists) {
                    const restaurantData = doc.data() as Restaurant;
                    const restaurantWithId = {
                        ...restaurantData,
                        id: doc.id,
                    };
                    setRestaurant(restaurantWithId);
                    const address = restaurantData.address;
                    const AddressString = `${address.street} ${address.number}, ${address.city}, ${address.postalCode}, ${address.country}`;
                    console.log(AddressString);
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

        fetchRestaurantData().then(async () => {
            const uid = await AsyncStorage.getItem('user_uid');
            if (uid) {
                firestore()
                    .collection('users')
                    .doc(uid)
                    .get()
                    .then(docSnapshot => {
                        if (docSnapshot.exists) {
                            const userData = docSnapshot.data() as User;
                            const favoriteRestaurants =
                                userData.favoriteRestaurants;
                            if (!favoriteRestaurants) return;
                            const isFavorite = favoriteRestaurants.includes(
                                route.params.restaurantId,
                            );
                            setIsFavorite(isFavorite);
                        } else {
                            console.log('User does not exist');
                            navigation.navigate('LoginScreen');
                        }
                    })
                    .catch(error => {
                        console.log('Error getting user data:', error);
                    });
            } else {
                navigation.navigate('LoginScreen');
            }
        });
    }, [route.params.restaurantId]);

    const renderOpeningHours = () => {
        if (!restaurant)
            return (
                <View style={styles.openingHoursContainer}>
                    <ActivityIndicator size="large" color="black" />
                </View>
            );

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

        return daysOfWeek.map(day => {
            const dayKey = day as keyof OpeningHours;
            return (
                <View key={day} style={styles.row}>
                    <Text style={styles.openingHoursText}>{day}</Text>
                    <Text style={styles.openingHoursText}>
                        {openingHours[dayKey] || 'Closed'}
                    </Text>
                </View>
            );
        });
    };

    const renderTabIcon = (selectedContent: string, icon: any) => (
        <Pressable
            style={[
                styles.tabIcon,
                content === selectedContent ? styles.tabIconActive : null,
            ]}
            onPress={() => setContent(selectedContent)}>
            <FontAwesomeIcon icon={icon} size={25} />
        </Pressable>
    );

    async function handleClickAddToFavorite() {
        const uid = await AsyncStorage.getItem('user_uid');
        if (!uid) {
            console.log('User UID is undefined');
            return; // Exit the function if uid is not found
        }

        if (!restaurant?.id) {
            console.log('Restaurant ID is undefined');
            return;
        }

        try {
            if (isFavorite) {
                await firestore()
                    .collection('users')
                    .doc(uid)
                    .update({
                        favoriteRestaurants: firestore.FieldValue.arrayRemove(
                            restaurant.id,
                        ),
                    });
                setIsFavorite(false);
            } else {
                await firestore()
                    .collection('users')
                    .doc(uid)
                    .update({
                        favoriteRestaurants: firestore.FieldValue.arrayUnion(
                            restaurant.id,
                        ),
                    });
                setIsFavorite(true);
            }
        } catch (error) {
            console.log('Error updating favorite restaurants:', error);
        }
    }

    return (
        <View style={styles.screen}>
            {restaurant && (
                <>
                    <ScrollView style={styles.scrollViewContainer}>
                        <View style={styles.container}>
                            <View style={styles.imageHolder}>
                                {restaurant.imageUrl && (
                                    <ImageBackground
                                        source={{uri: restaurant.imageUrl}}
                                        style={{
                                            overflow: 'hidden',
                                            flex: 1,
                                            borderRadius: 20,
                                            justifyContent: 'flex-end',
                                            alignItems: 'flex-start',
                                        }}>
                                        <View style={styles.titleHolder}>
                                            <Text style={styles.title}>
                                                {restaurant.name}
                                            </Text>
                                        </View>
                                    </ImageBackground>
                                )}
                            </View>

                            <View style={styles.tabsHolder}>
                                {renderTabIcon('info', faCircleInfo)}
                                {renderTabIcon('openingHours', faClock)}
                                {renderTabIcon('map', faMapLocationDot)}
                            </View>

                            {/* Restaurant Description */}
                            {content == 'info' && (
                                <View style={styles.infoContainer}>
                                    <View style={styles.infoHolder}>
                                        <Text style={styles.infoTitle}>
                                            About the restaurant...
                                        </Text>
                                        <Text style={styles.infoRating}>
                                            {restaurant.rating}
                                        </Text>
                                    </View>
                                    <Text style={styles.infoText}>
                                        {restaurant.description}
                                    </Text>
                                </View>
                            )}
                            {content == 'openingHours' && (
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoTitle}>
                                        Opening Hours
                                    </Text>
                                    {renderOpeningHours()}
                                </View>
                            )}
                            {content == 'map' && (
                                <View style={styles.infoContainer}>
                                    <Text style={styles.infoTitle}>
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
                                                description={
                                                    restaurant.description
                                                }
                                            />
                                        </MapView>
                                    ) : (
                                        <Text>Loading map...</Text>
                                    )}
                                    <View style={styles.addressHolder}>
                                        <Text style={styles.addressTitle}>
                                            Address
                                        </Text>
                                        <Text style={styles.addressText}>
                                            {restaurant.address.street}{' '}
                                            {restaurant.address.number}
                                        </Text>
                                        <Text style={styles.addressText}>
                                            {restaurant.address.ZIPcode}{' '}
                                            {restaurant.address.city}
                                        </Text>
                                        <Text style={styles.addressText}>
                                            {restaurant.address.country}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                    <View style={styles.bottomButtonContainer}>
                        <Pressable
                            style={styles.bottomButton}
                            onPress={handleClickAddToFavorite}>
                            <FontAwesomeIcon
                                icon={
                                    isFavorite ? faHeartSolid : faHeartRegular
                                }
                                size={25}
                                color={'white'}
                            />
                            <Text style={styles.buttonText}>
                                Add to Favorite
                            </Text>
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    );
};

export default RestaurantInfoScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    scrollViewContainer: {
        width: width,
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        padding: 10,
        marginBottom: 100,
    },
    imageHolder: {
        height: 400,
        flex: 1,
        marginBottom: 10,
    },
    titleHolder: {
        backgroundColor: 'rgba(255,255,255,0.4)',
        padding: 15,
        margin: 20,
        borderRadius: 10,
    },
    openingHoursContainer: {
        flex: 1,
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        marginBottom: 16,
    },
    openingHoursText: {
        fontSize: 17,
    },
    tabIcon: {
        width: 'auto',
        height: 'auto',
        padding: 12,
        borderRadius: 20,
    },
    tabIconActive: {
        borderBottomWidth: 2,
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'black',
        textShadowRadius: 10,
        textShadowOffset: {
            width: 2,
            height: 2,
        },
    },
    tabsHolder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        marginHorizontal: 20,
    },
    infoContainer: {
        padding: 20,
    },
    infoHolder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        width: '100%',
        borderBottomColor: '#ddd',
        borderBottomWidth: 2,
        paddingBottom: 10,
    },
    infoRating: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'green',
    },
    infoText: {
        fontSize: 18,
        lineHeight: 25,
    },
    bottomButtonContainer: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        padding: 15,
        backgroundColor: '#f2f2f2',
        shadowColor: 'black',
        shadowOffset: {
            width: 2,
            height: -5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    bottomButton: {
        backgroundColor: '#1FAFBF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    addressHolder: {
        marginTop: 20,
        borderColor: '#ddd',
        borderWidth: 2,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    addressTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addressText: {
        fontSize: 18,
        lineHeight: 25,
    },

});
