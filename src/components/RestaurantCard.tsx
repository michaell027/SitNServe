import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Restaurant} from '../models/Restaurant';

interface RestaurantCardProps {
    restaurant: Restaurant;
    navigation: any;
}

const RestaurantCard = ({restaurant, navigation}: RestaurantCardProps) => {
    function truncateDescription(description: string, wordLimit: number) {
        const words = description.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return description;
    }
    return (
        <Pressable
            key={restaurant.id}
            onPress={() =>
                navigation.navigate('Restaurant', {restaurantId: restaurant.id})
            }
            style={styles.restaurantCard}>
            <View style={styles.imageHolder}>
                <Image
                    source={{uri: restaurant.imageUrl}}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.infoHolder}>
                <Text style={styles.title}>{restaurant.name}</Text>
                <Text style={styles.description}>
                    {truncateDescription(restaurant.description, 20)}
                </Text>
            </View>
        </Pressable>
    );
};

export default RestaurantCard;

const styles = StyleSheet.create({
    restaurantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f2f2f2',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageHolder: {
        width: 175,
        height: 175,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '90%',
        height: '90%',
        borderRadius: 20,
    },
    infoHolder: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    description: {
        fontSize: 17,
    },
});
