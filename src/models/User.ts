import {Address} from './Address';
import {Restaurant} from './Restaurant';

export interface User {
    uid: string;
    email: string;
    password?: string;
    repeatPassword?: string;
    address: Address;
    firstName: string;
    lastName: string;
    phone: string;
    favoriteRestaurants?: string[];
    creationDate?: string;
    orders?: number;
}
