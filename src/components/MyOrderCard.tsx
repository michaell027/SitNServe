import React, {useRef, useState} from 'react';
import {Image, Text, View, StyleSheet, Pressable, Animated} from 'react-native';
import { faInfo, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

interface Order {
    id: string;
    name: string;
    description: string;
    price: number;
}

const MyOrderCard = ({ order }: { order: Order }) => {
    const [showOrderInfo, setShowOrderInfo] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const orderInfo = [
        {
            name: 'Restaurant 1',
            price: 10.99,
            amount: 2,
        },
        {
            name: 'Restaurant 2',
            price: 5.99,
            amount: 3,
        },
        {
            name: 'Restaurant 3',
            price: 2.99,
            amount: 1,
        },
    ];


    const orderInfoList = orderInfo.map((order, index) => {
        return (
            <View style={styles.itemAndPriceHolder}>
                <Text style={styles.item}>
                    {`${order.name} x${order.amount}`}
                </Text>
                <Text style={styles.price}>
                    {`$${order.price.toFixed(2)}`}
                </Text>
            </View>
        );
    });

    const toggleOrderInfo = () => {
        if (showOrderInfo) {
            // Fade out animation
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            // Fade in animation
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
        setShowOrderInfo(!showOrderInfo);
    };


    return (
<View style={styles.holder}>
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <View style={styles.receiptIcon}>
                    <FontAwesomeIcon icon={faReceipt} size={15} />
                </View>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.imageAndText}>
                    <Image
                        source={require('../../assets/images/breakfast2.png')}
                        style={styles.image}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.nameText}>{order.name}</Text>
                        <Text style={styles.descriptionText}>{order.description}</Text>
                        <Text style={styles.priceText}>{`$${order.price.toFixed(2)}`}</Text>
                    </View>
                </View>
                <Pressable style={styles.infoIcon} onPress={toggleOrderInfo}>
                    <FontAwesomeIcon icon={faInfo} />
                </Pressable>
            </View>
        </View>
    {showOrderInfo && (
        <Animated.View
            style={[
                styles.orderInfoHolder,
                { opacity: fadeAnim }
            ]}
        >
            {orderInfoList}
        </Animated.View>
    )}
</View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
    },
    iconContainer: {
        marginRight: 2,
    },
    receiptIcon: {
        paddingRight: 4,
        paddingTop: 4,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imageAndText: {
        flexDirection: 'row',
    },
    image: {
        borderRadius: 10,
        width: 75,
        height: 75,
    },
    textContainer: {
        marginLeft: 10,
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    descriptionText: {
        fontSize: 14,
    },
    priceText: {
        fontSize: 14,
    },
    infoIcon: {
        marginRight: 4,
        padding: 4,
        borderRadius: 50,
        borderWidth: 2,
    },
    holder: {
        padding: 10,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    orderInfoHolder: {
        padding: 10,
        margin: 10,
        backgroundColor: '#66b7b7',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    orderInfoText: {
        color: '#fff',
        fontSize: 18,
    },
    itemAndPriceHolder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        paddingBottom: 5,
    },
    item: {
        color: '#fff',
        fontSize: 15,
        paddingLeft: 10,
    },
    price: {
        color: '#fff',
        fontSize: 15,
        paddingRight: 10,
    },
});

export default MyOrderCard;
