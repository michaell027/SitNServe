/**
 * @format
 */
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { firebase } from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

// Request permissions for notification
PushNotification.requestPermissions();

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
    onRegister: function (token) {
        console.log('token:', token);
    },
    onNotification: function (notification) {
        console.log('ntf:', notification);
        // notification.finish(); // No need to call finish for Android
    },
    onAction: function (notification) {
        console.log('act:', notification.action);
        console.log('ntfact:', notification);
    },
    onRegistrationError: function (err) {
        console.error(err.message, err);
    },
    popInitialNotification: true,
    requestPermissions: true,
});

// Handle FCM token registration
messaging()
    .getToken()
    .then((token) => {
        console.log('FCM Token:', token);
    })
    .catch((error) => {
        console.error('Error getting FCM token:', error);
    });

// Handle FCM message background/terminated state
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
});

// Check permissions and log the status
PushNotification.checkPermissions((permissions) => {
    console.log('Permissions:', permissions);
});

// Register the main component
AppRegistry.registerComponent(appName, () => App);
