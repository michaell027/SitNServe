import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ).then(granted => {
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    Geolocation.getCurrentPosition(
                        position => {
                            resolve({status: 'granted', position});
                        },
                        error => {
                            reject(error);
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 15000,
                            maximumAge: 10000,
                        },
                    );
                } else {
                    resolve({status: 'denied'});
                }
            });
        } else {
            Geolocation.getCurrentPosition(
                position => {
                    resolve({status: 'granted', position});
                },
                error => {
                    reject(error);
                },
                {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            );
        }
    });
}
