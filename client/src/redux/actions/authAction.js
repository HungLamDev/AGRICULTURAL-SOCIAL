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
// otp
export const sendOtp = (email) => async (dispatch) => {
  try {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // Gửi email để tạo OTP
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.msg || "Gửi OTP thất bại.");
    }

    const data = await res.json();

    if (data.success) {
      dispatch({ type: "SEND_OTP_SUCCESS", payload: data });
    } else {
      throw new Error(data.msg || "Gửi OTP thất bại.");
    }
  } catch (err) {
    console.error("Send OTP Error:", err.message);
    dispatch({ type: "SEND_OTP_FAIL", payload: err.message });
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

    if (data.success) {
      dispatch({ type: "VERIFY_OTP_SUCCESS", payload: data });
    } else {
      throw new Error("Mã OTP không đúng.");
    }
  } catch (err) {
    console.error("Verify OTP Error:", err.message);
    dispatch({ type: "VERIFY_OTP_FAIL", payload: err.message });
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
        user: {
          ...res.data.user,
          avatar:
            res.data.user.avatar ||
            "https://res.cloudinary.com/duw0njssy/image/upload/v1695198799/image_default_AgricultureVN/logo_only_s3ioxv.png", // avatar mặc định nếu chưa có
        },
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

