import React, {useLayoutEffect} from 'react';
import {View, Image, Text, Pressable, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCartPlus} from '@fortawesome/free-solid-svg-icons';

const MenuItemCard = ({item}) => {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('./../../assets/images/menu/coca_cola.png')} // Use dynamic source based on item
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.itemName}>{item.name}</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.price}>{item.price}€</Text>
                <Pressable>
                    <FontAwesomeIcon icon={faCartPlus} size={30} />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        paddingVertical: 8,
        marginBottom: 4,
        backgroundColor: '#cccccc',
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
    },
    imageContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    image: {
        height: 80,
    },
    itemName: {
        width: '40%',
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '40%',
    },
    price: {
        paddingRight: 20,
        fontSize: 18,
    },
});

export default MenuItemCard;
