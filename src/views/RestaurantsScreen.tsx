import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { styled } from 'nativewind';
import firestore from '@react-native-firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


function RestaurantsScreen({ navigation }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await firestore().collection('restaurants').get();
                const data = response.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRestaurants(data);
            } catch (error) {
                console.error("Error fetching documents: ", error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderRestaurantCard = (restaurant) => (
        <Pressable
            key={restaurant.id}
            onPress={() => navigation.navigate('Restaurant', { restaurantId: restaurant.id })}
            className={"flex flex-row w-full h-fit rounded-3xl mt-2 p-4 bg-gray-400/30"}
        >
            <View className={'w-1/3 sm:w-1/4 h-60 items-center flex justify-center'}>
                <Image
                    source={{ uri: restaurant.imageUrl }}
                    className={'h-full w-full self-center rounded-xl'}
                    resizeMode="cover"
                />
            </View>
            <View className={"flex-col w-2/3 sm:w-3/4 justify-between p-4 leading-normal"}>
                <Text className={"mb-2 text-2xl font-bold tracking-tight text-gray-900"}>{restaurant.name}</Text>
                <Text className={"mb-3 font-normal"}>{restaurant.description}</Text>
            </View>
        </Pressable>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    return (
        <ScrollView>
            <View className={"flex flex-col w-full h-full px-2"}>
                <View className={"px-2 rounded-3xl space-x-2"} style={styles.searchBar}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search..."
                        style={styles.searchInput}
                    />
                </View>
                {filteredRestaurants.map(restaurant => renderRestaurantCard(restaurant))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 2,
        margin: 10,
    },
    searchIcon: {
        marginLeft: 5,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingLeft: 5,
    },
});

export default RestaurantsScreen;
