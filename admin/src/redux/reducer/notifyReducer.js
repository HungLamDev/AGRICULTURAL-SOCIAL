import { GLOBALTYPES } from "../actions/globalTyle";

const initialState = {};

const notifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.NOTIFY:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default notifyReducer;
