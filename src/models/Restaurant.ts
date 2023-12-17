import {Address} from './Address';

interface MenuItem {
    name: string;
    price: number;
}

export interface OpeningHours {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
}

export interface Restaurant {
    id?: string;
    name: string;
    description: string;
    address: Address;
    imageUrl: string;
    openingHours: OpeningHours;
    menu?: MenuItem[];
    rating?: number;
}
