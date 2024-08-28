import { GLOBALTYPES } from "./globalTypes";
import { getDataAPI, patchDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";
export const PROFILE_TYPES = {
  LOADING: "LOADING",
  GET_USER: "GET_USER",
};

export const getProfileUsers =
  ({ users = [], id, auth }) =>
  async (dispatch) => {
    if (!users || !users.find((user) => user._id === id)) {
      try {
        dispatch({ type: PROFILE_TYPES.LOADING, payload: true });
        const res = await getDataAPI(`/user/${id}`, auth.token);
        console.log(res);

        dispatch({
          type: PROFILE_TYPES.GET_USER,
          payload: { user: res.data.user },
        });

        dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
      } catch (err) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { error: err.response?.data?.msg || "An error occurred" },
        });
      }
    }
  };
export const updateUserProfile =
  ({ userData, avatar, auth }) =>
  async (dispatch) => {
    if (!auth || !auth.user) {
      console.error("Auth object or user is undefined:", auth);
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Đối tượng xác thực hoặc người dùng không hợp lệ!" },
      });
    }
    // Kiểm tra dữ liệu đầu vào
    if (!userData.fullname)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Nhập tên đăng nhập!" },
      });
    if (userData.fullname.length > 25)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Tên đăng nhập quá dài!" },
      });
    if (userData.story?.length > 200)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Thông tin quá dài!" },
      });

    console.log(userData, avatar);

    try {
      let media;
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

      if (avatar) {
        // Upload image nếu có avatar mới
        media = await imageUpload([avatar]);
        console.log("Uploaded media:", media);
        if (!media || !media[0]?.url) {
          throw new Error("Image upload failed!");
        }
      }

      const profilePicture = avatar ? media[0].url : auth.user.avatar;
      if (!auth || !auth.user) {
        throw new Error("Auth object or user is undefined");
      }
      console.log("Sending data:", {
        ...userData,
        profilePicture: profilePicture,
      });

      // Gửi yêu cầu PATCH để cập nhật thông tin người dùng
      const res = await patchDataAPI(
        `user/${auth.user._id}`,
        {
          ...userData,
          profilePicture: profilePicture,
        },
        auth.token
      );

      console.log("API Response:", res.data);

      // Cập nhật trạng thái auth với thông tin mới của người dùng
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            ...userData,
            profilePicture: profilePicture,
          },
        },
      });

      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "Cập nhật thành công!" + res.data.msg },
      });
    } catch (error) {
      console.error("Error updating user profile:", error); // Log lỗi
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error:
            error.response?.data?.msg ||
            "An error occurred while updating the profile.",
        },
      });
    } finally {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    }
  };
