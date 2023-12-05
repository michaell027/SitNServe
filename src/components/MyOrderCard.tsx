import React from 'react';
import {Image, Text, View} from 'react-native';
import {faInfo, faReceipt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {styled} from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

interface Order {
    name: string;
    description: string;
    price: number;
}
const MyOrderCard = ({order}: {order: Order}) => {
    return (
        <StyledView
            className={'flex flex-row rounded-xl p-2 mb-2 border-2 w-full'}>
            <StyledView className="mr-2">
                <StyledView className="pl-1 pt-1">
                    <FontAwesomeIcon icon={faReceipt} size={15} />
                </StyledView>
            </StyledView>
            <StyledView className="flex-1 flex-row justify-between items-center">
                <StyledView className="flex-row">
                    <StyledImage
                        source={require('../../assets/images/breakfast2.png')}
                        className="rounded-2xl"
                        style={{width: 75, height: 75}}
                    />
                    <StyledView className="ml-2">
                        <StyledText className="text-lg font-bold">
                            {order.name}
                        </StyledText>
                        <StyledText className="text-sm">
                            {order.description}
                        </StyledText>
                        <StyledText className="text-sm">{`$${order.price.toFixed(
                            2,
                        )}`}</StyledText>
                    </StyledView>
                </StyledView>
                <StyledView className="flex mr-4 p-1 rounded-full border-2">
                    <FontAwesomeIcon icon={faInfo} />
                </StyledView>
            </StyledView>
        </StyledView>
    );
};

export default MyOrderCard;
