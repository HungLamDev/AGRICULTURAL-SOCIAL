import {
  deleteDataAPI,
  getDataAPI,
  postDataAPI,
} from "../../unitils/fetchData";
import { GLOBALTYPES } from "./globalTyle";

export const POSTS_LOADING = {
  GET_POSTS: "GET_POSTS",
  LOADING_POST: "LOADING_POST",
  GET_POST: "GET_POST",
  DELETE_POST: "DELETE_POST",
  UPDATE_POST: "UPDATE_POST",
};

// Hàm xử lý lỗi chung
const handleError = (dispatch, err) => {
  dispatch({
    type: GLOBALTYPES.NOTIFY,
    payload: { err: err.response.data.msg || "Có lỗi xảy ra." },
  });
};

// Lấy danh sách bài viết
export const getPosts =
  ({ auth }) =>
  async (dispatch) => {
    try {
      const res = await getDataAPI("post/news/result", auth.token);
      dispatch({
        type: POSTS_LOADING.GET_POSTS,
        payload: res.data,
      });
    } catch (err) {
      handleError(dispatch, err);
    } finally {
      dispatch({ type: GLOBALTYPES.NOTIFY, payload: { loading: false } });
    }
  };

// Lấy một bài viết
export const getPost =
  ({ id, auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GLOBALTYPES.NOTIFY, payload: { loading: true } });

      const res = await getDataAPI(`post/${id}`, auth.token);
      dispatch({
        type: POSTS_LOADING.GET_POST,
        payload: res.data,
      });
    } catch (err) {
      handleError(dispatch, err);
    } finally {
      dispatch({ type: GLOBALTYPES.NOTIFY, payload: { loading: false } });
    }
  };

// Cập nhật bài viết
export const updatePost =
  ({ postData, auth }) =>
  async (dispatch) => {
    try {
      // Thông báo cho người dùng
      const msg = {
        id: postData.id,
        text: "Thông báo từ ADMIN !",
        recipients: postData.userId,
        url: `post/${postData.id}`,
        content: `${postData.desc} Đường dẫn: post/${postData.id}`,
        image: "",
      };
      await postDataAPI("notify", msg, auth.token);

      dispatch({
        type: POSTS_LOADING.UPDATE_POST,
        payload: postData, // Giả sử payload là postData
      });

      dispatch({
        type: GLOBALTYPES.NOTIFY,
        payload: { success: "Cập nhật bài viết thành công!" },
      });
    } catch (err) {
      handleError(dispatch, err);
    } finally {
      dispatch({ type: GLOBALTYPES.NOTIFY, payload: { loading: false } });
    }
  };

// Xóa bài viết
export const deletePost =
  ({ post, auth }) =>
  async (dispatch) => {
    try {
      await deleteDataAPI(`post/${post._id}`, auth.token);
      dispatch({
        type: POSTS_LOADING.DELETE_POST,
        payload: post._id,
      });

      const msg = {
        id: post._id,
        text: "Thông báo !",
        recipients: post._id,
        url: `post/${post._id}`,
        content: "Bài viết của bạn đã bị xoá do vi phạm quy tắc cộng đồng !",
        image: "",
      };

      await postDataAPI("notify", msg, auth.token);
      dispatch({
        type: GLOBALTYPES.NOTIFY,
        payload: { success: "Xóa bài viết thành công!" },
      });
    } catch (err) {
      handleError(dispatch, err);
    } finally {
      dispatch({ type: GLOBALTYPES.NOTIFY, payload: { loading: false } });
    }
  };
