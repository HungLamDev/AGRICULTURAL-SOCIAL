import { PROFILE_TYPES } from "../actions/profileAction";

const initialState = {
  loading: false,
  users: [],
  posts: [],
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_TYPES.LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case PROFILE_TYPES.GET_USER:
      if (!state.users.find((user) => user._id === action.payload.user._id)) {
        return {
          ...state,
          users: [...state.users, action.payload.user],
        };
      }
      return state;
    case PROFILE_TYPES.FOLLOW:
      return {
        ...state,
        users: state.users.map((user) =>
          user && user._id === action.payload?._id ? action.payload : user
        ),
      };

    case PROFILE_TYPES.UNFOLLOW:
      return {
        ...state,
        users: state.users.map((user) =>
          user && user._id === action.payload?._id ? action.payload : user
        ),
      };
    default:
      return state;
  }
};

export default profileReducer;
