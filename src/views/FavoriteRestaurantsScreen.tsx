import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, SafeAreaView, ScrollView, Button, Pressable} from 'react-native';
import {Restaurant} from "../models/Restaurant";
import {Address} from "../models/Address";
import {FavouriteRestaurantCard} from "../components/FavouriteRestaurantCard";
import {useNavigation} from "@react-navigation/native";
import {useRestaurantContext} from "../services/FavouriteRestaurantContext";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

const FavoriteRestaurantsScreen = () => {
    const { favoriteRestaurants, deleteOneRestaurant, multipleSelect, resetData, setMultipleSelect,isSelected, toggleRestaurant, deleteSelectedRestaurants } = useRestaurantContext();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                multipleSelect ? (
                    <View className={"flex flex-row space-x-2"}>
                        <Pressable onPress={deleteSelectedRestaurants}>
                            <FontAwesomeIcon icon={faTrash} color={"red"} size={25}/>
                        </Pressable>
                    </View>
                ) : null
            ),
        });
    }, [navigation, multipleSelect, deleteSelectedRestaurants]);

    useEffect(() => {
        resetData();
    }, [])

    //
    // const [multipleSelect, setMultipleSelect] = useState(false);
    // const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([]);
    //
    // const toggleRestaurant = (restaurant: Restaurant) => {
    //     if(selectedRestaurants.length == 0) {
    //         setMultipleSelect(true);
    //     }
    //
    //     if (isSelected(restaurant)) {
    //         const filtered = selectedRestaurants.filter((rest) => rest.id != restaurant.id);
    //         setSelectedRestaurants(filtered)
    //     } else {
    //         setSelectedRestaurants([...selectedRestaurants, restaurant]);
    //     }
    //
    // };
    //
    // const isSelected = (restaurant: Restaurant) => {
    //     return selectedRestaurants.map((rest) => rest.id).includes(restaurant.id);
    // }

    return (
        <ScrollView>
            <SafeAreaView>
                <View className={"m-2"}>
                    {
                        favoriteRestaurants.map((rest) => <FavouriteRestaurantCard key={rest.id} deleteOneRestaurant={deleteOneRestaurant} restaurant={rest} selected={isSelected(rest)} multipleSelection={multipleSelect} toggleRestaurant={toggleRestaurant}/>)
                    }
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default FavoriteRestaurantsScreen;