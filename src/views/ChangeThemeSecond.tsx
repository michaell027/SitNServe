import React from 'react';

import {styled, useColorScheme, withExpoSnack} from 'nativewind';

import {Button, Pressable, Text} from 'react-native';

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

function ChangeThemeSecond() {
    const {colorScheme, toggleColorScheme} = useColorScheme();
    //   useEffect(() => {
    //     const colorScheme = Appearance.getColorScheme();
    //
    //     if (colorScheme == 'dark') {
    //         toggleColorScheme('dark');
    //     } if (colorScheme == 'light') {
    //         toggleColorScheme('light');
    //     }
    //
    //     const subscription = Appearance.addChangeListener(({ colorScheme }) => {
    //           if (colorScheme == 'dark') {
    //               toggleColorScheme('dark');
    //           } if (colorScheme == 'light') {
    //               toggleColorScheme('light');
    //           }
    //     });
    //
    //     return () => {
    //       subscription.remove();
    //     };
    //   }, []);

    return (
        <StyledPressable
            onPress={toggleColorScheme}
            className="flex-1 items-center justify-center dark:bg-slate-800">
            <StyledText selectable={false} className="text-black dark:text-white">
                {`Try clicking me! ${colorScheme === 'dark' ? '🌙' : '🌞'}`}
            </StyledText>
            <Text className="text-black dark:text-white">aaaaaaaaaaaa</Text>
            <Button className="bg-red-300" title="aaa"/>
        </StyledPressable>
    );
}

export default withExpoSnack(ChangeThemeSecond);
