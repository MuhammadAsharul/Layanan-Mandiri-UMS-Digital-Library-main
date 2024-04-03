import axios from 'axios';
import { baseApi as baseURL } from '../services/Config';
import baseAPI from '../utils/axiosConfig';



const Get = async (path) => {
    try {
        const res = await baseAPI.baseAPI.get(`${baseURL}${path}`);

        return res;

    } catch (err) {
        console.log("error req get: ", err.res.data);
        throw err;
    }
}

export default Get;