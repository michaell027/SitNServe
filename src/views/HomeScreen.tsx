import React from 'react';
import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars, faHouse, faInfo, faPaintBrush } from '@fortawesome/free-solid-svg-icons';

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
    { icon: faBars, text: 'Home', navigate: 'Home' },
    { icon: faHouse, text: 'Profile', navigate: 'Details' },
    { icon: faInfo, text: 'Likes', navigate: 'ChangeTheme' },
    { icon: faPaintBrush, text: 'Messages', navigate: 'ChangeThemeSecond' },
    { icon: faPaintBrush, text: 'Settings' },
    { icon: faHouse, text: 'Favorites' }
];

function HomeScreen({ navigation }) {
  return (
    <StyledView className={('flex-1 max-h-screen items-center sm:space-y-6 justify-start ')}>
        <StyledView className='h-12 sm:h-24'>
            <Image source={require('./../../assets/images/logo-no-background.png')} className={('h-full self-center mt-4')} resizeMode="contain" />
        </StyledView>
        <StyledView className={('w-full h-full items-center')}>
            <StyledView className='h-1/2 sm:h-3/5 w-full'>
                <Image source={require('./../../assets/images/background.png')} className={('w-full h-full')} resizeMode="contain" />
            </StyledView>
            <StyledView className={('h-1/2 sm:h-2/5 flex-row flex-wrap justify-between sm:space-y-8')}>
                {buttonData.map((button, index) => (
                    <StyledView key={index} className='w-1/3 items-center justify-center my-2'>
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
  );
}

export default HomeScreen;
