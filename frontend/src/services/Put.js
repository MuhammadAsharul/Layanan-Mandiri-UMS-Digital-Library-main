import { baseApi as baseURL } from '../services/Config';
import baseAPI from '../utils/axiosConfig';

const Put = async (path, data) => {
    try {
        const res = await baseAPI.baseAPI.put(`${baseURL}${path}`, data);
        return res;

    } catch (err) {
        console.log("error req put: ", err.res.data);
        throw err;
    }
}

export default Put;