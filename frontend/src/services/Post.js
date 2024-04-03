import axios from 'axios';
import { baseApi as baseURL } from '../services/Config';
import baseAPI from '../utils/axiosConfig';

const Post = async (path, data) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    try {
        const res = await baseAPI.baseAPI.post(`${baseURL}${path}`, data, config);
        return res;

    } catch (err) {
        console.log("error req post: ", err.res.data);
        throw err;
    }
}

export default Post;

