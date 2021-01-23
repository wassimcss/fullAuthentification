import axios from "axios";
import { GET_ALL_USERS } from "./Types";

export const fetchAllUsers = async(token) => {
    const res = await axios.get("/user/all_info",{headers:{authtoken:token}})
    return res;
}

export const getAllUsers = (res) => ({
    type: GET_ALL_USERS,
    payload : res.data
})

