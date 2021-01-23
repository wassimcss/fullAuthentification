import { GET_TOKEN } from "../actions/Types"

const  token=""


const tokenReducer  = (state = token, { type, payload }) => {
    switch (type) {

    case GET_TOKEN:
        return payload;

    default:
        return state
    }
}
export default tokenReducer 
