export interface ReservationSlot {
    user: string;
    occupied: boolean;
}

export interface ReservationDay {
    [timeSlot: string]: ReservationSlot;
}

export interface ReservationData {
    id: string;
    reserved: {
        [date: string]: ReservationDay;
    };
}

export interface Table {
    id?: number;
    seats: number;
    table: number;
}

export interface Reservation {
    id: string;
    restaurant: string;
    date: string;
    times: string[];
    tableId: string;
    imageUrl: string;
}
