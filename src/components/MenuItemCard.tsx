import React, {useContext, useEffect, useLayoutEffect} from 'react';
import {View, Image, Text, Pressable, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faCartPlus,
    faCartShopping,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import {MenuItem} from '../views/MenuListScreen';
import {SelectedItemsContext} from '../providers/SelectedItemsContext';

interface MenuItemCardProps {
    item: MenuItem;
    onIncrement: () => void;
    onDecrement: () => void;
    quantity: number;
    totalPrice: number;
    selectedItems: MenuItem[];
    setSelectedItems: (items: MenuItem[]) => void;
    count: number;
    setCount: (count: number) => void;
    menuItems: MenuItem[];
    setMenuItems: (items: MenuItem[]) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
    item,
    onIncrement,
    onDecrement,
    quantity,
    totalPrice,
    selectedItems,
    setSelectedItems,
    count,
    setCount,
    menuItems,
    setMenuItems,
}) => {
    const isItemInCart = selectedItems.some(i => i.id === item.id);
    const {selectedItems: selectedItemsContext, updateSelectedItems} =
        useContext(SelectedItemsContext);

    const addToCart = () => {
        const newSelectedItems = [...selectedItems];
        const index = newSelectedItems.findIndex(i => i.id === item.id);

        if (index === -1) {
            newSelectedItems.push({...item, quantity: 1});
        } else {
            const currentItem = newSelectedItems[index];
            if (currentItem && typeof currentItem.quantity === 'number') {
                newSelectedItems[index] = {
                    ...currentItem,
                    quantity: currentItem.quantity + 1,
                };
            }
        }

        setSelectedItems(newSelectedItems);
        updateSelectedItems(newSelectedItems);
    };

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{uri: item.image_url}}
                    style={styles.image}
                    resizeMode="contain"
                />
                {/*<Image*/}
                {/*    source={require('./../../assets/images/menu/coca_cola.png')}*/}
                {/*    style={styles.image}*/}
                {/*    resizeMode="contain"*/}
                {/*/>*/}
            </View>
            <View style={styles.infoHolder}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price} €</Text>
            </View>
            <View style={styles.priceContainer}>
                <View style={styles.topContainer}>
                    <Text style={styles.price}>{totalPrice.toFixed(2)}€</Text>
                    <Pressable onPress={addToCart} hitSlop={20}>
                        <FontAwesomeIcon
                            icon={faCartPlus}
                            size={30}
                            color={'black'}
                        />
                    </Pressable>
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.quantityContainer}>
                        <Pressable
                            style={styles.quantityButton}
                            onPress={onDecrement}>
                            <Text style={styles.quantityText}>-</Text>
                        </Pressable>
                        <Text style={styles.quantity}>{quantity}</Text>
                        <Pressable
                            style={styles.quantityButton}
                            onPress={onIncrement}>
                            <Text style={styles.quantityText}>+</Text>
                        </Pressable>
                    </View>
                </View>
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
        width: 80,
    },
    itemName: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 15,
    },
    infoHolder: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '40%',
        paddingLeft: 8,
    },
    priceContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: '40%',
    },
    price: {
        paddingRight: 20,
        fontSize: 18,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityButton: {
        padding: 5,
    },
    quantityText: {
        fontSize: 18,
        color: '#333',
    },
    quantity: {
        fontSize: 16,
        paddingHorizontal: 8,
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export default MenuItemCard;
