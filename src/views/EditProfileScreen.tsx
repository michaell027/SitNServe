import React, {useEffect} from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit, faSave} from '@fortawesome/free-solid-svg-icons';

interface EditProfileScreenProps {
    navigation: any;
    route: any;
}

const width = Dimensions.get('window').width;
const EditProfileScreen = ({navigation, route}: EditProfileScreenProps) => {
    const {user} = route.params;

    useEffect(() => {
        console.log(user);
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarHolder}>
                    <Image
                        source={require('../../assets/images/avatar.png')}
                        style={styles.avatar}
                    />
                    <View style={styles.editButton}>
                        <FontAwesomeIcon
                            icon={faEdit}
                            size={20}
                            color={'black'}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.inputSection}>
                <View style={styles.inputHolder}>
                    <Text style={styles.infoText}>First Name:</Text>
                    <TextInput value={user.firstName} style={styles.input} />
                </View>
                <View style={styles.inputHolder}>
                    <Text style={styles.infoText}>Last Name:</Text>
                    <TextInput value={user.lastName} style={styles.input} />
                </View>
                <View style={styles.inputHolder}>
                    <Text style={styles.infoText}>Email:</Text>
                    <TextInput value={user.email} style={styles.input} />
                </View>
                <View style={styles.inputHolder}>
                    <Text style={styles.infoText}>Address:</Text>
                    <TextInput
                        value={user.address.street}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputHolder}>
                    <Text style={styles.infoText}>City:</Text>
                    <TextInput value={user.address.city} style={styles.input} />
                </View>
                <View style={styles.inputHolder}>
                    <Text style={styles.infoText}>State:</Text>
                    <TextInput
                        value={user.address.state}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputHolder}>
                    <Text style={styles.infoText}>Address:</Text>
                    <TextInput
                        value={user.address.ZIPcode}
                        style={styles.input}
                    />
                </View>
            </View>
            <View style={styles.submitHolder}>
                <TouchableOpacity style={styles.submit}>
                    <FontAwesomeIcon icon={faSave} color={'white'} size={20} />
                    <Text
                        style={{color: 'white', marginLeft: 10, fontSize: 20}}>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
    avatarHolder: {
        position: 'relative',
    },
    editInfoHolder: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    infoText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    input: {
        width: width * 0.5,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    textHolder: {
        width: width * 0.4,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 25,
    },
    inputHolder: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputSection: {
        gap: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitHolder: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        placeItems: 'center',
    },
    submit: {
        width: '80%',
        backgroundColor: '#1FAFBF',
        padding: 12,
        color: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditProfileScreen;
