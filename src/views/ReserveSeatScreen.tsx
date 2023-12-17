import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Pressable,
    ScrollView,
    Image,
} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircle, faCircleCheck} from '@fortawesome/free-regular-svg-icons';
import {faCalendar, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';
import {ReservationData, ReservationSlot, Table} from '../models/Reservation';

interface ReserveSeatScreenProps {
    navigation: any;
    route: any;
}

const ReserveSeatScreen: React.FC<ReserveSeatScreenProps> = ({
    navigation,
    route,
}) => {
    const [tables, setTables] = useState<Table[] | null>(null);
    const [date, setDate] = useState<Date>(new Date());
    const [show, setShow] = useState<boolean>(false);
    const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const {restaurantId} = route.params;
    const [realTimeData, setRealTimeData] = useState<ReservationData[] | null>(
        null,
    );
    const [userUid, setUserUid] = useState<string | null>(null);
    const [error, setError] = useState<string>('');

    const reference = firebase
        .app()
        .database(
            'https://sitnserve-fbaed-default-rtdb.europe-west1.firebasedatabase.app/',
        )
        .ref(`/restaurant_id/${restaurantId}/tables`);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
            if (user) {
                setUserUid(user.uid);
            } else {
                setUserUid(null);
                navigation.navigate('LoginScreen');
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchRealTimeData = () => {
        reference.on('value', snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (data) {
                    const dataArray = Object.keys(data)
                        .map(key => ({id: key, ...data[key]}))
                        .filter(item => item.reserved);
                    setRealTimeData(dataArray as ReservationData[]);
                } else {
                    console.log('Data is not in expected format.');
                }
            } else {
                console.log('No data found.');
            }
        });
    };

    useEffect(() => {
        fetchRealTimeData();
    }, []);

    const fetchTables = async () => {
        try {
            const snapshot = await firestore()
                .collection('restaurants')
                .doc(restaurantId)
                .get();
            if (snapshot.exists) {
                const restaurantData = snapshot.data();
                if (!restaurantData) {
                    console.log('No restaurant data found!');
                    return;
                }
                const tables = restaurantData.tables;
                setTables(
                    tables.map((table: Table, index: number) => ({
                        ...table,
                        id: index,
                    })),
                );
            } else {
                console.log('No such document in Firestore!');
            }
        } catch (error) {
            console.log('Error getting document:', error);
        }
    };

    useEffect(() => {
        fetchTables().then();
    }, []);

    const handleTimeSelect = (time: string) => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter(t => t !== time));
        } else {
            setSelectedTimes([...selectedTimes, time]);
        }
    };

    const handleReserve = async () => {
        if (!date || selectedTimes.length === 0) {
            setError('Please select date and time.');
            return;
        }

        const dateString = date.toISOString().split('T')[0];

        if (!realTimeData) {
            console.log('No real time data found.');
            return;
        }

        if (!selectedSeatId) {
            setError('Please select a seat.');
            return;
        }

        const seatRealTimeData = realTimeData.find(
            seat => seat.id === selectedSeatId.toString(),
        );

        if (!seatRealTimeData) {
            console.log('Seat not found');
            return;
        }

        const times = seatRealTimeData.reserved[dateString];

        if (!times) {
            console.log('No times found for date:', dateString);
            return;
        }

        if (!userUid) {
            navigation.navigate('LoginScreen');
            return;
        }

        const newTimes = selectedTimes.reduce(
            (acc: {[key: string]: ReservationSlot}, time) => {
                acc[time] = {
                    occupied: true,
                    user: userUid,
                };
                return acc;
            },
            {} as {[key: string]: ReservationSlot},
        );

        const newReserved = {
            ...times,
            ...newTimes,
        };

        const newSeat = {
            ...seatRealTimeData,
            reserved: {
                ...seatRealTimeData.reserved,
                [dateString]: newReserved,
            },
        };

        reference
            .child(selectedSeatId.toString())
            .set(newSeat)
            .then(() => {
                firestore()
                    .collection('users')
                    .doc(userUid)
                    .collection('reservations')
                    .add({
                        restaurantId,
                        date: dateString,
                        times: selectedTimes,
                        table: selectedSeatId,
                    })
                    .then(() => {
                        navigation.navigate('ReservationsScreen');
                    })
                    .catch(error => {
                        console.log('Error adding reservation to user:', error);
                    });
            })
            .catch(error => {
                console.log('Error reserving seat:', error);
            });
        setSelectedSeatId(null);
        setSelectedTimes([]);
    };

    const renderTimes = (id: number) => {
        if (!tables || !realTimeData) return;

        const seat = tables.find(table => table.table === id);
        if (!seat) {
            setError('Seat not found.');
            return null;
        }

        const dateString = date.toISOString().split('T')[0];
        const tableData = realTimeData.find(
            table => table.id === id.toString(),
        );
        if (!tableData) {
            setError('Table not found.');
            return null;
        }

        const times = tableData.reserved?.[dateString];
        if (!times) {
            setError('No times found.');
            return null;
        }

        const sortedTimes = Object.keys(times).sort((a, b) => {
            const isANextDay = a.startsWith('00:');
            const isBNextDay = b.startsWith('00:');
            if (isANextDay && !isBNextDay) return 1;
            if (!isANextDay && isBNextDay) return -1;
            return a.localeCompare(b);
        });

        return (
            <View style={timesStyles.container}>
                <View style={timesStyles.timeContainer}>
                    {sortedTimes.map(time => (
                        <Pressable
                            key={time}
                            style={[
                                timesStyles.timeButton,
                                times[time].occupied && timesStyles.occupied,
                                selectedTimes.includes(time) &&
                                    timesStyles.selected,
                            ]}
                            onPress={() => {
                                if (!times[time].occupied) {
                                    handleTimeSelect(time);
                                }
                            }}
                            disabled={times[time].occupied}>
                            {selectedTimes.includes(time) ? (
                                <FontAwesomeIcon icon={faCircleCheck} />
                            ) : (
                                <FontAwesomeIcon icon={faCircle} />
                            )}
                            <Text style={timesStyles.timeText}>{time}</Text>
                        </Pressable>
                    ))}
                </View>
                <Pressable
                    style={timesStyles.reserveButton}
                    onPress={handleReserve}>
                    <Text style={timesStyles.reserveButtonText}>
                        Send reservation
                    </Text>
                </Pressable>
            </View>
        );
    };

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setSelectedSeatId(null);
        setSelectedTimes([]);
    };

    const showDatePicker = () => {
        setShow(true);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.containerHolder}>
                <Text style={styles.title}>Reserve a seat</Text>
                <Text style={styles.subtitle}>right now</Text>
                <View style={styles.dateHolder}>
                    <Pressable onPress={showDatePicker} style={styles.calendar}>
                        <FontAwesomeIcon icon={faCalendar} size={25} />
                    </Pressable>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            minimumDate={new Date(Date.now())}
                            maximumDate={
                                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            }
                        />
                    )}
                    <FontAwesomeIcon icon={faArrowRight} size={25} />
                    <View style={styles.date}>
                        <Text style={styles.dateText}>
                            {date.toISOString().split('T')[0]}
                        </Text>
                    </View>
                </View>
                {tables && (
                    <View style={styles.seatsHolder}>
                        {tables.map((seat, index) => (
                            <View key={index} style={styles.seatHolder}>
                                <View
                                    style={[
                                        styles.seatRow,
                                        selectedSeatId === seat.table &&
                                            styles.seatRowSelected,
                                    ]}>
                                    <Image
                                        source={require('../../assets/images/dining-table.png')}
                                    />
                                    <View>
                                        <Text style={styles.table}>
                                            Table: {seat.table}
                                        </Text>
                                        <Text style={styles.seats}>
                                            Number of seats: {seat.seats}
                                        </Text>
                                    </View>
                                    <Pressable
                                        style={styles.button}
                                        onPress={() => {
                                            if (selectedSeatId === seat.table) {
                                                setSelectedSeatId(null);
                                                setSelectedTimes([]);
                                                return;
                                            }
                                            setSelectedSeatId(seat.table);
                                            setSelectedTimes([]);
                                        }}>
                                        <Text style={{color: 'white'}}>
                                            Select time
                                        </Text>
                                    </Pressable>
                                </View>
                                {selectedSeatId === seat.table &&
                                    renderTimes(seat.table)}
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFBF',
        paddingHorizontal: 20,
        paddingVertical: 20,
        width: '100%',
        height: '100%',
    },
    containerHolder: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
    },
    dateHolder: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        gap: 40,
    },
    calendar: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    date: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    dateText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    seatsHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20,
        minWidth: '75%',
        maxWidth: '100%',
        justifyContent: 'center',
        marginBottom: 50,
    },
    seatHolder: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        width: '100%',
        height: 'auto',
    },
    seatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 30,
    },
    seatRowSelected: {
        borderBottomWidth: 2,
        paddingBottom: 20,
        marginBottom: 2,
        borderColor: '#000',
    },
    table: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
    },
    seats: {
        fontSize: 15,
        color: 'black',
    },
    button: {
        backgroundColor: '#1FAFBF',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
});

const timesStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: 'auto',
    },
    timeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        paddingVertical: 6,
        paddingHorizontal: 10,
        gap: 10,
    },
    occupied: {
        opacity: 0.4,
    },
    selected: {
        backgroundColor: '#1FAFBF',
        borderRadius: 5,
    },
    timeText: {
        color: 'black',
        fontSize: 18,
    },
    reserveButton: {
        backgroundColor: '#1FAFBF',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
    },
    reserveButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ReserveSeatScreen;
