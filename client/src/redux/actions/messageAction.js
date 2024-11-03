import { GLOBALTYPES, DeleteData } from "./globalTypes";
import { getDataAPI, postDataAPI, deleteDataAPI } from "../../utils/fetchData";
export const MESS_TYPES = {
  ADD_USER: "ADD_USER",
  ADD_MESSAGE: "ADD_MESSAGE",
  GET_CONVERSATIONS: "GET_CONVERSATIONS",
  GET_MESSAGES: "GET_MESSAGES",
  UPDATE_MESSAGES: "UPDATE_MESSAGES",
  DELETE_MESSAGES: "DELETE_MESSAGES",
  DELETE_CONVERSATION: "DELETE_CONVERSATION",
  CHECK_ONLINE: "CHECK_ONLINE",
};
export const addMessage =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: msg });

    const { _id, profilePicture, username } = auth.user;
    socket.emit("addMessage", {
      ...msg,
      user: { _id, profilePicture, username },
    });

    try {
      await postDataAPI("/message", msg, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.NOTIFY,
        payload: { err: err.response.data.msg },
      });
    }
  };
export const addUser =
  ({ user, message }) =>
  (dispatch) => {
    if (message.users.every((item) => item._id !== user._id)) {
      dispatch({ type: MESS_TYPES.ADD_USER, payload: user });
    }
  };
