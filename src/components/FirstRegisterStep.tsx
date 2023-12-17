import React, {useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    StyleSheet,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEnvelope, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

interface FirstRegisterStepProps {
    navigation: any;
    user: any;
    updateUser: any;
    nextStep: any;
}

const FirstRegisterStep: React.FC<FirstRegisterStepProps> = ({
    navigation,
    user,
    updateUser,
    nextStep,
}) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
    const [error, setError] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleRepeatPasswordVisibility = () => {
        setRepeatPasswordVisible(!repeatPasswordVisible);
    };

    const handleNextStep = () => {
        if (
            user.email.trim() === '' ||
            user.password.trim() === '' ||
            user.repeatPassword.trim() === ''
        ) {
            setError('Please fill all fields');
            return;
        }
        if (user.password !== user.repeatPassword) {
            setError('Passwords do not match');
            return;
        }
        nextStep();
    };

    return (
        <View>
            <Text style={styles.infoText}>
                Please enter your email and password
            </Text>
            <Text style={styles.inputText}>
                <Text style={styles.required}>* </Text>
                Your email:
            </Text>

            <View style={styles.inputHolder}>
                <TextInput
                    onChangeText={value => updateUser('email', value)}
                    value={user.email}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <FontAwesomeIcon icon={faEnvelope} size={20} />
            </View>
            <Text style={styles.inputText}>
                <Text style={styles.required}>* </Text>
                Password:
            </Text>
            <View style={styles.inputHolder}>
                <TextInput
                    onChangeText={value => updateUser('password', value)}
                    value={user.password}
                    placeholder="Enter your password"
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                    <FontAwesomeIcon
                        icon={passwordVisible ? faEyeSlash : faEye}
                        size={20}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.inputText}>
                <Text style={styles.required}>* </Text>
                Repeat password:
            </Text>
            <View style={styles.inputHolder}>
                <TextInput
                    onChangeText={value => updateUser('repeatPassword', value)}
                    value={user.repeatPassword}
                    placeholder="Repeat password"
                    secureTextEntry={!repeatPasswordVisible}
                />
                <TouchableOpacity onPress={toggleRepeatPasswordVisibility}>
                    <FontAwesomeIcon
                        icon={repeatPasswordVisible ? faEyeSlash : faEye}
                        size={20}
                    />
                </TouchableOpacity>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Pressable style={styles.button} onPress={handleNextStep}>
                <Text style={styles.buttonText}>Next step</Text>
            </Pressable>
            <View style={styles.dividerHolder}>
                <View style={styles.separator}></View>
                <Text style={styles.separatorText}>OR</Text>
                <View style={styles.separator}></View>
            </View>
            <View style={styles.loginHolder}>
                <Text style={styles.loginText}>Already have an account? </Text>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('ProfileScreen');
                    }}>
                    <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FirstRegisterStep;

const styles = StyleSheet.create({
    infoText: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 15,
    },
    inputText: {
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 5,
    },
    required: {
        color: 'red',
    },
    inputHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ccc',
        paddingLeft: 10,
        paddingRight: 14,
        borderRadius: 10,
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#1FAFBF',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
    },
    dividerHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    separatorText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#ccc',
        marginHorizontal: 10,
    },
    loginHolder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 16,
        fontWeight: '600',
    },
    loginLink: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1FAFBF',
    },
});
