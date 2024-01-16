import React from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faCalendar,
    faMobile,
    faUtensils,
    faBowlFood,
    faRightToBracket,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

type NotLoggedHomeProps = {
    navigation: any;
};

type OptionSectionProps = {
    icon: IconProp;
    title: string;
    description: string;
    color: string;
};

const height = Dimensions.get('window').height;

function NotLoggedHome({navigation}: NotLoggedHomeProps) {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={styles.imageSection}>
                    <Image
                        style={styles.titleImage}
                        source={require('./../../assets/images/welcome_to.png')}
                        resizeMode="contain"
                    />
                    <Image
                        style={styles.logoImage}
                        source={require('./../../assets/images/matus_logo.png')}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.optionSection}>
                    <OptionSection
                        icon={faBowlFood}
                        title="Find"
                        description="Explore the best dining spots near you."
                        color="#171E26"
                    />
                    <OptionSection
                        icon={faCalendar}
                        title="Reserve"
                        description="Secure your table in advance."
                        color="#F24452"
                    />
                    <OptionSection
                        icon={faMobile}
                        title="Order & Pay"
                        description="Scan, order, and pay right from your phone."
                        color="#F2A413"
                    />
                    <OptionSection
                        icon={faUtensils}
                        title="Enjoy"
                        description="Sit back, relax, and enjoy your meal."
                        color="#1FAFBF"
                    />

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={styles.button}
                            onPress={() =>
                                navigation.navigate('ProfileScreen')
                            }>
                            <FontAwesomeIcon
                                icon={faRightToBracket}
                                color="white"
                                size={20}
                            />
                            <Text style={styles.buttonText}>Login</Text>
                        </Pressable>
                        <Pressable
                            style={styles.button}
                            onPress={() =>
                                navigation.navigate('RegisterScreen')
                            }>
                            <FontAwesomeIcon
                                icon={faUserPlus}
                                color="white"
                                size={20}
                            />
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const OptionSection = ({
    icon,
    title,
    description,
    color,
}: OptionSectionProps) => (
    <View style={styles.optionSection}>
        <Text style={styles.optionTitle}>
            <FontAwesomeIcon icon={icon} size={20} color={color} />
            {' ' + title + ' '}
            <FontAwesomeIcon icon={icon} size={20} color={color} />
        </Text>
        <Text style={styles.optionDescription}>{description}</Text>
    </View>
);

export default NotLoggedHome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height * 0.9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        width: '90%',
        height: 'auto',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 6,
        backgroundColor: 'rgba(31, 175, 191, 0.4)',
        borderRadius: 20,
    },
    imageSection: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '75%',
    },
    titleImage: {
        width: '100%',
        height: '15%',
    },
    logoImage: {
        width: '100%',
        height: 150,
    },
    optionSection: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
    },
    optionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#171E26',
        marginBottom: 5,
    },
    optionDescription: {
        fontSize: 17,
        color: '#171E26',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        width: '90%',
        gap: 35,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1FAFBF',
        borderRadius: 10,
        padding: 10,
        width: 150,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        marginLeft: 10,
    },
});
