import { GLOBALTYPES, DeleteData } from "./globalTypes";
import { getDataAPI, patchDataAPI } from "../../utils/fetchData";
import { imageUpload } from "../../utils/imageUpload";
import { removeNotify, createNotify } from "./notifyAction";
import { PRODUCTTYPE } from "./productAction";
import { DIARYTYPES } from "./diaryAction";
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
      const resDiary = await getDataAPI(`/diary/g/${id}`, auth.token);
      const resProducts = await getDataAPI(
        `/market/user_products/${id}`,
        auth.token
      );
      console.log({ resProducts, resPosts });
      dispatch({
        type: PRODUCTTYPE.GET_USER_PRODUCTS,
        payload: resProducts.data.userProduct,
      });
      dispatch({
        type: DIARYTYPES.GET_DIARIES,
        payload: resDiary.data.diary,
      });
      dispatch({
        type: PROFILE_TYPES.GET_USER,
        payload: res.data,
      });
      dispatch({
        type: PROFILE_TYPES.GET_POSTS,
        payload: { ...resPosts.data, _id: id, page: 2 },
      });
      dispatch({ type: PROFILE_TYPES.LOADING, payload: false });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || "Đã xảy ra lỗi" },
      });
    }
  };

export const updateUserProfile =
  ({ userData, avatar, auth }) =>
  async (dispatch) => {
    if (!auth || !auth.user) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Đối tượng xác thực hoặc người dùng không hợp lệ!" },
      });
    }
    // Kiểm tra dữ liệu đầu vào
    if (!userData.username)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Nhập tên đăng nhập!" },
      });
    if (userData.username.length > 25)
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
          throw new Error("Tải hình ảnh lên không thành công!");
        }
      }

      const profilePicture = avatar ? media[0].url : auth.user.avatar;
      if (!auth || !auth.user) {
        throw new Error("Đối tượng xác thực hoặc người dùng chưa được xác định");
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
            avatar: profilePicture,
          },
        },
      });

      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "Cập nhật thành công!" + res.data.msg },
      });
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (error) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          error:
            error.response?.data?.msg ||
            "Đã xảy ra lỗi khi cập nhật hồ sơ.",
        },
      });
    }
  };
export const follow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    if (!auth || !auth.user._id || !user._id) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "ID người dùng không hợp lệ" },
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
      const res = await patchDataAPI(`user/${user._id}/follow`, {}, auth.token);
      socket.emit("follow", res.data.newUser);
      //Notify
      const msg = {
        id: auth.user._id,
        text: "Bắt đầu theo dõi bạn !",
        recipients: [newUser._id],
        url: `user/${auth.user._id}`,
      };

      dispatch(createNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || "Đã xảy ra lỗi" },
      });
    }
  };
export const unfollow =
  ({ users, user, auth, socket }) =>
  async (dispatch) => {
    if (!auth || !auth.user || !auth.user._id || !user._id) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "ID người dùng không hợp lệ" },
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
      const res = await patchDataAPI(
        `user/${user._id}/unfollow`,
        {},
        auth.token
      );

      socket.emit("unfollow", res.data.newUser);
      //Notify
      const msg = {
        id: auth.user._id,
        text: "bỏ theo dõi bạn !",
        recipients: [newUser._id],
        url: `user/${auth.user._id}`,
      };

      dispatch(removeNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || "Đã xảy ra lỗi " },
      });
    }
  };
