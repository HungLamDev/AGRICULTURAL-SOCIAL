import { GLOBALTYPES } from "./globalTypes";
import {
  postDataAPI,
  deleteDataAPI,
  getDataAPI,
  putDataAPI,
} from "../../utils/fetchData";
export const NOTIFY_TYPES = {
  GET_NOTIFIES: "GET_NOTIFIES",
  CREATE_NOTIFY: "CREATE_NOTIFY",
  REMOVE_NOTIFY: "REMOVE_NOTIFY",
  UPDATE_NOTIFY: "UPDATE_NOTIFY",
  UPDATE_SOUND: "UPDATE_SOUND",
  DELETE_ALL_NOTIFIES: "DELETE_ALL_NOTIFIES",
};
export const createNotify =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    try {
      const res = await postDataAPI("/notify", msg, auth.token);
      console.log(res);
      socket.emit("createNotify", {
        ...res.data.notify,
        user: {
          username: auth.user.username,
          avatar: auth.user.avatar,
        },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
export const removeNotify =
  ({ msg, auth, socket }) =>
  async (dispatch) => {
    try {
      console.log("msg", msg);

      const res = await deleteDataAPI(
        `notify/${msg.id}?url=${msg.url}`,
        auth.token
      );
      console.log("res", res);
      if (res && res.data) {
        socket.emit("removeNotify", msg);
      } else {
        throw new Error("Invalid response from API");
      }
    } catch (err) {
      console.error("Error removing notify:", err);
      const errorMessage =
        err.response && err.response.data
          ? err.response.data.msg
          : "Error occurred";
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: errorMessage },
      });
    }
  };

export const getNotifies = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI("notify", token);
    dispatch({ type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { err: err.response.data.msg },
    });
  }
};
export const isReadNotify =
  ({ msg, auth }) =>
  async (dispatch) => {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { ...msg, isRead: true },
    });
    try {
      await putDataAPI(`notify/isReadNotify/${msg._id}`, null, auth.token);
      dispatch({
        type: NOTIFY_TYPES.UPDATE_NOTIFY,
        payload: { ...msg, isRead: true },
      });
    } catch (err) {
      dispatch({
        type: NOTIFY_TYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
export const deleteAllNotifies = (token) => async (dispatch) => {
  dispatch({ type: NOTIFY_TYPES.DELETE_ALL_NOTIFIES, payload: [] });
  try {
    await deleteDataAPI("notify", token);
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { err: err.response.data.msg },
    });
  }
};
