import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faGears,
    faPhone,
    faAt,
    faLocationDot,
    faHeart,
    faCreditCard,
    faBagShopping,
    faChair,
    faRightFromBracket,
    faStar,
} from '@fortawesome/free-solid-svg-icons';
import {User} from '../models/User';

interface ProfileCardProps {
    user: User;
    setUser: any;
    navigation: any;
}

const ProfileCard = ({user, setUser, navigation}: ProfileCardProps) => {
    const [structuredAddress, setStructuredAddress] = useState<string>('');

    useEffect(() => {
        const address = user.address;
        const structuredAddress = `${address.street} ${address.number}, ${address.city}, ${address.state}, ${address.zip}`;
        setStructuredAddress(structuredAddress);
    }, [user]);

    function signOut() {
        auth()
            .signOut()
            .then(async () => {
                await AsyncStorage.removeItem('user_uid');
                setUser(null);
            });
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.profileCard}>
                    <View style={styles.header}>
                        <Image
                            source={require('../../assets/images/avatar.png')}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.name}>
                                {user?.firstName} {user?.lastName}
                            </Text>
                            <Text style={styles.username}>
                                @{user.firstName.toLowerCase()}
                                {user.lastName.toLowerCase()}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.information}>
                        <FontAwesomeIcon icon={faPhone} size={20} />
                        <Text>{user.phone}</Text>
                    </View>
                    <View style={styles.information}>
                        <FontAwesomeIcon icon={faAt} size={20} />
                        <Text>{user.email}</Text>
                    </View>
                    <View style={styles.information}>
                        <FontAwesomeIcon icon={faLocationDot} size={20} />
                        <Text>{structuredAddress}</Text>
                    </View>

                    <View style={styles.dividerHolder}>
                        <View style={styles.firstColumn}>
                            <Text style={styles.dividerTitle}>
                                Member since
                            </Text>
                            <Text style={styles.dividerText}>
                                {user.creationDate}
                            </Text>
                        </View>
                        <View style={styles.secondColumn}>
                            <Text style={styles.dividerTitle}>Orders</Text>
                            <Text style={styles.dividerText}>12</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.touchable}
                        onPress={() =>
                            navigation.navigate('FavoriteRestaurantsScreen')
                        }>
                        <FontAwesomeIcon icon={faHeart} size={20} />
                        <Text style={styles.touchableText}>Favourite</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchable}>
                        <FontAwesomeIcon icon={faCreditCard} size={20} />
                        <Text style={styles.touchableText}>
                            Payment methods
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('OrdersScreen')}
                        style={styles.touchable}>
                        <FontAwesomeIcon icon={faBagShopping} size={20} />
                        <Text style={styles.touchableText}>My orders</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ReservationsScreen', {
                                userUid: user.uid,
                            })
                        }
                        style={styles.touchable}>
                        <FontAwesomeIcon icon={faChair} size={20} />
                        <Text style={styles.touchableText}>
                            My reservations
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchable}>
                        <FontAwesomeIcon icon={faStar} size={20} />
                        <Text style={styles.touchableText}>Reviews</Text>
                    </TouchableOpacity>
                    <View style={styles.bottomSection}>
                        <TouchableOpacity style={styles.editProfileButton}>
                            <FontAwesomeIcon
                                icon={faGears}
                                color="#fff"
                                size={20}
                            />
                            <Text style={styles.editProfileButtonText}>
                                Edit Profile
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.signoutButton}
                            onPress={signOut}>
                            <FontAwesomeIcon
                                icon={faRightFromBracket}
                                color={'#fff'}
                                size={20}
                            />
                            <Text style={styles.signoutButtonText}>
                                Sign Out
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default ProfileCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    username: {
        fontSize: 14,
        color: '#666',
    },
    information: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        marginTop: 15,
    },
    dividerHolder: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
        paddingBottom: 5,
        borderTopColor: '#ccc',
        borderTopWidth: 2,
        paddingTop: 5,
    },
    firstColumn: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        borderRightColor: '#ccc',
        borderRightWidth: 1,
        paddingRight: 5,
    },
    dividerTitle: {
        fontSize: 14,
        color: '#666',
    },
    dividerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondColumn: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        paddingLeft: 5,
        borderLeftColor: '#ccc',
        borderLeftWidth: 1,
    },
    touchable: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        marginTop: 25,
    },
    touchableText: {
        fontSize: 18,
        fontWeight: '400',
        paddingLeft: 5,
    },
    bottomSection: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        borderTopColor: '#ccc',
        borderTopWidth: 2,
        paddingTop: 5,
    },
    editProfileButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#66b7b7',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        gap: 10,
        width: '100%',
    },
    editProfileButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    signoutButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e74c3c',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        gap: 10,
        width: '100%',
    },
    signoutButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});
