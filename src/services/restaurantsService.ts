import firestore from '@react-native-firebase/firestore';
import {Restaurant} from '../models/Restaurant';
import {RestaurantCoordinates} from '../views/MapScreen';

interface Coordinates {
    latitude: number;
    longitude: number;
}

export const getRestaurants = async (): Promise<Restaurant[]> => {
    try {
        const response = await firestore().collection('restaurants').get();
        const data = response.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Restaurant),
        }));
        return data;
    } catch (error) {
        console.error('Error fetching restaurants: ', error);
        throw error;
    }
};

export const getCoordinatesFromRestaurants = async (
    restaurants: Restaurant[],
): Promise<RestaurantCoordinates[]> => {
    const promises = restaurants.map(async restaurant => {
        const {address} = restaurant;
        const {street, number, city, country, ZIPcode} = address;
        const fullAddress = `${street}, ${number}, ${city}, ${country}, ${ZIPcode}`;

        try {
            const location = await getCoordinatesFromAddress(fullAddress);
            console.log('location', location);
            return {
                restaurant: restaurant,
                coordinates: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
                addressString: fullAddress,
            };
        } catch (error) {
            console.error('Error getting coordinates:', error);
            return null;
        }
    });

    const restaurantsWithCoordinates = await Promise.all(promises);
    return restaurantsWithCoordinates.filter(
        item => item !== null,
    ) as RestaurantCoordinates[];
};

const fetch = require('node-fetch');

const getCoordinatesFromAddress = async (address: string) => {
    const apiKey = 'AIzaSyCPe1QYMUIJW_Tq8lkDLTZY1LQ-M9wi6S0';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address,
    )}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        console.log('response', response);
        const data = await response.json();
        console.log('data', data);

        if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            console.log('location', location);
            return {
                latitude: location.lat,
                longitude: location.lng,
            };
        } else {
            throw new Error('No results found');
        }
    } catch (error) {
        console.error('Error during geocoding:', error);
        throw error;
    }
};
