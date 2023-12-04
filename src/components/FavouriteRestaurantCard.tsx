import {Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import {Restaurant} from "../models/Restaurant";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faLocation, faLocationDot, faStar} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect} from "react";
import CheckBox from "@react-native-community/checkbox";



export function FavouriteRestaurantCard({ restaurant, deleteOneRestaurant ,multipleSelection, selected, toggleRestaurant }: { restaurant: Restaurant, deleteOneRestaurant: (restaurant: Restaurant) => void, multipleSelection: boolean, selected: boolean, toggleRestaurant: (restaurant: Restaurant) => void }) {
    return (
        <Pressable onLongPress={() => toggleRestaurant(restaurant)} className={"flex flex-row p-4 bg-white rounded-xl w-full mb-4 shadow-lg"}>
            <Image className={"rounded-xl"} source={{uri: restaurant.imageUrl}} width={100} height={150}/>
            <View className={"flex flex-1 flex-row justify-between pl-4"}>
                <View className={"w-full"}>
                    <Text className={"text-3xl font-bold"}>{restaurant.name}</Text>
                    <View className={"flex flex-row items-center"}>
                        <FontAwesomeIcon icon={faLocationDot} color={"orange"} size={20}/>
                        <Text className={"text-xl mx-2"}>{restaurant.address.street}</Text>
                        <Text className={"text-xl"}>{restaurant.address.number}</Text>
                    </View>
                    <View className={"flex flex-row items-center w-full my-2"}>
                        <View className={"h-[7px] w-[7px] bg-gray-200 rounded-full"}></View>
                        <View className={"h-[5px] mx-2 flex-1 bg-gray-200 rounded-full"}></View>
                        <View className={"h-[7px] w-[7px] bg-gray-200 rounded-full"}></View>
                    </View>
                    <Text className={"text-xl"}>{restaurant.description}</Text>
                </View>
                <Pressable className={"absolute right-0 top-0"}>
                    {
                        multipleSelection ? <CheckBox
                            disabled={false}
                            value={selected}
                            onValueChange={() => toggleRestaurant(restaurant)}
                            tintColors={{true: 'orange', false: 'orange'}}
                        /> : (
                            <Pressable onPress={() => deleteOneRestaurant(restaurant)}>
                                <FontAwesomeIcon icon={faStar} color={"orange"} size={25}/>
                            </Pressable>
                        )
                    }
                </Pressable>
            </View>
        </Pressable>
    )
}