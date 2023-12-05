import {Address} from './Address';

export interface User {
    uid: string;
    email: string;
    password: string;
    repeatPassword: string;
    address: Address;
    firstName: string;
    lastName: string;
    phone: string;
}
