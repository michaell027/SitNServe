import React, {useRef, useState} from 'react';
import {View, FlatList, Animated} from 'react-native';
import aboutInfo from './../data/aboutInfo';
import CarouselItem from './CarouselItem';
import Pagination from './Pagination';

interface CarouselProps {}

const Carousel: React.FC<CarouselProps> = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleScroll = (event: any) => {
        Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: {
                            x: scrollX,
                        },
                    },
                },
            ],
            {
                useNativeDriver: false,
            },
        )(event);
    };

    const handleViewableItemsChanged = useRef(
        ({viewableItems}: {viewableItems: any[]}) => {
            setCurrentIndex(viewableItems[0].index);
        },
    ).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    return (
        <View>
            <FlatList
                data={aboutInfo}
                renderItem={({item}) => <CarouselItem item={item} />}
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                onScroll={handleScroll}
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
            <Pagination
                data={aboutInfo}
                scrollX={scrollX}
                index={currentIndex}
            />
        </View>
    );
};

export default Carousel;
