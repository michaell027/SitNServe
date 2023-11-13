import axios from 'axios';

const API_URL_COUNTRIES =
    'https://countriesnow.space/api/v0.1/countries/capital';

const API_URL_CITIES = 'https://countriesnow.space/api/v0.1/countries/cities';

interface City {
    name: string;
    lat: number;
    lng: number;
}

export interface Country {
    country: string;
    capital: string;
}

const getCountries = async (): Promise<Country[]> => {
    try {
        const {data} = await axios.get(API_URL_COUNTRIES);
        return data.data;
    } catch (error) {
        throw new Error(error);
    }
};

const getCitiesInCountry = async (country: string) => {
    try {
        const response = await axios.post(API_URL_CITIES, {
            country: country.toLowerCase(),
        });

        const cities = response.data.data;
        return cities;
    } catch (error) {
        throw new Error(error);
    }
};

export {getCountries, getCitiesInCountry};
