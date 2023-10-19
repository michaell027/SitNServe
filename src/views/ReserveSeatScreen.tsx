import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { firebase } from '@react-native-firebase/database';

function ReserveSeatScreen({ navigation, route }) {
    const [seats, setSeats] = useState([]);
    const { restaurantId } = route.params;

    const reference = firebase
        .app()
        .database('https://sitnserve-fbaed-default-rtdb.europe-west1.firebasedatabase.app/')
        .ref(`/restaurant_id/${restaurantId}/seats`);

    useEffect(() => {
        const unsubscribe = reference.on('value', snapshot => {
            if (snapshot?.exists()) {
                const seatsData = snapshot.val();
                if (seatsData) {
                    const seatsArray = Object.keys(seatsData).map(key => ({
                        ...seatsData[key],
                        id: key
                    }));
                    setSeats(seatsArray);
                }
            } else {
                console.log('Firebase snapshot is not valid or cannot read from database.');
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);


const renderItem = ({ item, index }) => (
    <View className={'flex flex-row items-center justify-between p-2.5 border-2 border-gray-500 mb-4'}>
        <Text className={'text-lg'}>ID: {item.id} Seat: {item.seat}</Text>
        <Button
            title={item.occupied ? "Reserved" : "Select"}
            onPress={() => {
                if (!item.occupied) {
                    reference.child(item.id.toString()).update({ occupied: true });
                }
            }
        }
            disabled={item.occupied}
        />
    </View>
);


    return (
        <View className={'flex-1 p-2'}>
            <FlatList
                data={seats}
                renderItem={renderItem}
                keyExtractor={(item) => item.seat.toString()}
            />
        </View>
    );
}

export default ReserveSeatScreen;
