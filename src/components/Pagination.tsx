import React from 'react';
import {View, StyleSheet, Animated, Dimensions} from 'react-native';

const {width} = Dimensions.get('screen');

interface Item {
    mainTitle: string;
    mainSubTitle: string;
    image: any; // you should replace 'any' with the correct type for your image
    title: string;
    description: string;
    buttonTitle: string | number;
}

interface PaginationProps {
    data: Item[];
    scrollX: Animated.Value;
    index: number;
}

const Pagination: React.FC<PaginationProps> = ({data, scrollX, index}) => {
    return (
        <View style={styles.container}>
            {data.map((_, i) => {
                const inputRange = [
                    (i - 1) * width,
                    i * width,
                    (i + 1) * width,
                ];
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [12, 30, 12],
                    extrapolate: 'clamp',
                });
                const dotBackgroundColor = scrollX.interpolate({
                    inputRange,
                    outputRange: ['#ccc', '#1B3A4B', '#ccc'],
                    extrapolate: 'clamp',
                });
                return (
                    <Animated.View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                width: dotWidth,
                                backgroundColor: dotBackgroundColor,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        height: 12,
        width: 12,
        backgroundColor: '#ccc',
        borderRadius: 6,
        marginHorizontal: 3,
    },
});

export default Pagination;
