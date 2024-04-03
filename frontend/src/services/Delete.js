import { baseApi as baseURL } from "./Config";
import baseAPI from "../utils/axiosConfig";


const Delete = async (path, data) => {
    try {
        console.log("data delete", data)
        const res = await baseAPI.baseAPI.delete(`${baseURL}${path}`, data);
        return res;

    } catch (err) {
        console.log("error req delete: ", err.res.data);
        throw err;
    }
}

export default Delete;