import { GET_ALL_USERS } from "../actions/Types"


   const  users=[];

const usersReducer = (state=users,action) => {
    switch (action.type){
        case GET_ALL_USERS:
           return action.payload
        default:
            return state 

    }
    
}
export default usersReducer