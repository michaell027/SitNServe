import React, {useEffect, useState} from 'react';
import {
    View,
    ScrollView,
    ActivityIndicator,
    TextInput,
    StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import RestaurantCard from '../components/RestaurantCard';
import {Restaurant} from '../models/Restaurant';

interface RestaurantsScreenProps {
    navigation: any;
}

const RestaurantsScreen = ({navigation}: RestaurantsScreenProps) => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await firestore()
                    .collection('restaurants')
                    .get();
                const data = response.docs.map(doc => {
                    const docData = doc.data();
                    return {
                        id: doc.id,
                        name: docData.name,
                        description: docData.description,
                        address: docData.address,
                        imageUrl: docData.imageUrl,
                        openingHours: docData.openingHours,
                        menu: docData.menu,
                    };
                });
                setRestaurants(data);
            } catch (error) {
                console.error('Error fetching documents: ', error);
            }
            setLoading(false);
        };

        fetchData().then();
    }, []);

    const filteredRestaurants: Restaurant[] = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (loading) {
        return (
            <ActivityIndicator
                size="large"
                color="#0000ff"
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            />
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <View style={[styles.searchBar, styles.searchBarContainer]}>
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search..."
                        style={styles.searchInput}
                    />
                </View>
                {filteredRestaurants.map(restaurant => (
                    <RestaurantCard
                        restaurant={restaurant}
                        navigation={navigation}
                        key={restaurant.id}
                    />
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 2,
        marginHorizontal: 15,
        marginVertical: 20,
        borderRadius: 20,
        paddingLeft: 10,
    },
    searchIcon: {
        marginLeft: 5,
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingLeft: 5,
    },
    searchBarContainer: {
        marginBottom: 10,
    },
    scrollView: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

export default RestaurantsScreen;
