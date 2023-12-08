import React from 'react';
import {View, Text, ScrollView, Image, StyleSheet} from 'react-native';

const ReservationsScreen = () => {
    // Mock data for demonstration purposes
    const reservations = [
        {
            id: 1,
            restaurant: 'The Gourmet Spot',
            date: '2023-12-08',
            time: '7:00 PM - 10:00 PM',
            tableId: 'A12',
            imageUrl:
                'https://firebasestorage.googleapis.com/v0/b/sitnserve-fbaed.appspot.com/o/restaurants%2Frestaurant_1.jpg?alt=media&token=62c1668f-4a43-43f9-ac1e-e97cfe7eb3a3',
        },
        {
            id: 2,
            restaurant: 'The Gourmet Spot',
            date: '2023-12-08',
            time: '7:00 PM - 10:00 PM',
            tableId: 'A12',
            imageUrl:
                'https://firebasestorage.googleapis.com/v0/b/sitnserve-fbaed.appspot.com/o/restaurants%2Frestaurant_1.jpg?alt=media&token=62c1668f-4a43-43f9-ac1e-e97cfe7eb3a3',
        },
        {
            id: 3,
            restaurant: 'The Gourmet Spot',
            date: '2023-12-08',
            time: '7:00 PM - 10:00 PM',
            tableId: 'A12',
            imageUrl:
                'https://firebasestorage.googleapis.com/v0/b/sitnserve-fbaed.appspot.com/o/restaurants%2Frestaurant_1.jpg?alt=media&token=62c1668f-4a43-43f9-ac1e-e97cfe7eb3a3',
        },
        {
            id: 4,
            restaurant: 'The Gourmet Spot',
            date: '2023-12-08',
            time: '7:00 PM - 10:00 PM',
            tableId: 'A12',
            imageUrl:
                'https://firebasestorage.googleapis.com/v0/b/sitnserve-fbaed.appspot.com/o/restaurants%2Frestaurant_1.jpg?alt=media&token=62c1668f-4a43-43f9-ac1e-e97cfe7eb3a3',
        },
    ];

    return (
        <View style={styles.container}>
            <ScrollView>
                {reservations.map(reservation => (
                    <View key={reservation.id} style={styles.reservationCard}>
                        <Image
                            source={{uri: reservation.imageUrl}}
                            style={styles.image}
                        />
                        <View style={styles.details}>
                            <Text style={styles.restaurantName}>
                                {reservation.restaurant}
                            </Text>
                            <Text style={styles.reservationDetails}>
                                {reservation.date} | {reservation.time}
                            </Text>
                            <Text style={styles.tableId}>
                                Table ID: {reservation.tableId}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 10,
    },
    reservationCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 3,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 8,
    },
    details: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    reservationDetails: {
        fontSize: 16,
        color: '#555',
    },
    tableId: {
        fontSize: 16,
        color: '#555',
        marginTop: 5,
    },
});

export default ReservationsScreen;
