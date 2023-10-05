import React from 'react';
import { View, Text, Image, Pressable, Dimensions, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGear, faInfo, faUser, faUtensils, faMap, faQrcode } from '@fortawesome/free-solid-svg-icons';

const StyledView = styled(View)
const StyledText = styled(Text)

const screenWidth = Dimensions.get('window').width;

function getIconSize() {
  if (screenWidth <= 640) {
    return 20;
  } else if (screenWidth <= 768) {
    return 40;
  } else {
    return 50;
  }
}

const buttonData = [
    { icon: faInfo, text: 'About', navigate: 'Home' },
    { icon: faUtensils, text: 'Restaurants', navigate: 'Restaurants' },
    { icon: faMap, text: 'Map', navigate: 'ChangeTheme' },
    { icon: faQrcode, text: 'Scan', navigate: 'ChangeThemeSecond' },
    { icon: faGear, text: 'Settings' },
    { icon: faUser, text: 'My profile' }
];

function HomeScreen({ navigation }) {
  return (
    <ScrollView>
        <StyledView className={('flex-1 min-h-[90vh] items-center justify-start')}>
            <StyledView className={('h-[10%] w-full py-4')}>
                <Image source={require('./../../assets/images/logo-no-background.png')} className={('h-full self-center')} resizeMode="contain" />
            </StyledView>
            <StyledView className={('w-full h-[90%] items-center')}>
                <StyledView className='max-h-[60%] w-full'>
                    <Image source={require('./../../assets/images/background.png')} className={('w-full h-full')} resizeMode="contain" />
                </StyledView>
                <StyledView className={('max-h-[30%] flex-row flex-wrap justify-between')}>
                    {buttonData.map((button, index) => (
                        <StyledView key={index} className='w-1/3 items-center justify-center py-2'>
                            <Pressable onPress={() => navigation.navigate(button.navigate)}
                            className={('items-center justify-center p-5 sm:p-8 rounded-full border-4 border-black')}>
                                <FontAwesomeIcon icon={button.icon} size={getIconSize()} color="black" />
                            </Pressable>
                            <Text className={('text-black font-bold tracking-wider')}>{button.text}</Text>
                        </StyledView>
                    ))}
                </StyledView>
            </StyledView>
        </StyledView>
      </ScrollView>
  );
}

export default HomeScreen;
