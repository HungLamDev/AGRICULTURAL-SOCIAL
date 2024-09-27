import { GLOBALTYPES, DeleteData } from "./globalTypes";
import { getDataAPI, patchDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";
export const PROFILE_TYPES = {
  LOADING: "LOADING_USER",
  GET_USER: "GET_USER",
  FOLLOW: "FOLLOW",
  UNFOLLOW: "UNFOLLOW",
  GET_ID: "GET_USER_ID",
  GET_POSTS: "GET_USER_POSTS",
};

export const getProfileUsers =
  ({ id, auth }) =>
  async (dispatch) => {
    dispatch({ type: PROFILE_TYPES.GET_ID, payload: id });

    try {
      dispatch({ type: PROFILE_TYPES.LOADING, payload: true });
      const res = await getDataAPI(`user/${id}`, auth.token);
      const resPosts = await getDataAPI(`post/user_posts/${id}`, auth.token);
      console.log({ res, resPosts });

      dispatch({
        type: PROFILE_TYPES.GET_USER,
        payload: { user: res.data.user },
      });
      dispatch({
        type: PROFILE_TYPES.GET_POSTS,
        payload: { ...resPosts.data, _id: id, page: 2 },
      });
      dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || "An error occurred" },
      });
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

    try {
      let media;
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

      if (avatar) {
        media = await imageUpload([avatar]);
        if (!media || !media[0]?.url) {
          throw new Error("Image upload failed!");
        }
      }

      const profilePicture = avatar ? media[0].url : auth.user.avatar;
      if (!auth || !auth.user) {
        throw new Error("Auth object or user is undefined");
      }

      const res = await patchDataAPI(
        `user/${auth.user._id}`,
        {
          ...userData,
          avatar: profilePicture,
        },
        auth.token
      );

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
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
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
export const follow =
  ({ users, user, auth }) =>
  async (dispatch) => {
    if (!auth || !auth.user._id || !user._id) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Invalid user ID" },
      });
    }
    let newUser;

    if (users.every((item) => item._id !== user._id)) {
      newUser = { ...user, followers: [...user.followers, auth.user] };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = { ...item, followers: [...item.followers, auth.user] };
        }
      });
    }

    dispatch({
      type: PROFILE_TYPES.FOLLOW,
      payload: newUser,
    });
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        ...auth,
        user: { ...auth.user, following: [...auth.user.following, newUser] },
      },
    });
    try {
      await patchDataAPI(`user/${user._id}/follow`, {}, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || "An error occurred" },
      });
    }
  };
export const unfollow =
  ({ users, user, auth }) =>
  async (dispatch) => {
    if (!auth || !auth.user || !auth.user._id || !user._id) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Invalid user ID" },
      });
    }
    let newUser;

    if (users.every((item) => item._id !== user._id)) {
      newUser = {
        ...user,
        followers: DeleteData(user.followers, auth.user._id),
      };
    } else {
      users.forEach((item) => {
        if (item._id === user._id) {
          newUser = {
            ...item,
            followers: DeleteData(item.followers, auth.user._id),
          };
        }
      });
    }

    dispatch({
      type: PROFILE_TYPES.UNFOLLOW,
      payload: newUser,
    });
    dispatch({
      type: GLOBALTYPES.AUTH,
      payload: {
        ...auth,
        user: {
          ...auth.user,
          following: DeleteData(auth.user.following, newUser._id),
        },
      },
    });
    try {
      await patchDataAPI(`user/${user._id}/unfollow`, {}, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || "An error occurred" },
      });
    }
  };
