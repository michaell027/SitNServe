import React, {useRef, useState} from 'react';
import {Image, Text, View, StyleSheet, Pressable, Animated} from 'react-native';
import { faInfo, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {Order} from "../models/Order";

const MyOrderCard = ({ order }: { order: Order }) => {
    const [showOrderInfo, setShowOrderInfo] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const orderInfoList = order.items.map((order, index) => {
        return (
            <View key={index} style={styles.itemAndPriceHolder}>
                <Text style={styles.item}>
                    {`${order.name} x${order.quantity}`}
                </Text>
                <Text style={styles.price}>
                    {`$${order.price.toFixed(2)}`}
                </Text>
            </View>
        );
    });

    const toggleOrderInfo = () => {
        if (showOrderInfo) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
        setShowOrderInfo(!showOrderInfo);
    };


    function formatDate(firebaseDateString: any) {
        const seconds = firebaseDateString.seconds;
        const milliseconds = firebaseDateString.nanoseconds / 1000000;

        const date = new Date(0);
        date.setUTCSeconds(seconds);
        date.setUTCMilliseconds(milliseconds);

        const day = date.getUTCDate();
        const month = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();
        const hour = date.getUTCHours();
        const minute = date.getUTCMinutes();

        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        const formattedMinute = minute < 10 ? `0${minute}` : minute;

        return `${formattedDay}-${formattedMonth}-${year} ${formattedHour}:${formattedMinute}`;
    }



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
                        <Text style={styles.nameText}>{order.restaurantName}</Text>
                        <Text style={styles.descriptionText}>
                            {formatDate(order.date)}
                        </Text>

                        <Text style={styles.priceText}>{`$${order.total.toFixed(2)}`}</Text>
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
