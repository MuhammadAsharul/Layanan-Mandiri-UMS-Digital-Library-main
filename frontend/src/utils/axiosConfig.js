import axios from 'axios';
import { baseApi as baseURL } from '../services/Config';
import Cookies from '../utils/cookies';

axios.defaults.headers['Content-Type'] = 'application/json';

const baseAPI = axios.create({
  baseURL,
});

baseAPI.interceptors.request.use(
  (config) => {
    const token = Cookies.getCookies('CERT');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    else {
      Cookies.delCookies('CERT');
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    throw error;
  },
);

baseAPI.interceptors.response.use(
  (response) => response.data,
  (error) => {
    switch (error.response.status) {
      case 401:
        Cookies.delCookies('CERT');
        break;
      default:
        break;
    }
    throw error?.response?.data?.error ?? error;
  },
);
    

export default { baseAPI };