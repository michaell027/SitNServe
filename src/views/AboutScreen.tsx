import React from 'react';
import { View, Text, Image, Button } from 'react-native';

export default function AboutScreen() {
    return (
        <View style={{ flex: 1, padding: 10 }}>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Text style={{ fontSize: 30, color: 'black', fontWeight: 'bold' }}>Sitn'serve</Text>
                <Text style={{ fontSize: 16, color: 'gray' }}> Where your table waits and the choice is yours.</Text>
            </View>

            <View style={{ flex: 1, justifyContent: 'start', alignItems: 'center' }}>
                <Image
                    source={require('./../../assets/images/plate_mobile.png')}
                    style={{ width: '70%', height: '50%', resizeMode: 'contain' }}
                    className="rounded-3xl"
                />

                <View className='bg-blue-200' style={{ marginVertical: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#E63946' }}>Great taste, great sensation</Text>
                    <Text style={{ fontSize: 16, color: 'gray', textAlign: 'center' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore</Text>

                    <Button
                        title="GET STARTED"
                        onPress={() => {}}
                        color="#E63946"
                    />
                </View>


            </View>
        </View>
    );
}
