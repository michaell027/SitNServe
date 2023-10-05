/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { firebase } from '@react-native-firebase/app';

const firebaseConfig ={  apiKey: "AIzaSyAgFPudbPztCPdJeIfP_P84CSmRMUHeApY",
                         projectId: "sitnserve-fbaed",
                         storageBucket: "sitnserve-fbaed.appspot.com",
                         messagingSenderId: "173217512139	",
                         appId: '1:173217512139:android:8ae68d6b47c8e15989b94e',
                         databaseURL: "https://sitnserve-fbaed.firebaseio.com",
                       };
if (!firebase.apps==undefined) {
    firebase.initializeApp(firebaseConfig);
}

AppRegistry.registerComponent(appName, () => App);
