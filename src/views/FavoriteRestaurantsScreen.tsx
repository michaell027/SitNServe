import React, {useEffect, useLayoutEffect} from 'react';
import {View, SafeAreaView, ScrollView, Pressable} from 'react-native';
import {FavouriteRestaurantCard} from '../components/FavouriteRestaurantCard';
import {useNavigation} from '@react-navigation/native';
import {useRestaurantContext} from '../services/FavouriteRestaurantContext';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

const FavoriteRestaurantsScreen = () => {
    const {
        favoriteRestaurants,
        deleteOneRestaurant,
        multipleSelect,
        resetData,
        setMultipleSelect,
        isSelected,
        toggleRestaurant,
        deleteSelectedRestaurants,
    } = useRestaurantContext();
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                multipleSelect ? (
                    <View style={{flexDirection: 'row'}}>
                        <Pressable onPress={deleteSelectedRestaurants}>
                            <FontAwesomeIcon
                                icon={faTrash}
                                color={'red'}
                                size={25}
                            />
                        </Pressable>
                    </View>
                ) : null,
        });
    }, [navigation, multipleSelect, deleteSelectedRestaurants]);

    useEffect(() => {
        resetData();
    }, []);

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
                <View style={{padding: 15}}>
                    {favoriteRestaurants.map(rest => (
                        <FavouriteRestaurantCard
                            key={rest.id}
                            deleteOneRestaurant={deleteOneRestaurant}
                            restaurant={rest}
                            selected={isSelected(rest)}
                            multipleSelection={multipleSelect}
                            toggleRestaurant={toggleRestaurant}
                        />
                    ))}
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

export default FavoriteRestaurantsScreen;
