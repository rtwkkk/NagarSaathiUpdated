import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const subscribeUser = async (userData: {
    phone_number: string;
    state: string;
    district: string;
    city: string;
    ward: string;
}) => {
    return await axios.post(`${API_BASE_URL}/subscribe`, userData);
};

export const createAlert = async (alertData: {
    title: string;
    message: string;
    alert_type: string;
    target_area: any;
}) => {
    return await axios.post(`${API_BASE_URL}/alerts/create`, alertData);
};

export const verifyAlert = async (alertId: number, verifiedBy: string) => {
    return await axios.post(`${API_BASE_URL}/alerts/verify`, { alertId, verifiedBy });
};

export const fetchPendingAlerts = async () => {
    return await axios.get(`${API_BASE_URL}/alerts/pending`);
};
