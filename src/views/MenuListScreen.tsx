import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';

interface RestaurantIdAndSeat {
  restaurant_id: string;
  seat: number;
}

interface Route {
  params: {
    restaurantIdAndSeat: RestaurantIdAndSeat;
  };
}

interface MenuItem {
  name: string;
  price: string;
}

interface Props {
  navigation: any;
  route: Route;
}

const MenuListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { restaurantIdAndSeat } = route.params;
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const doc = await firestore().collection('restaurants').doc(restaurantIdAndSeat.restaurant_id).get();
        if (doc.exists) {
          setMenuItems(doc.data()!.menu);
          console.log('Document data:', doc.data()!.menu);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRestaurantData();
  }, [restaurantIdAndSeat]);

  return (
    <ScrollView>
      <View className={'space-y-2 p-2'}>
        {menuItems.map((item, index) => (
          <View key={index} className={'flex w-full flex-row p-2 bg-[#DDDDDD] rounded-xl items-center'}>
            <View className={'w-1/5 items-center justify-center bg-white rounded-xl'}>
              <Image source={require('./../../assets/images/menu/coca_cola.png')} style={{ height: 80 }} resizeMode="contain" />
            </View>
            <Text className={'w-2/5 text-lg font-bold pl-2'}>{item.name}</Text>
            <View className={'w-2/5 flex flex-row items-center justify-center space-x-8'}>
              <Text className={'text-lg'}>{item.price}€</Text>
              <Pressable>
                <FontAwesomeIcon icon={faCartPlus} size={30} />
              </Pressable>
            </View>
          </View>
        ))}
        <Text>MenuListScreen</Text>
        <Text>{restaurantIdAndSeat.restaurant_id}</Text>
        <Text>{restaurantIdAndSeat.seat}</Text>
      </View>
    </ScrollView>
  );
};

export default MenuListScreen;
