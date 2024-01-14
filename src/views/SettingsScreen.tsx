import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView, Pressable, Dimensions,
} from 'react-native';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import Config from "../../config/config";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";

const API_URL = Config.MESSAGE_API_URL;

const height = Dimensions.get('window').height;

const SettingsScreen = () => {
    return (
        <ScrollView>
            <View style={styles.container}>
            <Pressable style={styles.option}>
                <View style={styles.iconHolder}>
                    <FontAwesomeIcon icon={faUser} />
                </View>
                <View style={styles.textHolder}>
                    <Text style={styles.text}>Account</Text>
                </View>
                <View style={styles.arrowHolder}>
                    <FontAwesomeIcon icon={faArrowRight} size={22} />
                </View>
            </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#fff',
        height: height
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 5,
        backgroundColor: '#e0e0e0',
        marginBottom: 20,
        marginHorizontal: 20,
        borderRadius: 10,
    },
    iconHolder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#93A8AC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textHolder: {
        flex: 1,
        marginLeft: 15,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    arrowHolder: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 8,
    },
});

export default SettingsScreen;