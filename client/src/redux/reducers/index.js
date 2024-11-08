import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import theme from "./themReducer";
import profile from "./profileReducer";
import status from "./statusReducer";
import Homepost from "./postReducer";
import detailPost from "./detailPostReducer";
import mode from "./modeReducer";
import newsPost from "./newsPostReducer";
import suggestions from "./suggestionReducer";
import socket from "./socketRenducer";
import notifyUser from "./notifyUserReducer";
import message from "./messageReducer";
import market from "./productReducer";
import online from "./onlineReducer";
import call from "./callReducer";
import peer from "./peerReducer";
export default combineReducers({
  auth,
  alert,
  theme,
  profile,
  status,
  Homepost,
  detailPost,
  mode,
  newsPost,
  suggestions,
  socket,
  notifyUser,
  message,
  market,
  online,
  call,
  peer
});
