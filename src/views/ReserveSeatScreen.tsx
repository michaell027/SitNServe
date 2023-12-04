import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    StyleSheet,
    Platform,
    Pressable,
    ScrollView,
    Image,
} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircle, faCircleCheck} from '@fortawesome/free-regular-svg-icons';
import {faCalendar, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ReserveSeatScreen({navigation, route}) {
    const [seats, setSeats] = useState([]);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [showTimes, setShowTimes] = useState(false);
    const [selectedSeatId, setSelectedSeatId] = useState(null);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const {restaurantId} = route.params;
    const [realTimeData, setRealTimeData] = useState(null);
    const [user, setUser] = useState(null);

    const reference = firebase
        .app()
        .database(
            'https://sitnserve-fbaed-default-rtdb.europe-west1.firebasedatabase.app/',
        )
        .ref(`/restaurant_id/${restaurantId}/tables`);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userString = await AsyncStorage.getItem('user');
                if (userString !== null) {
                    const user = JSON.parse(userString);
                    setUser(user);
                } else {
                    console.log('No user found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error fetching user from AsyncStorage', error);
            }
        };
        fetchUser();
    }, []);

    const fetchRealTimeData = () => {
        reference.on('value', snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (data) {
                    const dataArray = Object.keys(data)
                        .map(key => ({id: key, ...data[key]}))
                        .filter(item => item.reserved);
                    setRealTimeData(dataArray);
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
                const tables = restaurantData.tables;
                setSeats(tables.map((table, index) => ({...table, id: index})));
            } else {
                console.log('No such document in Firestore!');
            }
        } catch (error) {
            console.log('Error getting document:', error);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleTimeSelect = time => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter(t => t !== time));
        } else {
            setSelectedTimes([...selectedTimes, time]);
        }
    };

    const handleReserve = async () => {
        if (!date || selectedTimes.length === 0) {
            console.log('Please select date and time');
            return;
        }

        const dateString = date.toISOString().split('T')[0];
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

        const newTimes = selectedTimes.reduce((acc, time) => {
            acc[time] = {
                occupied: true,
                user: user.uid,
            };
            return acc;
        }, {});

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

        await reference.child(selectedSeatId.toString()).set(newSeat);
        setSelectedSeatId(null);
        setSelectedTimes([]);
    };

    const renderTimes = id => {
        const seat = seats.find(seat => seat.table === id);
        if (!seat) {
            console.log('No seat found for table:', id);
            return null;
        }

        const dateString = date.toISOString().split('T')[0];
        const tableData = realTimeData.find(
            table => table.id === id.toString(),
        );
        if (!tableData) {
            console.log('No table data found for:', id);
            return null;
        }

        const times = tableData.reserved?.[dateString];
        if (!times) {
            console.log('No times found for date:', dateString);
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
            <View className="flex w-full items-center">
                <View className="flex-row flex-wrap justify-between">
                    {sortedTimes.map(time => {
                        return (
                            <Pressable
                                key={time}
                                className={`flex-row space-x-2 py-2 items-center w-full w-1/2 ${
                                    times[time].occupied ? 'opacity-40' : ''
                                }`}
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
                                <Text className="text-black text-[17px]">
                                    {time}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
                <Pressable
                    className="bg-[#1FAFBF] rounded-lg p-2 mt-2"
                    onPress={handleReserve}>
                    <Text className="text-white text-center font-bold text-[16px]">
                        Send reservation
                    </Text>
                </Pressable>
            </View>
        );
    };

    const onChange = (event, selectedDate) => {
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
        <ScrollView className="py-2 px-6 flex bg-[#1FAFBF]/20">
            <Text className="text-3xl mt-2 font-bold text-black text-center">
                Reserve your seat
            </Text>
            <Text className="text-2xl font-bold text-[#F24452] text-center">
                right now
            </Text>
            <View className="w-full flex-row items-center justify-center mt-4 space-x-6">
                <Pressable
                    onPress={showDatePicker}
                    className="bg-white w-fit p-4 rounded-xl shadow-2xl shadow-black">
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
                <View className="bg-white rounded-xl shadow-2xl shadow-black my-4">
                    <Text className="text-xl py-3 px-2 font-semibold text-black">
                        {date.toISOString().split('T')[0]}
                    </Text>
                </View>
            </View>
            <View className="bg-white w-full rounded-2xl mt-4 p-4 space-y-4">
                {seats.map((seat, index) => (
                    <View
                        key={index}
                        className="flex-col border-2 rounded-lg p-3">
                        <View
                            className={`flex-row items-center justify-between ${
                                selectedSeatId === seat.table
                                    ? 'border-b-2 pb-2 mb-2'
                                    : ''
                            }`}>
                            <Image
                                source={require('../../assets/images/dining-table.png')}
                            />
                            <View>
                                <Text className="text-[15px] font-bold text-black">
                                    Table: {seat.table}
                                </Text>
                                <Text className="text-[15px] text-black">
                                    Number of seats: {seat.seats}
                                </Text>
                            </View>
                            <Pressable
                                className="bg-[#1FAFBF] rounded-lg p-2"
                                onPress={() => {
                                    if (selectedSeatId === seat.table) {
                                        setSelectedSeatId(null);
                                        setSelectedTimes([]);
                                        return;
                                    }
                                    setSelectedSeatId(seat.table);
                                    setSelectedTimes([]);
                                }}>
                                <Text className="text-white">Select time</Text>
                            </Pressable>
                        </View>
                        {selectedSeatId === seat.table &&
                            renderTimes(seat.table)}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 2,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
    },
    datePicker: {
        width: 200,
        marginBottom: 20,
    },
});

export default ReserveSeatScreen;
