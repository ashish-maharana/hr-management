import axios from 'axios';

const token = localStorage.getItem('token');

const ApiClient = axios.create({
    baseURL: process.env.MIX_APP_URL,
    withCredentials: true,
    headers: token?{ Accept: 'application/json', Authorization: 'Bearer ' + token } : { Accept: 'application/json' }
});

export default ApiClient;
