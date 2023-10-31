import React, { useEffect, useState } from 'react';
import { View, Text, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

function MapScreen({ navigation, route }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const granted = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (PermissionsAndroid.RESULTS.GRANTED === 'granted') {
            console.log('location permission granted');
            Geolocation.getCurrentPosition(
              (position) => {
                console.log(position);
                console.log(position.coords.latitude, position.coords.longitude);
                setPosition(position);
              },
              (error) => {
                console.log(error.code, error.message);
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } else {
            console.log('location permission denied');
        }
      } else {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            console.log(position.coords.latitude, position.coords.longitude);
            setPosition(position);
          },
          (error) => {
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
  }, []);

  return (
    <View>
      <View style={{ marginTop: 16, paddingHorizontal: 8 }}>
        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Location</Text>
        {position && (
        <MapView
            style={{ width: '100%', height: 300 }}
            initialRegion={{
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
        >
            <Marker
              coordinate={{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }}
              title='My Location'
              description='This is my current location'
            />
        </MapView>
        )}
      </View>
    </View>
  );
}

export default MapScreen;

