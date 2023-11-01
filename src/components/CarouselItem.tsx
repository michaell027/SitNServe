import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Button } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('screen');

interface CarouselItemProps {
    item: {
        mainTitle: string;
        mainSubTitle: string;
        image: any;
        title: string;
        description: string;
        buttonTitle: string | number;
    };
}

const CarouselItem: React.FC<CarouselItemProps> = ({ item }) => {
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Text style={styles.mainTitle}>{item.mainTitle}</Text>
                <Text style={styles.mainSubTitle}>{item.mainSubTitle}</Text>
            </View>
            <View style={styles.imageHolder}>
                <Image source={item.image} resizeMode="contain" style={styles.image}></Image>
            </View>
            <LinearGradient
                colors={['rgba(85, 204, 204, 0.8)', 'rgba(255, 255, 255, 0.8)', 'rgba(250, 250, 210, 0.8)']}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 0.5, y: 0.0 }}
                locations={[0.1, 0.5, 0.9]}
                style={styles.content}
            >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Button title={item.buttonTitle.toString()} onPress={() => {}} color="#1B3A4B" />
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width,
        height,
        alignItems: 'center',
        marginVertical: 25,
    },
    image: {
        height: '90%',
        width: '100%',
        borderRadius: 25,
    },
    content: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '90%',
        borderRadius: 25,
        zIndex: 0,
        top: '-20%',
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    description: {
        fontSize: 18,
        marginVertical: 12,
        color: '#333',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    mainSubTitle: {
        fontSize: 17,
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    imageHolder: {
        flex: 0.3,
        width: '50%',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    topContainer: {
        flex: 0.1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default CarouselItem;
