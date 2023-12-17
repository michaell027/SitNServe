import React from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';

interface ThirdRegisterStepProps {
    navigation: any;
    user: any;
    updateUser: any;
    prevStep: any;
    register: any;
    error: string;
    setError: any;
}

const ThirdRegisterStep: React.FC<ThirdRegisterStepProps> = ({
    navigation,
    user,
    updateUser,
    prevStep,
    register,
    error,
    setError,
}) => {
    const handleRegister = () => {
        if (!user.firstName || !user.lastName || !user.phone) {
            setError('Please fill in all fields');
            return;
        }
        register();
    };
    return (
        <View>
            <Text style={styles.infoText}>
                Please enter your contact information
            </Text>
            <Text style={styles.inputText}>
                <Text style={styles.required}>* </Text>
                Your first name:
            </Text>

            <View style={styles.inputHolder}>
                <TextInput
                    onChangeText={value => updateUser('firstName', value)}
                    value={user.firstName}
                    placeholder="Enter your first name"
                    autoCapitalize="sentences"
                />
            </View>
            <Text style={styles.inputText}>
                <Text style={styles.required}>* </Text>
                Your last name:
            </Text>
            <View style={styles.inputHolder}>
                <TextInput
                    onChangeText={value => updateUser('lastName', value)}
                    value={user.lastName}
                    placeholder="Enter your last name"
                    autoCapitalize="sentences"
                />
            </View>
            <Text style={styles.inputText}>
                <Text style={styles.required}>* </Text>
                Your phone number:
            </Text>
            <View style={styles.inputHolder}>
                <TextInput
                    onChangeText={value => updateUser('phone', value)}
                    value={user.phone}
                    placeholder="Enter your phone number"
                    keyboardType="numeric"
                />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

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
                    onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>
            </View>

            <Text style={styles.termsText}>
                By registering you agree to our{' '}
                <Text style={styles.linkedText}>Terms of Service</Text> and{' '}
                <Text style={styles.linkedText}>Privacy Policy</Text>
            </Text>
        </View>
    );
};

export default ThirdRegisterStep;

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
    required: {
        color: 'red',
    },
    inputHolder: {
        borderWidth: 2,
        borderColor: '#ccc',
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonsHolder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    prevStepButton: {
        backgroundColor: 'gray',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    nextStepButton: {
        backgroundColor: '#1FAFBF',
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    termsText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    linkedText: {
        color: '#1FAFBF',
        textDecorationLine: 'none',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
    },
});
