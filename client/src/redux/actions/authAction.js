import { GLOBALTYPES } from "./globalTypes";
import { postDataAPI } from "../../utils/fetchData";
import valid from "../../utils/valid";

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI("login", data);
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    });
    localStorage.setItem("firstLogin", true);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

export const refrechToken = () => async (dispatch) => {
  const firstLogin = localStorage.getItem("firstLogin");
  if (firstLogin) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    try {
      const res = await postDataAPI("refresh_token");
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          token: res.data.access_token,
          user: res.data.user,
        },
      });
      dispatch({ type: GLOBALTYPES.ALERT, payload: {} });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          loading: true,
        },
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
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

export const sendOtp = (email) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || "Gửi OTP thất bại.");
    }

    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: data.msg } });
    return true; // Gửi OTP thành công
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.message },
    });
    return false; // Gửi OTP thất bại
  }
};


export const verifyOtp = (email, otp) => async (dispatch) => {
  try {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }), // Gửi email và OTP để xác thực
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.msg || "Xác thực OTP thất bại.");
    }

    const data = await res.json();

    if (data.msg === "Xác thực OTP thành công!") {
      dispatch({ type: "VERIFY_OTP_SUCCESS", payload: data });
      return true; // Trả về true nếu OTP xác thực thành công
    } else {
      throw new Error(data.msg || "Mã OTP không đúng.");
    }
  } catch (err) {
    console.error("Verify OTP Error:", err.message);
    dispatch({ type: "VERIFY_OTP_FAIL", payload: err.message });
    return false; // Trả về false nếu có lỗi
  }
};

export const register = (data) => async (dispatch) => {
  const check = valid(data);
  if (check.errLength > 0)
    return dispatch({ type: GLOBALTYPES.ALERT, payload: check.errMsg });

  // Gọi API xác thực OTP trước khi đăng ký
  const otpVerified = await verifyOtp(data.email, data.otp);
  if (!otpVerified) {
    return dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: "OTP không hợp lệ hoặc đã hết hạn!" },
    });
  }

  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI("register", data);
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        token: res.data.access_token,
        user: res.data.user,
      },
    });
    localStorage.setItem("firstLogin", true);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: res.data.msg,
      },
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || "Đăng ký thất bại",
      },
    });
  }
};

export const resetPassword = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Gửi email, OTP, và mật khẩu mới
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.msg || "Đặt lại mật khẩu thất bại.");
    }

    const responseData = await res.json();

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        success: responseData.msg,
      },
    });

    return true; // Thành công
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.message },
    });
    return false; // Thất bại
  }
};




