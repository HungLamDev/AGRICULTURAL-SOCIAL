import { GLOBALTYPES, DeleteData } from "./globalTypes";
import { postDataAPI, getDataAPI, deleteDataAPI } from "../../utils/fetchData";
export const MESS_TYPES = {
  ADD_USER: "ADD_USER",
  ADD_MESSAGE: "ADD_MESSAGE",
  GET_CONVERSATIONS: "GET_CONVERSATIONS",
  GET_MESSAGES: "GET_MESSAGES",
  UPDATE_MESSAGES: "UPDATE_MESSAGES",
  DELETE_MESSAGES: "DELETE_MESSAGES",
  DELETE_CONVERSATION: "DELETE_CONVERSATION",
  CHECK_ONLINE: "CHECK_ONLINE",
  MARK_MESSAGE_READ: "MARK_MESSAGE_READ",
};

export const addMessage = ({ msg, auth, socket }) => async (dispatch) => {

  const { _id, avatar, fullname, username } = auth.user
    // Lấy thời gian hiện tại
  const timestamp = new Date().toISOString();
  
  // Thêm trường lastMessageTime vào msg
  const updatedMsg = { ...msg, lastMessageTime: timestamp };

  dispatch({ type: MESS_TYPES.ADD_MESSAGE, payload: updatedMsg });
  socket.emit("addMessage", { ...updatedMsg, user: { _id, avatar, fullname, username } });

  try {
    await postDataAPI("message", updatedMsg, auth.token); // Gửi `updatedMsg` thay vì `msg`
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg },
    });
  }
};

export const getConversations = ({ auth,page = 1 }) => async (dispatch) => {
    try {
      const res = await getDataAPI(`conversations?limit=${page * 9}`, auth.token);
      let newArr = [];
      res.data.conversations.forEach((item) => {
        item.recipients.forEach((cv) => {
          if (cv._id !== auth.user._id) {
            newArr.push({ ...cv, text: item.text, media: item.media, call: item.call });
          }
        });
      });
      dispatch({
        type: MESS_TYPES.GET_CONVERSATIONS,
        payload: { newArr, result: res.data.result },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };

export const getMessages = ({ auth, id, page = 1 }) => async (dispatch) => {
    try {
      const res = await getDataAPI(`message/${id}?limit=${page * 9}`,auth.token)
      const newData = {...res.data, messages: res.data.messages.reverse()}
      
      dispatch({ type: MESS_TYPES.GET_MESSAGES, payload: {...newData, _id: id, page} });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };

export const loadMoreMessages = ({ auth, id, page = 1 }) => async (dispatch) => {
    try {
      const res = await getDataAPI(`message/${id}?limit=${page * 9}`,auth.token)
      const newData = {...res.data, messages: res.data.messages.reverse()}
      
      dispatch({ type: MESS_TYPES.UPDATE_MESSAGES, payload: {...newData, _id: id, page} });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };

export const deleteMessages = ({msg, data, auth}) => async (dispatch) => {
    const newData = DeleteData(data, msg._id)
    dispatch({type: MESS_TYPES.DELETE_MESSAGES, payload: {newData, _id: msg.recipient}})
    try {
        await deleteDataAPI(`message/${msg._id}`, auth.token)
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
  };

export const deleteConversation = ({auth, id}) => async (dispatch) => {
  dispatch({type: MESS_TYPES.DELETE_CONVERSATION, payload: id})
  try {
    await deleteDataAPI(`conversation/${id}`, auth.token)
  } catch (err) {
      dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
  }
  };


