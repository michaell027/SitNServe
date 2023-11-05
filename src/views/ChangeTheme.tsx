import React from 'react';
import {useState} from 'react';
import type {Node} from 'react';
import {withExpoSnack} from 'nativewind';
import {Pressable} from 'react-native';
import {styled} from 'nativewind';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    useColorScheme,
    View,
    Button,
} from 'react-native';

import {
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

const Section = ({children, title}): Node => {
    return (
        <View className="mt-12 px-2">
            <Text className="text-2xl text-black dark:text-white">{title}</Text>
            <Text className="mt-2 text-lg text-black dark:text-white">
                {children}
            </Text>
        </View>
    );
};

const ChangeTheme: () => Node = () => {
    const {colorScheme, toggleColorScheme} = useColorScheme();
    const darkMode = useColorScheme() === 'dark' ? 'dark' : 'light';
    const [isDarkMode, setIsDarkMode] = useState(useColorScheme() === darkMode); // set initial state based on system preference
    const toggleTheme = () => setIsDarkMode(!isDarkMode); // function to toggle theme

    const backgroundStyle = 'bg-neutral-300 dark:bg-slate-900';

    return (
        <SafeAreaView className={backgroundStyle}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                className={backgroundStyle}>
                <Header />
                <View className="bg-white dark:bg-black">
                    <Section title="Step One">
                        Edit{' '}
                        <Text className="font-bold text-black dark:text-white">
                            App.js
                        </Text>{' '}
                        to change this screen and then come back to see your
                        edits.
                    </Section>
                    <Section title="See Your Changes">
                        <ReloadInstructions />
                    </Section>
                    <Section title="Debug">
                        <DebugInstructions />
                    </Section>
                    <Section title="Learn More">
                        Read the docs to discover what to do next:
                    </Section>
                    <LearnMoreLinks />
                </View>
                <Button
                    title={
                        isDarkMode
                            ? 'Switch to Light Mode'
                            : 'Switch to Dark Mode'
                    }
                    onPress={toggleTheme}
                    color={isDarkMode ? '#FFFFFF' : '#000000'}
                />
                <StyledPressable
                    onPress={toggleColorScheme}
                    className="flex-1 items-center justify-center dark:bg-slate-800">
                    <StyledText selectable={false} className="dark:text-white">
                        {`Try clicking me! ${
                            colorScheme === 'dark' ? '🌙' : '🌞'
                        }`}
                    </StyledText>
                </StyledPressable>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChangeTheme;
