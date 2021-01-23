import { GET_USER, LOGIN } from "../actions/Types";

const initialState = {
  isLogged: false,
  isAdmin: false,
  user: [],
};

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOGIN:
      return { ...state, isLogged: true };
    case GET_USER:
      return { ...state, user: payload.user, isAdmin: payload.isAdmin };

    default:
      return state;
  }
};
export default authReducer;
