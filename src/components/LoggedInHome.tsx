import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
    faUtensils,
    faUser,
    faCalendarAlt,
    faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import {styled} from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

function LoggedInHome({navigation, buttonDataAfterLogin, getIconSize}) {
    const [isLogged, setIsLogged] = React.useState(true);
    return (
        <StyledView className="flex-1 h-[90vh] items-center justify-start">
            <StyledView className={'h-[10%] w-full py-4'}>
                <Image
                    source={require('./../../assets/images/logo-no-background.png')}
                    className={'h-full self-center'}
                    resizeMode="contain"
                />
            </StyledView>
            <StyledView className={'w-full h-[90%] items-center'}>
                <StyledView className="max-h-[60%] w-full">
                    <Image
                        source={require('./../../assets/images/table.png')}
                        className={'w-full h-full'}
                        resizeMode="contain"
                    />
                </StyledView>

                <StyledView
                    className={
                        'max-h-[30%] flex-row flex-wrap justify-between'
                    }>
                    {buttonDataAfterLogin?.map((button, index) => (
                        <StyledView
                            key={index}
                            className="w-1/3 items-center justify-center py-2">
                            <Pressable
                                onPress={() =>
                                    navigation.navigate(button.navigate)
                                }
                                className={
                                    'items-center justify-center p-5 sm:p-8 rounded-full border-4 border-black'
                                }>
                                <FontAwesomeIcon
                                    icon={button.icon}
                                    size={getIconSize()}
                                    color="black"
                                />
                            </Pressable>
                            <Text
                                className={
                                    'text-black font-bold tracking-wider'
                                }>
                                {button.text}
                            </Text>
                        </StyledView>
                    ))}
                </StyledView>
            </StyledView>
        </StyledView>
    );
}

export default LoggedInHome;
