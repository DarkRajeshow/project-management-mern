import axios from 'axios';

const BASE_URL = 'https://www.universal-tutorial.com/api';
const API_TOKEN = 'wLPJ_pijBdNKvkPEBzyVZsOE_HmMo820Sgh2ReV6v65tfWISyKOCOK3R0n1ku8-mV30'; // Replace this with your actual API token
const EMAIL = 'rajannaadeli@gmail.com';

axios.defaults.baseURL = BASE_URL;

// Function to get authentication token
const getAuthToken = async () => {
    try {
        const response = await axios.get('/getaccesstoken', {
            headers: { "api-token": API_TOKEN, "user-email": EMAIL }
        });
        return response.data.auth_token;
    } catch (error) {
        console.error('Error fetching auth token:', error);
        throw error;
    }
};

export const fetchStates = async () => {
    const token = await getAuthToken();
    try {
        const response = await axios.get('/states/India', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching states:', error);
        throw error;
    }
};

export const fetchCities = async (state) => {
    const token = await getAuthToken();
    try {
        const response = await axios.get(`/cities/${state}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};
