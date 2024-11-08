import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = []; 

const OnlineReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.ONLINE: 
      return [...state, action.payload]; 
    
    case GLOBALTYPES.OFFLINE: // Handle user going offline
      return state.filter(item => item !== action.payload); 
    
    default:
      return state; // Return the current state for unrecognized actions
  }
};

export default OnlineReducer;
