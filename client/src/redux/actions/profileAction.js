import { GLOBALTYPES } from "./globalTypes";
import { getDataAPI, putDataAPI } from "../../utils/fetchData";
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
    if (!userData.fullname)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: "Nhập tên đăng nhập !" },
      });
    if (userData.fullname.length > 25)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: "Tên đăng nhập quá dài !" },
      });
    if (userData.story.length > 200)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: "Thông tin quá dài !" },
      });
    try {
      let media;
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
      if (avatar) media = await imageUpload([avatar]);
      console.log(media);
      const res = await putDataAPI(
        `/user/${auth.user._id}`,
        {
          ...userData,
          profilePicture: avatar ? media[0].url : auth.user.avatar,
        },
        auth.token
      );
      console.log(res);
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          ...auth,
          user: {
            ...auth.user,
            ...userData,
            profilePicture: avatar ? media[0].url : auth.user.avatar,
          },
        },
      });
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: res.response?.data?.msg || "Đã xảy ra lỗi" },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response?.data?.msg || "Đã xảy ra lỗi" },
      });
    }
  };
