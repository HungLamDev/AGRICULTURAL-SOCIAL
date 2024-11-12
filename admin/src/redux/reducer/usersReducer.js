import { USERS_LOADING } from "../actions/usersAction";

const initialState = {
  users: [],
  user: [],
  loadingUser: false,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case USERS_LOADING.LOADING_USER:
      return {
        ...state,
        loadingUser: action.payload,
      };
    case USERS_LOADING.GET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case USERS_LOADING.GET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case USERS_LOADING.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
      };
    default:
      return state;
  }
};

export default usersReducer;
