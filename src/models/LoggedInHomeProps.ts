import {ButtonData} from './ButtonData';

export interface LoggedInHomeProps {
    navigation: any;
    buttonDataAfterLogin: ButtonData[];
    getIconSize: () => number;
}
