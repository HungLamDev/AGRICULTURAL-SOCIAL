import { GLOBALTYPES } from "./globalTypes";
import { imageUpload } from "../../utils/imageUpload";
import { postDataAPI, getDataAPI, patchDataAPI } from "../../utils/fetchData";

export const POSTTYPES = {
  CREATE_POST: "CREATE_POST",
  LOADING_POST: "LOADING_POST",
  LOADING_NEWS_POST: "LOADING_NEWS_POST",
  GET_POSTS: "GET_POSTS",
  GET_DIARIES_HOME: "GET_DIARIES_HOME",
  UPDATE_POST: "UPDATE_POST",
  GET_POST: "GET_POST",
  DELETE_POST: "DELETE_POST",
  NEWS_POST: "NEWS_POST",
};
export const createPost =
  ({ content, hashtag, images, auth }) =>
  async (dispatch) => {
    let media = [];

    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
      if (images.length > 0) media = await imageUpload(images);

      const res = await postDataAPI(
        `post`,
        { desc: content, img: media, hashtag },
        auth.token
      );
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
      dispatch({
        type: POSTTYPES.CREATE_POST,
        payload: { ...res.data.newPost, user: auth.user },
      });

      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
      const msg = {
        id: res.data.newPost._id,
        text: "Đã thêm bài viết !",
        recipients: res.data.newPost.user.followers,
        url: `/post/${res.data.newPost._id}`,
        content,
        image: media.length > 0 ? media[0].url : "",
      };
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
export const getPosts = (token) => async (dispatch) => {
  try {
    dispatch({ type: POSTTYPES.LOADING_POST, payload: true });

    const res = await getDataAPI("post", token);
    dispatch({
      type: POSTTYPES.GET_POSTS,
      payload: { ...res.data },
    });

    dispatch({ type: POSTTYPES.LOADING_POST, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { err: err.response.data.msg },
    });
  }
};
export const updatePost =
  ({ content, hashtag, images, auth, status }) =>
  async (dispatch) => {
    let media = [];
    const newImgUrl = images.filter((img) => !img.url);
    const oldImgUrl = images.filter((img) => img.url);
    if (
      status.desc === content &&
      newImgUrl === 0 &&
      oldImgUrl.length === status.img.length
    )
      return;

    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
      if (newImgUrl.length > 0) media = await imageUpload(newImgUrl);

      const res = await patchDataAPI(
        `post/${status._id}`,
        {
          desc: content,
          img: [...oldImgUrl, ...media],
          hashtag,
        },
        auth.token
      );

      dispatch({
        type: POSTTYPES.UPDATE_POST,
        payload: { ...res.data.newPost },
      });
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
export const getPost =
  ({ detailPost, id, auth }) =>
  async (dispatch) => {
    if (detailPost.every((post) => post._id !== id)) {
      try {
        const res = await getDataAPI(`post/${id}`, auth.token);
        console.log(res.data);
        dispatch({ type: POSTTYPES.GET_POST, payload: res.data.post });
      } catch (err) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: {
            err: err.response ? err.response.data.msg : "Lỗi khi lấy bài viết",
          },
        });
      }
    }
  };
