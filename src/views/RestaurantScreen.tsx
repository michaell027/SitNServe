import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Pressable,
    ImageBackground,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faQrcode,
    faChair,
    faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';

interface RestaurantScreenProps {
    navigation: any;
    route: any;
}

function RestaurantScreen({navigation, route}: RestaurantScreenProps) {
    const {restaurantId} = route.params;
    const [imageUrl, setImageUrl] = useState<string>('');
    const [restaurantName, setRestaurantName] = useState<string>('');

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const doc = await firestore()
                    .collection('restaurants')
                    .doc(restaurantId)
                    .get();

                const docData = doc.data();
                if (doc.exists && docData) {
                    if (docData.imageUrl) {
                        setImageUrl(docData.imageUrl);
                    }
                    if (docData.name) {
                        setRestaurantName(docData.name);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRestaurantData().then();
    }, [restaurantId]);

    const handleScanQR = () => {
        navigation.navigate('ScanScreen', {restaurantId});
    };

    const handleReserveSeat = () => {
        navigation.navigate('ReserveSeatScreen', {restaurantId});
    };

    const handleViewInfo = () => {
        navigation.navigate('RestaurantInfoScreen', {restaurantId});
    };

    return imageUrl ? (
        <ImageBackground
            source={{uri: imageUrl}}
            style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>{restaurantName}</Text>
                    <Pressable onPress={handleScanQR} style={styles.pressable}>
                        <FontAwesomeIcon
                            icon={faQrcode}
                            color="#ffffff"
                            size={20}
                        />
                        <Text style={styles.pressableText}>Scan QR Code</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleReserveSeat}
                        style={styles.pressable}>
                        <FontAwesomeIcon
                            icon={faChair}
                            color="#ffffff"
                            size={20}
                        />
                        <Text style={styles.pressableText}>Reserve a seat</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleViewInfo}
                        style={styles.pressable}>
                        <FontAwesomeIcon
                            icon={faCircleInfo}
                            color="#ffffff"
                            size={20}
                        />
                        <Text style={styles.pressableText}>View Info</Text>
                    </Pressable>
                </View>
            </View>
        </ImageBackground>
    ) : (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
}

export default RestaurantScreen;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,.5)',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,.3)',
        paddingHorizontal: 100,
        paddingVertical: 50,
        borderRadius: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 40,
        textShadowColor: 'black',
        textShadowRadius: 4,
        textShadowOffset: {width: 2, height: 2},
    },
    pressable: {
        backgroundColor: '#1f2937',
        paddingVertical: 18,
        paddingHorizontal: 25,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        gap: 15,
    },
    pressableText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
});
