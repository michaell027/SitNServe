import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    StyleSheet,
    Platform,
    Pressable,
} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircle, faCircleCheck} from '@fortawesome/free-regular-svg-icons';

function ReserveSeatScreen({navigation, route}) {
    const [seats, setSeats] = useState([]);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [showTimes, setShowTimes] = useState(false);
    const [selectedSeatId, setSelectedSeatId] = useState(null);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const {restaurantId} = route.params;
    const [selectView, setSelectView] = useState<'date' | 'table'>('date');

    const reference = firebase
        .app()
        .database(
            'https://sitnserve-fbaed-default-rtdb.europe-west1.firebasedatabase.app/',
        )
        .ref(`/restaurant_id/${restaurantId}/tables`);

    useEffect(() => {
        const unsubscribe = reference.on('value', snapshot => {
            if (snapshot?.exists()) {
                const seatsData = snapshot.val();
                if (seatsData) {
                    const seatsArray = Object.keys(seatsData).map(key => ({
                        ...seatsData[key],
                        id: key,
                    }));
                    setSeats(seatsArray);
                }
            } else {
                console.log(
                    'Firebase snapshot is not valid or cannot read from database.',
                );
            }
        });

        return () => {
            unsubscribe();
        };
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
        const seat = seats.find(seat => seat.id === selectedSeatId);
        const times = seat?.reserved[dateString];
        console.log('times', times);
        if (!seat || !times) {
            console.log('Seat or times not found');
            return;
        }

        const newTimes = selectedTimes.reduce((acc, time) => {
            acc[time] = {
                occupied: {
                    value: true,
                    by: 'user_id',
                },
            };
            return acc;
        }, {});
        console.log('newTimes', newTimes);

        const newReserved = {
            ...times,
            ...newTimes,
        };
        console.log('newReserved', newReserved);

        const newSeat = {
            ...seat,
            reserved: {
                ...seat.reserved,
                [dateString]: newReserved,
            },
        };
        console.log('newSeat', newSeat);

        await reference.child(selectedSeatId).set(newSeat);
        setSelectedSeatId(null);
        setSelectedTimes([]);
    };

    const renderTimes = id => {
        const seat = seats.find(seat => seat.id === id);
        const dateString = date.toISOString().split('T')[0];
        const times = seat?.reserved[dateString];

        if (!seat) {
            return null;
        }

        return (
            <View>
                {times &&
                    Object.keys(times)
                        .sort((a, b) => a.localeCompare(b))
                        .map(time => (
                            <Pressable
                                key={time}
                                style={styles.button}
                                onPress={() => {
                                    if (!times[time].occupied.value) {
                                        console.log(time);
                                        handleTimeSelect(time);
                                    }
                                }}
                                disabled={times[time].occupied.value}>
                                {selectedTimes.includes(time) ? (
                                    <FontAwesomeIcon icon={faCircleCheck} />
                                ) : (
                                    <FontAwesomeIcon icon={faCircle} />
                                )}
                                <Text style={styles.text}>{time}</Text>
                            </Pressable>
                        ))}
                <Pressable onPress={() => handleReserve()}>
                    <Text>Send reservation</Text>
                </Pressable>
            </View>
        );
    };

    const renderItem = ({item, index}) => (
        <View style={styles.container}>
            <Text style={styles.text}>
                ID: {item.id} Seats: {item.seats}
            </Text>
            <Pressable
                className={`bg-blue-500 p-2 rounded-md`}
                onPress={() => {
                    setSelectedSeatId(prevId =>
                        prevId === item.id ? null : item.id,
                    );
                    setSelectedTimes([]);
                }}>
                <Text>Select time</Text>
            </Pressable>
            {selectedSeatId === item.id && renderTimes(item.id)}
        </View>
    );

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
        <View style={styles.screen}>
            <View className={`flex flex-row w-full`}>
                <Pressable
                    onPress={() => setSelectView('date')}
                    className={`${
                        selectView === 'date'
                            ? 'border-b-2 border-blue-500'
                            : ''
                    } w-1/2 items-center`}>
                    <Text
                        className={`${
                            selectView === 'date' ? 'text-blue-500' : ''
                        } text-lg`}>
                        Select date
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => setSelectView('table')}
                    className={`${
                        selectView === 'table'
                            ? 'border-b-2 border-blue-500'
                            : ''
                    } w-1/2 items-center`}>
                    <Text
                        className={`${
                            selectView === 'table' ? 'text-blue-500' : ''
                        } text-lg`}>
                        Select table
                    </Text>
                </Pressable>
            </View>
            {selectView === 'date' && (
                <View style={styles.datePicker}>
                    <Text>{date.toISOString().split('T')[0]}</Text>
                </View>
            )}
            <View>
                <Button onPress={showDatePicker} title="Show date picker" />
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        minimumDate={
                            new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
                        }
                        maximumDate={
                            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        }
                    />
                )}
            </View>
            <FlatList
                data={seats}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 8,
    },
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
