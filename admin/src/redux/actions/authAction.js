import { GLOBALTYPES } from "./globalTyle";
import { postDataAPI } from "../../unitils/fetchData";

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.NOTIFY, payload: { loading: true } });
    const res = await postDataAPI("login", data);

    if (res.data.user.admin === true) {
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          token: res.data.access_token,
          user: res.data.user,
        },
      });
      localStorage.setItem("firstLogin", true);
      dispatch({
        type: GLOBALTYPES.NOTIFY,
        payload: { success: res.data.msg },
      });
      window.location.href = "/users";
    } else {
      dispatch({
        type: GLOBALTYPES.NOTIFY,
        payload: { err: "Bạn không có quyền truy cập trang này!" },
      });
    }
  } catch (err) {
    const errorMsg = err.response?.data?.msg || "Logout failed!";
    dispatch({
      type: GLOBALTYPES.NOTIFY,
      payload: { err: errorMsg },
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  const firstLogin = localStorage.getItem("firstLogin");
  if (firstLogin) {
    dispatch({ type: GLOBALTYPES.NOTIFY, payload: { loading: true } });
    try {
      const res = await postDataAPI("refresh_token");
      console.log(res);
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          token: res.data.access_token,
          user: res.data.user,
        },
      });
      dispatch({ type: GLOBALTYPES.NOTIFY, payload: { loading: false } });
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Logout failed!";
      dispatch({
        type: GLOBALTYPES.NOTIFY,
        payload: { err: errorMsg },
      });
    }
  }
};
export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("firstLogin");
    await postDataAPI("logout");
    window.location.href = "/";
  } catch (err) {
    const errorMsg = err.response?.data?.msg || "Logout failed!";
    dispatch({
      type: GLOBALTYPES.NOTIFY,
      payload: { err: errorMsg },
    });
  }
};
