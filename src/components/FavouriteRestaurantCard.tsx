import {Image, Pressable, Text, TouchableOpacity, View} from 'react-native';
import {Restaurant} from '../models/Restaurant';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faLocationDot, faStar} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import CheckBox from '@react-native-community/checkbox';
import {styled, StyledComponent} from 'nativewind';

const StyledPressable = styled(Pressable);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

export function FavouriteRestaurantCard({
    restaurant,
    deleteOneRestaurant,
    multipleSelection,
    selected,
    toggleRestaurant,
}: {
    restaurant: Restaurant;
    deleteOneRestaurant: (restaurant: Restaurant) => void;
    multipleSelection: boolean;
    selected: boolean;
    toggleRestaurant: (restaurant: Restaurant) => void;
}) {
    return (
        <StyledPressable
            onLongPress={() => toggleRestaurant(restaurant)}
            className={
                'flex flex-row p-4 bg-white rounded-xl w-full mb-4 shadow-lg'
            }>
            <StyledImage
                className={'rounded-xl'}
                source={{uri: restaurant.imageUrl}}
                width={100}
                height={150}
            />
            <StyledView className={'flex flex-1 flex-row justify-between pl-4'}>
                <StyledView className={'w-full'}>
                    <StyledText className={'text-3xl font-bold'}>
                        {restaurant.name}
                    </StyledText>
                    <StyledView className={'flex flex-row items-center'}>
                        <FontAwesomeIcon
                            icon={faLocationDot}
                            color={'orange'}
                            size={20}
                        />
                        <StyledText className={'text-xl mx-2'}>
                            {restaurant.address.street}
                        </StyledText>
                        <StyledText className={'text-xl'}>
                            {restaurant.address.number}
                        </StyledText>
                    </StyledView>
                    <StyledView
                        className={'flex flex-row items-center w-full my-2'}>
                        <StyledView
                            className={
                                'h-[7px] w-[7px] bg-gray-200 rounded-full'
                            }></StyledView>
                        <StyledView
                            className={
                                'h-[5px] mx-2 flex-1 bg-gray-200 rounded-full'
                            }></StyledView>
                        <StyledView
                            className={
                                'h-[7px] w-[7px] bg-gray-200 rounded-full'
                            }></StyledView>
                    </StyledView>
                    <StyledText className={'text-xl'}>
                        {restaurant.description}
                    </StyledText>
                </StyledView>
                <StyledPressable className={'absolute right-0 top-0'}>
                    {multipleSelection ? (
                        <CheckBox
                            disabled={false}
                            value={selected}
                            onValueChange={() => toggleRestaurant(restaurant)}
                            tintColors={{true: 'orange', false: 'orange'}}
                        />
                    ) : (
                        <Pressable
                            onPress={() => deleteOneRestaurant(restaurant)}>
                            <FontAwesomeIcon
                                icon={faStar}
                                color={'orange'}
                                size={25}
                            />
                        </Pressable>
                    )}
                </StyledPressable>
            </StyledView>
        </StyledPressable>
    );
}
