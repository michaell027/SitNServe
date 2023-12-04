import React, { createContext, useContext, useState, ReactNode } from 'react';
import {Restaurant} from "../models/Restaurant";

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
        throw new Error('useRestaurantContext must be used within a RestaurantProvider');
    }
    return context;
};

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
    const [multipleSelect, setMultipleSelect] = useState<boolean>(false);
    const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([]);
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>(
    [
        {
            id: 1,
            name: "Restaurant 1",
            description: "uuu",
            address: {
                street: "Kosicka",
                number: "23",
                city: "Kosice",
                state: "Slovensko",
                zip: "04001"
            },
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/sitnserve-fbaed.appspot.com/o/restaurants%2Frestaurant_1.jpg?alt=media&token=62c1668f-4a43-43f9-ac1e-e97cfe7eb3a3",
            openingHours: {}
        },
        {
            id: 2,
            name: "Restaurant 2",
            description: "oooooooo",
            address: {
                street: "Bratislavska",
                number: "8",
                city: "Kosicovo",
                state: "Slovensko",
                zip: "04001"
            },
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/sitnserve-fbaed.appspot.com/o/restaurants%2Frestaurant_2.jpg?alt=media&token=6a015900-2e3e-4de4-8fb5-c1eb350a5530",
            openingHours: {}
        },
        {
            id: 3,
            name: "Restaurant 3",
            description: "iaiaia",
            address: {
                street: "Osemsmerova",
                number: "128906",
                city: "Presovovo",
                state: "Slovensko",
                zip: "123456"
            },
            imageUrl: "https://firebasestorage.googleapis.com/v0/b/sitnserve-fbaed.appspot.com/o/restaurants%2Frestaurant_3.jpg?alt=media&token=a2c9af9e-2c40-4d07-902b-53fb274b55f0",
            openingHours: {}
        }
    ]
    );

    const toggleRestaurant = (restaurant: Restaurant) => {
        if (selectedRestaurants.length === 0) {
            setMultipleSelect(true);
        }

        if (isSelected(restaurant)) {
            const filtered = selectedRestaurants.filter((rest) => rest.id !== restaurant.id);
            setSelectedRestaurants(filtered);
        } else {
            setSelectedRestaurants([...selectedRestaurants, restaurant]);
        }
    };

    const isSelected = (restaurant: Restaurant): boolean => {
        return selectedRestaurants.some((rest) => rest.id === restaurant.id);
    };

    const resetData = () => {
        setMultipleSelect(false);
        setSelectedRestaurants([]);
    }

    const deleteSelectedRestaurants = () => {
        const updatedFavorites = favoriteRestaurants.filter(
            restaurant => !selectedRestaurants.some(selected => selected.id === restaurant.id)
        );
        setFavoriteRestaurants(updatedFavorites);
        setSelectedRestaurants([]);
        setMultipleSelect(false);
    };

    const deleteOneRestaurant = (restaurant: Restaurant) => {
        const updatedFavorites = favoriteRestaurants.filter(
            rest => rest.id !== restaurant.id
        );
        setFavoriteRestaurants(updatedFavorites);
    }

    return (
        <RestaurantContext.Provider value={{ favoriteRestaurants, deleteOneRestaurant, multipleSelect, resetData, setMultipleSelect, selectedRestaurants, setSelectedRestaurants, deleteSelectedRestaurants, toggleRestaurant, isSelected }}>
            {children}
        </RestaurantContext.Provider>
    );
};
