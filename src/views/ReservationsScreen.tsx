import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import {Reservation} from '../models/Reservation';
import firestore from '@react-native-firebase/firestore';

interface ReservationsScreenProps {
    route: any;
    navigation: any;
}

const ReservationsScreen: React.FC<ReservationsScreenProps> = ({
    route,
    navigation,
}) => {
    const {userUid} = route.params;
    const [reservations, setReservations] = useState<Reservation[]>([]);
    let isMounted = true;
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getImageUrl = async (restaurantId: string) => {
            try {
                const snapshot = await firestore()
                    .collection('restaurants')
                    .doc(restaurantId)
                    .get();
                return snapshot.data()?.imageUrl;
            } catch (e) {
                console.error(e);
            }
        };

        const getName = async (restaurantId: string) => {
            try {
                const snapshot = await firestore()
                    .collection('restaurants')
                    .doc(restaurantId)
                    .get();
                return snapshot.data()?.name;
            } catch (e) {
                console.error(e);
            }
        };

        const fetchReservations = async () => {
            setIsLoading(true);
            try {
                const snapshot = await firestore()
                    .collection('users')
                    .doc(userUid)
                    .collection('reservations')
                    .get();

                const reservationsPromises = snapshot.docs.map(async doc => {
                    const imageUrl = await getImageUrl(doc.data().restaurantId);
                    const name = await getName(doc.data().restaurantId);
                    console.log(doc.data().times);
                    return {
                        id: doc.id,
                        restaurant: name,
                        date: doc.data().date,
                        times: doc.data().times,
                        tableId: doc.data().table,
                        imageUrl: imageUrl,
                    };
                });

                const resolvedReservations = await Promise.all(
                    reservationsPromises,
                );
                if (isMounted) {
                    setReservations(resolvedReservations);
                }
                setIsLoading(false);
            } catch (e) {
                console.error(e);
                setIsLoading(false);
            }
        };

        fetchReservations().then();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

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
                                {reservation.date} |{' '}
                                {reservation.times.join(', ')}
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
