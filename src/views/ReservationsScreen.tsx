import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator, TouchableOpacity,
} from 'react-native';
import {Reservation} from '../models/Reservation';
import firestore from '@react-native-firebase/firestore';
import {firebase} from "@react-native-firebase/database";

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
    const [upcomingReservations, setUpcomingReservations] = useState<
        Reservation[]
    >([]);
    const [pastReservations, setPastReservations] = useState<Reservation[]>(
        [],
    );
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
                    console.log(doc.data());
                    return {
                        id: doc.id,
                        restaurant: name,
                        restaurantId: doc.data().restaurantId,
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
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const day = String(today.getDate()).padStart(2, '0');
                    const date = `${year}-${month}-${day}`;
                    const hours = String(today.getHours()).padStart(2, '0');
                    const minutes = String(today.getMinutes()).padStart(2, '0');
                    const time = `${hours}:${minutes}`;
                    const upcomingReservations = resolvedReservations.filter(
                        reservation =>
                            reservation.date > date ||
                            (reservation.date === date &&
                                reservation.times.some(
                                    (reservationTime : string) =>
                                        reservationTime > time,
                                )),
                    );
                    setUpcomingReservations(upcomingReservations);
                    const pastReservations = resolvedReservations.filter(
                        reservation =>
                            reservation.date < date ||
                            (reservation.date === date &&
                                reservation.times.every(
                                    (reservationTime : string) =>
                                        reservationTime < time,
                                )),
                    );
                    setPastReservations(pastReservations);
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

    function handleCancelReservation(reservationId: string, restaurantId: string, tableId: string, times: string[], date: string) {
        console.log("Cancelling reservation with id", reservationId);
        const firestoreRef = firestore()
            .collection('users')
            .doc(userUid)
            .collection('reservations')
            .doc(reservationId);

        const dbUrl = 'https://sitnserve-fbaed-default-rtdb.europe-west1.firebasedatabase.app/';
        const firebaseRef = firebase
            .app()
            .database(dbUrl)
            .ref(`/restaurant_id/${restaurantId}/tables/${tableId}/reserved/${date}`);

        firestoreRef.delete()
            .then(() => {
                return firebaseRef.once('value');
            })
            .then(snapshot => {
                let reservationData = snapshot.val();
                if (reservationData) {
                    times.forEach(time => {
                        if (reservationData[time] && reservationData[time].occupied) {
                            reservationData[time].occupied = false;
                            reservationData[time].user = "";
                        }
                    });
                    return firebaseRef.update(reservationData);
                } else {
                    throw new Error("No reservation data found for the specified time");
                }
            })
            .then(() => {
                console.log("Reservation cancelled successfully");
                setReservations(prevReservations => prevReservations.filter(reservation => reservation.id !== reservationId));
                setUpcomingReservations(prevUpcoming => prevUpcoming.filter(reservation => reservation.id !== reservationId));
            })
            .catch(error => {
                console.error("Error during reservation cancellation:", error);
            });
    }


    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                    Upcoming Reservations
                </Text>
                {upcomingReservations.length === 0 && (
                    <Text style={{marginTop: 10}}>
                        You have no upcoming reservations.
                    </Text>
                )}
                {upcomingReservations.map(reservation => (
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
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => handleCancelReservation(reservation.id, reservation.restaurantId, reservation.tableId, reservation.times, reservation.date)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 10}}>
                    Past Reservations
                </Text>
                {pastReservations.length === 0 && (
                    <Text style={{marginTop: 10}}>
                        You have no past reservations.
                    </Text>
                )}
                {pastReservations.map(reservation => (
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
    cancelButton: {
        backgroundColor: 'red',
        padding: 6,
        borderRadius: 5,
        marginTop: 5,
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ReservationsScreen;
