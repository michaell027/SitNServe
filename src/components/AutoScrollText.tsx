import React from 'react';
import {View, Text} from 'react-native';
import {styled} from 'nativewind';

const StyledView = styled(View);

function AutoScrollText() {
    return (
        <StyledView className="auto-scroll-text">
            <Text>Auto Scroll Text</Text>
        </StyledView>
    );
}

export default AutoScrollText;
