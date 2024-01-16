import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {RestaurantIdAndSeat} from '../models/RestaurantIdAndSeat';

const ScanQRScreen = ({navigation}: {navigation: any}) => {
    const [restaurantIdAndSeat, setRestaurantIdAndSeat] =
        useState<RestaurantIdAndSeat | null>(null);

    const onSuccess = useCallback((e: any) => {
        const data = JSON.parse(e.data);
        setRestaurantIdAndSeat(data);
        checkData(data);
    }, []);

    const checkData = useCallback(
        (restaurantIdAndSeat: RestaurantIdAndSeat) => {
            if (restaurantIdAndSeat) {
                navigation.navigate('MenuListScreen', {
                    restaurantIdAndSeat,
                });
            } else if (restaurantIdAndSeat) {
                Alert.alert(
                    'Wrong QR code',
                    'This QR code is not for this restaurant. Please scan the QR code on your table.',
                    [
                        {
                            text: 'OK',
                            onPress: () =>
                                console.log('Wrong QR code alert closed.'),
                        },
                    ],
                );
            }
        },
        [],
    );

    const handleScanIssue = useCallback(() => {
        Alert.alert(
            'Trouble Scanning?',
            'Ensure the QR code is clear and try adjusting your camera angle. If problems persist, please ask our staff for assistance.',
            [
                {
                    text: 'OK',
                    onPress: () =>
                        console.log('Trouble scanning guidance provided.'),
                },
            ],
        );
    }, []);

    return (
        <View style={{flex: 1}}>
            <View style={styles.topContentContainer}>
                <Text style={styles.centerText}>
                    Scan the QR code{' '}
                    <Text style={styles.textBold}>on your table</Text> to access
                    our restaurant's menu.
                </Text>
            </View>

            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <QRCodeScanner
                    onRead={onSuccess}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    showMarker={true}
                    fadeIn={true}
                    markerStyle={{
                        borderColor: '#fff',
                        borderRadius: 10,
                        borderWidth: 2,
                        borderStyle: 'dashed',
                    }}
                />
                <TouchableOpacity
                    style={styles.buttonTouchable}
                    onPress={handleScanIssue}
                    activeOpacity={0.7}>
                    <Text style={styles.buttonText}>
                        I have trouble with scanning
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ScanQRScreen;

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 10,
        color: 'black',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '400',
        textAlign: 'center',
    },
    buttonTouchable: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
        borderRadius: 25,
        justifyContent: 'center',
        backgroundColor: 'gray',
    },

    topContentContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
    },
});
