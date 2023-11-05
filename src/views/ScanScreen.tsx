// import React from 'react';
// import {
//   Button,
//   PermissionsAndroid,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
//
// const requestCameraPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.CAMERA,
//       {
//         title: 'Cool Photo App Camera Permission',
//         message:
//           'Cool Photo App needs access to your camera ' +
//           'so you can take awesome pictures.',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('You can use the camera');
//     } else {
//       console.log('Camera permission denied');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };
//
// const App = () => (
//   <View style={styles.container}>
//     <Text style={styles.item}>Try permissions</Text>
//     <Button title="request permissions" onPress={requestCameraPermission} />
//   </View>
// );
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingTop: StatusBar.currentHeight,
//     backgroundColor: '#ecf0f1',
//     padding: 8,
//   },
//   item: {
//     margin: 24,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });
//
// export default App;

'use strict';

import React, {useCallback, useState} from 'react';
import {
    View,
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

function ScanScreen({navigation, route}) {
    const {restaurantId} = route.params;
    const [restaurantIdAndSeat, setRestaurantIdAndSeat] = useState(null);

    const onSuccess = useCallback(e => {
        const data = JSON.parse(e.data);
        setRestaurantIdAndSeat(data);
        checkData(data);
    }, []);

    const checkData = useCallback(restaurantIdAndSeat => {
        if (restaurantIdAndSeat.restaurant_id === restaurantId) {
            console.log(restaurantIdAndSeat);
            navigation.navigate('MenuListScreen', {restaurantIdAndSeat});
        } else {
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
    }, []);

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
                    className="bg-gray-500">
                    <Text style={styles.buttonText}>
                        I have trouble with scanning
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

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
        alignSelf: 'center', // This will center the button horizontally
        marginTop: 10,
        marginBottom: 10,
        padding: 20,
        width: '80%', // You can adjust this to set the desired width
        alignItems: 'center',
        borderRadius: 25,
        justifyContent: 'center',
        backgroundColor: 'gray', // This is just to give the button a background color
    },

    topContentContainer: {
        flex: 0.3, // Assign a fraction based on how much space you want it to occupy
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF',
    },
});

export default ScanScreen;
