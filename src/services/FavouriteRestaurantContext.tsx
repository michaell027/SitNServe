import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react';
import {Restaurant} from '../models/Restaurant';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../models/User';

type RestaurantContextType = {
    favoriteRestaurants: Restaurant[];
    multipleSelect: boolean;
    deleteOneRestaurant: (restaurant: Restaurant) => void;
    resetData: () => void;
    setMultipleSelect: (value: boolean) => void;
    selectedRestaurants: Restaurant[];
    setSelectedRestaurants: (restaurants: Restaurant[]) => void;
    deleteSelectedRestaurants: () => void;
    toggleRestaurant: (restaurant: Restaurant) => void;
    isSelected: (restaurant: Restaurant) => boolean;
};

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export const useRestaurantContext = () => {
    const context = useContext(RestaurantContext);
    if (!context) {
        throw new Error(
            'useRestaurantContext must be used within a RestaurantProvider',
        );
    }
    return context;
};

export const RestaurantProvider = ({children}: {children: ReactNode}) => {
    const [multipleSelect, setMultipleSelect] = useState<boolean>(false);
    const [selectedRestaurants, setSelectedRestaurants] = useState<
        Restaurant[]
    >([]);
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<
        Restaurant[]
    >([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userString = await AsyncStorage.getItem('user_info');
                if (!userString) {
                    return;
                }
                const userInfo = JSON.parse(userString) as User;
                console.log('uinfo' + userInfo.favoriteRestaurants);

                if (userInfo && userInfo.favoriteRestaurants) {
                    const fetchPromises = userInfo.favoriteRestaurants.map(
                        async restaurantId => {
                            const restaurantRef = firestore()
                                .collection('restaurants')
                                .doc(restaurantId);
                            const document = await restaurantRef.get();
                            console.log(document.data());
                            return document.data() as Restaurant;
                        },
                    );

                    const restaurants = await Promise.all(fetchPromises);
                    setFavoriteRestaurants(restaurants);
                }
            } catch (error) {
                console.error('Error fetching favorite restaurants:', error);
            }
        };

        fetchData();
    }, []);

    const toggleRestaurant = (restaurant: Restaurant) => {
        if (selectedRestaurants.length === 0) {
            setMultipleSelect(true);
        }

        if (isSelected(restaurant)) {
            const filtered = selectedRestaurants.filter(
                rest => rest.id !== restaurant.id,
            );
            setSelectedRestaurants(filtered);
        } else {
            setSelectedRestaurants([...selectedRestaurants, restaurant]);
        }
    };

    const isSelected = (restaurant: Restaurant): boolean => {
        return selectedRestaurants.some(rest => rest.id === restaurant.id);
    };

    const resetData = () => {
        setMultipleSelect(false);
        setSelectedRestaurants([]);
    };

    const deleteSelectedRestaurants = () => {
        const updatedFavorites = favoriteRestaurants.filter(
            restaurant =>
                !selectedRestaurants.some(
                    selected => selected.id === restaurant.id,
                ),
        );
        setFavoriteRestaurants(updatedFavorites);
        setSelectedRestaurants([]);
        setMultipleSelect(false);
    };

    const deleteOneRestaurant = (restaurant: Restaurant) => {
        const updatedFavorites = favoriteRestaurants.filter(
            rest => rest.id !== restaurant.id,
        );
        setFavoriteRestaurants(updatedFavorites);
    };

    return (
        <RestaurantContext.Provider
            value={{
                favoriteRestaurants,
                deleteOneRestaurant,
                multipleSelect,
                resetData,
                setMultipleSelect,
                selectedRestaurants,
                setSelectedRestaurants,
                deleteSelectedRestaurants,
                toggleRestaurant,
                isSelected,
            }}>
            {children}
        </RestaurantContext.Provider>
    );
};
