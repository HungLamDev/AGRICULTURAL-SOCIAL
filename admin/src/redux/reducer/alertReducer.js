// reducers/alertReducer.js
import { GLOBALTYPES } from "../actions/alertActions";

const initialState = {
  success: null,
  error: null,
  loading: false,
};


const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.ALERT:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default alertReducer;