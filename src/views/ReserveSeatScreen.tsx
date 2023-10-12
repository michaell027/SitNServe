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
        if (snapshot?.exists()) { // Check if snapshot exists
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
    <View style={styles.seatContainer}>
        <Text style={styles.seatText}>ID: {item.id} Seat: {item.seat}</Text>
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
        <View style={styles.container}>
            <FlatList
                data={seats}
                renderItem={renderItem}
                keyExtractor={(item) => item.seat.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    seatContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10
    },
    seatText: {
        fontSize: 16
    }
});

export default ReserveSeatScreen;
