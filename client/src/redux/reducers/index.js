import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import theme from "./themReducer";
export default combineReducers({
  auth,
  alert,
  theme,
});
