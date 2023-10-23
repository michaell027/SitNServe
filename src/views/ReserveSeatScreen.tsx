import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Platform } from 'react-native';
import { firebase } from '@react-native-firebase/database';
import DateTimePicker from '@react-native-community/datetimepicker';

function ReserveSeatScreen({ navigation, route }) {
    const [seats, setSeats] = useState([]);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState(false);
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
                        id: key,
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
        <View style={styles.container}>
            <Text style={styles.text}>
                ID: {item.id} Seat: {item.seat}
            </Text>
            <Button
                title={item.occupied ? 'Reserved' : 'Select'}
                onPress={() => {
                    if (!item.occupied) {
                        reference.child(item.id.toString()).update({ occupied: true });
                    }
                }}
                disabled={item.occupied}
            />
        </View>
    );

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatePicker = () => {
        showMode('date');
    };

    const showTimePicker = () => {
        showMode('time');
    };

    return (
        <View style={styles.screen}>
            <View>
                <Button onPress={showDatePicker} title='Show date picker' />
                <Button onPress={showTimePicker} title='Show time picker' />
                {show && (
                    <DateTimePicker
                        testID='dateTimePicker'
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display='default'
                        onChange={onChange}
                    />
                )}
            </View>
            <FlatList
                data={seats}
                renderItem={renderItem}
                keyExtractor={(item) => item.seat.toString()}
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
