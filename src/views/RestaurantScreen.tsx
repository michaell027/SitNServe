import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ImageBackground, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faQrcode, faChair, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { styled, StyledComponent } from 'nativewind';
import { Dimensions } from 'react-native';

const StyledView = styled(View)
const StyledText = styled(Text)

const getOrientation = () => {
    const { width, height } = Dimensions.get('window');
    return width > height ? 'LANDSCAPE' : 'PORTRAIT';
};

function RestaurantScreen({ navigation, route }) {
    const { restaurantId } = route.params;
    const [imageUrl, setImageUrl] = useState(null);
    const [orientation, setOrientation] = useState(getOrientation());

    useEffect(() => {
        const handleOrientationChange = () => {
            setOrientation(getOrientation());
            console.log(`Current orientation: ${getOrientation()}`);
        };

        Dimensions.addEventListener('change', handleOrientationChange);

        console.log(`Current orientation: ${getOrientation()}`);

        return () => {
            if (Dimensions.removeEventListener) {
                Dimensions.removeEventListener('change', handleOrientationChange);
            }
        };
    }, []);

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const doc = await firestore().collection('restaurants').doc(restaurantId).get();
                if (doc.exists && doc.data().imageUrl) {
                    setImageUrl(doc.data().imageUrl);
                }
            } catch (error) {
                console.error('Error fetching image URL:', error);
            }
        };

        fetchImageUrl();
    }, [restaurantId]);

    const handleScanQR = () => {
        navigation.navigate('ReserveSeatScreen')
        console.log(`Scanning QR for restaurant with ID: ${restaurantId}`);
    };

    const handleReserveSeat = () => {
        console.log(`Reserving a seat for restaurant with ID: ${restaurantId}`);
    };

    const handleViewInfo = () => {
        console.log(`Viewing info for restaurant with ID: ${restaurantId}`);
    };

return (
        imageUrl ? (
            <StyledComponent component={ImageBackground} source={{ uri: imageUrl }} className={(' flex h-[90vh] justify-center items-center ')}>
                <StyledView className={orientation === 'LANDSCAPE' ?
                                'flex flex-row items-center bg-gray-300/80 w-fit py-6 px-10 rounded-xl space-x-2' :
                                'flex flex-col items-center bg-gray-300/80 w-fit py-6 px-10 rounded-xl space-y-6'}>
                    <StyledComponent component={Pressable} onPress={handleScanQR} className={(' bg-gray-800 py-3 px-6 rounded-xl flex flex-row items-center space-x-3 ')}>
                        <FontAwesomeIcon icon={faQrcode} color= "#ffffff" size={20} />
                        <StyledText className={(' text-xl text-white font-bold ')}>Scan QR Code</StyledText>
                    </StyledComponent>

                    <StyledComponent component={Pressable} onPress={handleReserveSeat} className={(' bg-gray-800 py-3 px-6 rounded-xl flex flex-row items-center space-x-3 ')}>
                        <FontAwesomeIcon icon={faChair} color= "#ffffff" size={20} />
                        <StyledText className={(' text-xl text-white font-bold ')}>Reserve a seat</StyledText>
                    </StyledComponent>

                    <StyledComponent component={Pressable} onPress={handleViewInfo} className={(' bg-gray-800 py-3 px-6 rounded-xl flex flex-row items-center space-x-3 ')}>
                        <FontAwesomeIcon icon={faCircleInfo} color= "#ffffff" size={20} />
                        <StyledText className={(' text-xl text-white font-bold ')}>View Info</StyledText>
                    </StyledComponent>
                </StyledView>
            </StyledComponent>
        ) : (
            <StyledView style={('flex-1 justify-center items-center')}>
                <StyledText>Loading...</StyledText>
            </StyledView>
        )
    );
}

export default RestaurantScreen;
