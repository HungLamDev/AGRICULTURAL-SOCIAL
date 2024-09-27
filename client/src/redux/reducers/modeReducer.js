import { GLOBALTYPES } from "../../redux/actions/globalTypes";
const initialState = false;

const modeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.MODE:
      return action.payload;
    default:
      return state;
  }
};

export default modeReducer;
