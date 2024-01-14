interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    restaurantId: string;
    restaurantName: string;
    restaurantImage: string;
    seat: string;
    total: number;
    date: Date;
    dateFormatDate: Date;
    items: OrderItem[];
}