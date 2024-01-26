import React, {useEffect, useState} from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {LoggedInHomeProps} from '../models/LoggedInHomeProps';
import firebase from "@react-native-firebase/app";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

function LoggedInHome({
    navigation,
    buttonDataAfterLogin,
    getIconSize,
}: LoggedInHomeProps) {
    return (
        <View style={styles.container}>
            <View style={styles.mainContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('./../../assets/images/breakfast2.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.buttonsContainer}>
                    {buttonDataAfterLogin?.map((button, index) => (
                        <View key={index} style={styles.buttonWrapper}>
                            <Pressable
                                onPress={() =>
                                    navigation.navigate(button.navigate)
                                }
                                style={styles.pressable}>
                                <FontAwesomeIcon
                                    icon={button.icon}
                                    size={getIconSize()}
                                    color="#012840"
                                />
                            </Pressable>
                            <Text style={styles.buttonText}>{button.text}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

export default LoggedInHome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: windowHeight * 0.9,
        width: windowWidth,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainContainer: {
        width: '90%',
        height: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        marginTop: 6,
        marginBottom: 6,
    },
    imageContainer: {
        maxHeight: '50%',
        width: '100%',
        alignItems: 'center',
    },
    image: {
        width: '75%',
        height: '100%',
        borderRadius: 20,
    },
    buttonsContainer: {
        maxHeight: '50%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    buttonWrapper: {
        width: '33%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 20,
    },
    pressable: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 23,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#012840',
        marginBottom: 8,
    },
    buttonText: {
        color: '#012840',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
