import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Restaurant} from '../models/Restaurant';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faLocationDot, faStar} from '@fortawesome/free-solid-svg-icons';
import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';

export function FavouriteRestaurantCard({
    restaurant,
    deleteOneRestaurant,
    multipleSelection,
    selected,
    toggleRestaurant,
}: {
    restaurant: Restaurant;
    deleteOneRestaurant: (restaurant: Restaurant) => void;
    multipleSelection: boolean;
    selected: boolean;
    toggleRestaurant: (restaurant: Restaurant) => void;
}) {
    const [structuredAddress, setStructuredAddress] = useState<string>('');

    useEffect(() => {
        setStructuredAddress(
            `${restaurant.address.street} ${restaurant.address.number}, ${restaurant.address.city}`,
        );
    }, [restaurant]);

    const truncateDescription = (description: string) => {
        const array = description.split(' ');
        if (array.length > 10) {
            return array.slice(0, 10).join(' ') + '...';
        } else {
            return description;
        }
    };

    return (
        <Pressable
            onLongPress={() => toggleRestaurant(restaurant)}
            style={styles.pressable}>
            <View style={styles.imageHolder}>
                <Image
                    style={styles.image}
                    source={{uri: restaurant.imageUrl}}
                />
            </View>
            <View style={styles.infoHolder}>
                <View style={{width: '88%'}}>
                    <Text style={styles.title} numberOfLines={1}>
                        {restaurant.name}
                    </Text>
                    <View style={styles.location}>
                        <FontAwesomeIcon
                            icon={faLocationDot}
                            color={'orange'}
                            size={18}
                        />
                        <Text style={{marginLeft: 5, fontSize: 16}}>
                            {structuredAddress}
                        </Text>
                    </View>
                    <View style={styles.dividerHolder}>
                        <View style={styles.dot}></View>
                        <View style={styles.divider}></View>
                        <View style={styles.dot}></View>
                    </View>
                    <Text style={{fontSize: 16}}>
                        {truncateDescription(restaurant.description)}
                    </Text>
                </View>
                <Pressable style={{alignItems: 'center', width: '12%'}}>
                    {multipleSelection ? (
                        <CheckBox
                            disabled={false}
                            value={selected}
                            onValueChange={() => toggleRestaurant(restaurant)}
                            tintColors={{true: 'orange', false: 'orange'}}
                        />
                    ) : (
                        <Pressable
                            onPress={() => deleteOneRestaurant(restaurant)}>
                            <FontAwesomeIcon
                                icon={faStar}
                                color={'orange'}
                                size={25}
                            />
                        </Pressable>
                    )}
                </Pressable>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        flexDirection: 'row',
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
        alignItems: 'center',
    },
    imageHolder: {
        width: 100,
        height: 100,
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
    infoHolder: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    dividerHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    dot: {
        height: 5,
        width: 5,
        borderRadius: 7,
        backgroundColor: 'orange',
    },
    divider: {
        height: 1.5,
        width: '100%',
        backgroundColor: 'orange',
        marginHorizontal: 5,
    },
});
