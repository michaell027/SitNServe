import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    Pressable,
    TextInput,
    KeyboardAvoidingView,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Picker} from '@react-native-picker/picker';
import {getCountries, Country} from '../services/countryService';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';

function SecondRegisterStep({
    navigation,
    user,
    updateUser,
    nextStep,
    prevStep,
    updateUserAddress,
}) {
    const [country, setCountry] = useState(
        user.address.country || 'placeholder',
    );
    const [countries, setCountries] = useState<Country[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        console.log('aaa' + user.address.state);
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
                const countries = [];
                data.forEach(country => {
                    countries.push(country.name);
                });
                setCountries(countries);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchCountries();
    }, []);

    const handleNextStep = () => {
        if (
            (country === 'placeholder',
            user.address.city === '',
            user.address.street === '',
            user.address.number === '',
            user.address.zip === '')
        ) {
            setError('Please fill all fields');
            return;
        }
        nextStep();
    };

    return (
        <View>
            <Text className={`mb-6 text-lg`}>Please enter your address</Text>
            <Text className={`mb-2 font-[900] text-lg`}>Your address:</Text>
            <View className={`border-2 border-gray-400 rounded-lg mb-4`}>
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

            <View className={`border-2 rounded-lg mb-4 pl-2 border-gray-400`}>
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

            <View className={`border-2 rounded-lg mb-4 pl-2 border-gray-400`}>
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

            <View
                className={`flex-row border-2 border-gray-400 rounded-lg mb-4 pl-2`}>
                <TextInput
                    className={`w-2/3 border-r-2`}
                    onChangeText={text => updateUserAddress('street', text)}
                    value={user.address.street}
                    placeholder="*Street"
                    editable={country !== 'placeholder'}
                    placeholderTextColor={
                        country === 'placeholder' ? '#c0c0c0' : '#000'
                    }
                />
                <TextInput
                    className={`pl-3`}
                    onChangeText={text => updateUserAddress('number', text)}
                    value={user.address.number}
                    placeholder="*Number"
                    editable={country !== 'placeholder'}
                    placeholderTextColor={
                        country === 'placeholder' ? '#c0c0c0' : '#000'
                    }
                />
            </View>

            <View
                className={`flex-row border-2 border-gray-400 rounded-lg mb-2 pl-2`}>
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
            {error !== '' && (
                <Text className={`text-red-500 text-center text-[16px] my-2`}>
                    {error}
                </Text>
            )}
            <View
                className={`justify-between w-full flex-row w-full items-center`}>
                <Pressable
                    className={`bg-gray-500 rounded-lg w-1/6 py-3 px-4 mb-4 mt-2 items-center justify-center`}
                    onPress={prevStep}>
                    <FontAwesomeIcon
                        icon={faAngleLeft}
                        color={'#fff'}
                        size={25}
                    />
                </Pressable>
                <Pressable
                    className={`bg-teal-600 w-4/6 rounded-lg py-2 px-4 mb-4 mt-2`}
                    onPress={handleNextStep}>
                    <Text
                        className={`text-center font-[800] text-lg text-white`}>
                        Next step
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
export default SecondRegisterStep;
