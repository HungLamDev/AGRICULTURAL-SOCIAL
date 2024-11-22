import { GLOBALTYPES } from "./globalTypes";
import { imageUpload } from "../../utils/imageUpload";
import {
  postDataAPI,
  getDataAPI,
  patchDataAPI,
  putDataAPI,
  deleteDataAPI,
} from "../../utils/fetchData";
import { createNotify, removeNotify } from "./notifyAction";

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
  ({ content, hashtag, images, auth, socket }) =>
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
      dispatch({
        type: POSTTYPES.CREATE_POST,
        payload: { ...res.data.newPost, user: auth.user },
      });

      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
      const msg = {
        id: res.data.newPost._id,
        text: "Đã thêm bài viết !",
        recipients: res.data.newPost.user.followers,
        url: `post/${res.data.newPost._id}`,
        content,
        image: media.length > 0 ? media[0].url : "",
      };
      dispatch(createNotify({ msg, auth, socket }));

      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });
      dispatch({
        type: GLOBALTYPES.STATUS,
        payload: false,
      });
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

      dispatch({
        type: GLOBALTYPES.STATUS,
        payload: false,
      });
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
        console.log(res);
        dispatch({ type: POSTTYPES.GET_POST, payload: res.data.post });
      } catch (err) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { err: err.response.data.msg },
        });
      }
    }
  };
export const likePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    const userWithFollowers = {
      ...auth.user,
      followers: auth.user.followers || [],
    };
    const newPost = {
      ...post,
      user: userWithFollowers,
      like: [...post.like, auth.user],
    };
    dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });
    socket.emit("likePost", newPost);
    try {
      await putDataAPI(`post/${post._id}/like`, null, auth.token);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "Bạn vừa thích bài viết này!" },
      });
      const msg = {
        id: auth.user._id,
        text: "Thích bài viết của bạn !",
        recipients: [post.user._id],
        url: `post/${post._id}`,
        content: post.content,
        image: post.img.length > 0 ? post.img[0].url : "",
      };
      dispatch(createNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          err: err.response ? err.response.data.msg : "Lỗi khi lấy bài viết",
        },
      });
    }
  };
export const unlikePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    const userWithFollowers = {
      ...auth.user,
      followers: auth.user.followers || [],
    };
    console.log(userWithFollowers);
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const newPost = {
      ...post,
      user: userWithFollowers,
      like: post.like.filter((lk) => lk._id !== auth.user._id),
    };
    console.log("newPost", newPost);

    dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });
    socket.emit("unlikePost", newPost);
    try {
      await putDataAPI(`post/${post._id}/unlike`, null, auth.token);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "Bạn vừa bỏ thích bài viết này!" },
      });
      // Notify
      const msg = {
        id: auth.user._id,
        text: "Bỏ thích bài viết của bạn !",
        recipients: [post.user._id],
        url: `post/${post._id}`,
      };
      dispatch(removeNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          err: err.response ? err.response.data.msg : "Lỗi khi lấy bài viết",
        },
      });
    }
  };
export const getNewsPosts = (token) => async (dispatch) => {
  try {
    dispatch({ type: POSTTYPES.LOADING_NEWS_POST, payload: true });

    const res = await getDataAPI("post/news/result", token);
    dispatch({
      type: POSTTYPES.NEWS_POST,
      payload: { ...res.data },
    });
    dispatch({ type: POSTTYPES.LOADING_NEWS_POST, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { err: err.response.data.msg },
    });
  }
};
export const deletePost =
  ({ post, auth, socket }) =>
  async (dispatch) => {
    dispatch({ type: POSTTYPES.DELETE_POST, payload: post });
    try {
      const res = await deleteDataAPI(`post/${post._id}`, auth.token);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          success: "Đã xóa bài viết thành công!",
        },
      });
      const msg = {
        id: post._id,
        text: "Xóa bài viết !",
        recipients: res.data.newPost.user.followers,
        url: `post/${post._id}`,
      };
      dispatch(removeNotify({ msg, auth, socket }));
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };

export const savePost =
  ({ post, auth }) =>
  async (dispatch) => {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const savedPosts = Array.isArray(auth.user.save) ? auth.user.save : [];
    const newUser = { ...auth.user, saved: [...savedPosts, post._id] };
    dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
    try {
      await putDataAPI(`post/savePost/${post._id}`, null, auth.token);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "Bạn vừa lưu bài viết này!" },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };

export const unSavePost =
  ({ post, auth }) =>
  async (dispatch) => {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const newUser = {
      ...auth.user,
      saved: auth.user.saved.filter((id) => id !== post._id),
    };
    dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });

    try {
      await putDataAPI(`post/unSavePost/${post._id}`, null, auth.token);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "Bạn vừa bỏ lưu bài viết này!" },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
