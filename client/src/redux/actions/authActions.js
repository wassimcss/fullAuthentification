import axios from "axios";
import { LOGIN,GET_USER } from "./Types";

export const login = () => ({
    type: LOGIN   
})

export const fetchUser = async (token) => {
    const res = await axios.get('/user/info', {
        headers: {authtoken: token}
    })

    return res
}

export const getUser = (res) => {
    return {
        type:GET_USER,
        payload: {
            user: res.data,
            isAdmin: res.data.role === 1 ? true : false
        }
    }
}