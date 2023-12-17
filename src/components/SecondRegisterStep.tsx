import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, TextInput, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Picker} from '@react-native-picker/picker';
import {getCountries} from '../services/countryService';
import {Country} from '../models/Country';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';

interface SecondRegisterStepProps {
    navigation: any;
    user: any;
    updateUser: any;
    nextStep: any;
    prevStep: any;
    updateUserAddress: any;
}

const SecondRegisterStep: React.FC<SecondRegisterStepProps> = ({
    navigation,
    user,
    updateUser,
    nextStep,
    prevStep,
    updateUserAddress,
}) => {
    const [country, setCountry] = useState<string>(
        user.address.country || 'placeholder',
    );
    const [countries, setCountries] = useState<string[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (user.address.state !== '' && user.address.state !== undefined) {
            setCountry(user.address.state);
        }
    }, []);

    useEffect(() => {
        if (country !== 'placeholder') {
            updateUserAddress('state', country);
        } else {
            updateUserAddress('state', '');
        }
    }, [country]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const data: Country[] = await getCountries();
                const countries: string[] = [];
                data.forEach(country => {
                    countries.push(country.name);
                });
                setCountries(countries);
            } catch (error) {
                console.log(error);
            }
        };

        fetchCountries().catch(error => {
            setError("Couldn't fetch countries");
        });
    }, []);

    const handleNextStep = () => {
        if (
            country === 'placeholder' ||
            user.address.city === '' ||
            user.address.street === '' ||
            user.address.number === '' ||
            user.address.zip === ''
        ) {
            setError('Please fill all fields');
            return;
        }
        nextStep();
    };

    return (
        <View>
            <Text style={styles.infoText}>Please enter your address</Text>
            <Text style={styles.inputText}>
                <Text style={styles.required}>*</Text> Your address:
            </Text>
            <View style={styles.pickerHolder}>
                <Picker
                    selectedValue={country}
                    onValueChange={(itemValue, itemIndex) => {
                        console.log(itemValue);
                        setCountry(itemValue);
                    }}>
                    <Picker.Item
                        label="*Select country"
                        value={'placeholder'}
                    />

                    {countries.map(country => (
                        <Picker.Item
                            key={country}
                            label={country}
                            value={country}
                        />
                    ))}
                </Picker>
            </View>

            <View style={styles.inputHolder}>
                <TextInput
                    onChangeText={text => updateUserAddress('city', text)}
                    value={user.address.city}
                    placeholder="*City"
                    editable={country !== 'placeholder'}
                    placeholderTextColor={
                        country === 'placeholder' ? '#c0c0c0' : '#000'
                    }
                />
            </View>

            <View style={styles.inputHolder}>
                <TextInput
                    onChangeText={text => updateUserAddress('address', text)}
                    value={user.address.address || ''}
                    placeholder="Address"
                    editable={country !== 'placeholder'}
                    placeholderTextColor={
                        country === 'placeholder' ? '#c0c0c0' : '#000'
                    }
                />
            </View>

            <View style={styles.twoInputsHolder}>
                <TextInput
                    style={styles.firstInput}
                    onChangeText={text => updateUserAddress('street', text)}
                    value={user.address.street}
                    placeholder="*Street"
                    editable={country !== 'placeholder'}
                    placeholderTextColor={
                        country === 'placeholder' ? '#c0c0c0' : '#000'
                    }
                />
                <TextInput
                    style={styles.secondInput}
                    onChangeText={text => updateUserAddress('number', text)}
                    value={user.address.number}
                    placeholder="*Number"
                    editable={country !== 'placeholder'}
                    placeholderTextColor={
                        country === 'placeholder' ? '#c0c0c0' : '#000'
                    }
                />
            </View>

            <View style={styles.inputHolder}>
                <TextInput
                    onChangeText={text => updateUserAddress('zip', text)}
                    value={user.address.zip}
                    placeholder="*ZIP code"
                    keyboardType="numeric"
                    editable={country !== 'placeholder'}
                    placeholderTextColor={
                        country === 'placeholder' ? '#c0c0c0' : '#000'
                    }
                />
            </View>
            {error !== '' && <Text style={styles.error}>{error}</Text>}
            <View style={styles.buttonsHolder}>
                <Pressable style={styles.prevStepButton} onPress={prevStep}>
                    <FontAwesomeIcon
                        icon={faAngleLeft}
                        color={'#fff'}
                        size={25}
                    />
                </Pressable>
                <Pressable
                    style={styles.nextStepButton}
                    onPress={handleNextStep}>
                    <Text style={styles.buttonText}>Next step</Text>
                </Pressable>
            </View>
        </View>
    );
};
export default SecondRegisterStep;

const styles = StyleSheet.create({
    infoText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 15,
    },
    inputText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pickerHolder: {
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
    },
    inputHolder: {
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
        paddingLeft: 10,
    },
    twoInputsHolder: {
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 10,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    firstInput: {
        width: '70%',
        borderRightColor: '#ccc',
        borderRightWidth: 2,
    },
    secondInput: {
        paddingLeft: 10,
        width: '30%',
    },
    buttonsHolder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    prevStepButton: {
        backgroundColor: 'gray',
        paddingHorizontal: 20,
        borderRadius: 10,
        paddingVertical: 10,
    },
    nextStepButton: {
        backgroundColor: '#1FAFBF',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 50,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    error: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    required: {
        color: 'red',
    },
});
