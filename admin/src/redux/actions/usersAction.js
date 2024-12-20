import {
  deleteDataAPI,
  getDataAPI,
  postDataAPI,
  patchDataAPI,
} from "../../unitils/fetchData";
import { GLOBALTYPES } from "./globalTyle";

export const USERS_LOADING = {
  GET_USERS: "GET_USERS",
  LOADING_USER: "LOADING_USER",
  GET_USER: "GET_USER",
  DELETE_USER: "DELETE_USER",
};

export const getUsers =
  ({ auth }) =>
  async (dispatch) => {
    try {
      dispatch({ type: GLOBALTYPES.NOTIFY, payload: { loading: true } });

      const res = await getDataAPI("user", auth.token);
      dispatch({
        type: USERS_LOADING.GET_USERS,
        payload: res.data,
      });
      dispatch({ type: GLOBALTYPES.NOTIFY, payload: { loading: false } });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.NOTIFY,
        payload: { err: err.response.data.msg },
      });
    }
  };
export const updateUser =
  ({ userData, auth }) =>
  async (dispatch) => {
    try {
      const currentUser = await getDataAPI(`user/${userData.id}`, auth.token);

      const defaultRole = "currentUser"; // Thay đổi giá trị này theo giá trị mặc định của bạn

      // Kiểm tra và cập nhật quyền của user
      if (userData.role && userData.role !== currentUser.role) {
        await patchDataAPI(
          `user/${userData.id}`,
          { role: userData.role },
          auth.token
        );

        const msgRole = {
          id: userData.id,
          text: "Thông báo từ ADMIN!",
          recipients: userData.id,
          url: "",
          content: "Quyền truy cập của bạn đã được cập nhật!",
          image: "",
        };

        await postDataAPI("notify", msgRole, auth.token);
        dispatch({
          type: GLOBALTYPES.NOTIFY,
          payload: { success: "Cập nhật quyền thành công!" },
        });
      } else if (userData.role === defaultRole) {
        // Nếu role không thay đổi và bằng giá trị mặc định
        const msgNoChangeRole = {
          id: userData.id,
          text: "Thông báo từ ADMIN!",
          recipients: userData.id,
          url: "",
          content: "Quyền truy cập của bạn không thay đổi.",
          image: "",
        };

        await postDataAPI("notify", msgNoChangeRole, auth.token);
        dispatch({
          type: GLOBALTYPES.NOTIFY,
          payload: { success: "Quyền truy cập không thay đổi." },
        });
      }

      // Kiểm tra và cập nhật story của user
      if (userData.story) {
        await patchDataAPI(
          `user/${userData.id}`,
          { story: userData.story },
          auth.token
        );

        const msgStoryChange = {
          id: userData.id,
          text: "Cảnh báo từ ADMIN!",
          recipients: userData.id,
          url: "",
          content: `Cảnh báo mới: ${userData.story}`,
          image: "",
        };

        await postDataAPI("notify", msgStoryChange, auth.token);
        dispatch({
          type: GLOBALTYPES.NOTIFY,
          payload: { success: "Cập nhật câu chuyện thành công!" },
        });
      }
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.NOTIFY,
        payload: { err: err.response?.data?.msg || "Có lỗi xảy ra" },
      });

      dispatch({ type: GLOBALTYPES.NOTIFY, payload: { loading: false } });
    }
  };

  export const deleteUser = ({ user, auth }) => async (dispatch) => {
    try {
        await deleteDataAPI(`/user/${user._id}`, auth.token);
         //Notify to user
         const msg = {
            id: user._id,
            text: "Thông báo !",
            recipients: user._id,
            url: "",
            content: "Tài khoản của bạn đã bị xoá do vi phạm quy tắc cộng đồng !",
            image: "",
        };

        await postDataAPI("/notify", msg, auth.token);
        dispatch({
          type: GLOBALTYPES.NOTIFY,
          payload: { success: "Xóa người dùng thành công!" },
        });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.NOTIFY,
        payload: { success: "Xóa người dùng thất bại!" },
      });
    }
};
