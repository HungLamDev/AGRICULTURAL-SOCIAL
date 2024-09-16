import { GLOBALTYPES } from "../actions/globalTypes";
const initialState = {
  user: null,
  token: null,
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.AUTH:
      return {
        ...state,
        user: action.payload.user || state.user,
        token: action.payload.token || state.token,
      };

    default:
      return state;
  }
};
export default authReducer;
