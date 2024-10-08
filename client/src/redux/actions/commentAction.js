import { GLOBALTYPES } from "./globalTypes";
import { POSTTYPES } from "./postAction";
import { postDataAPI, putDataAPI, deleteDataAPI } from "../../utils/fetchData";
import { EditData, DeleteData } from "./globalTypes";

export const createComment =
  ({ post, newComment, auth }) =>
  async (dispatch) => {
    if (!post || !post._id || !post.user) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: "Post data is missing or incomplete" },
      });
      return;
    }
    const newPost = { ...post, comments: [...post.comments, newComment] };
    console.log({ post, newComment });
    dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });
    try {
      const data = {
        ...newComment,
        postId: post._id,
        postUserId: post.user._id,
      };
      console.log({ data });
      const res = await postDataAPI("comment", data, auth.token);
      const newData = { ...res.data.newComment, user: auth.user };
      const newPost = { ...post, comments: [...post.comments, newData] };
      dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
export const updateComment =
  ({ post, comment, content, auth }) =>
  async (dispatch) => {
    const newCmt = EditData(post.comments, comment._id, {
      ...comment,
      content,
    });
    const newPost = { ...post, comments: newCmt };
    dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });
    try {
      await putDataAPI(`comment/${comment._id}`, { content }, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
export const likeComment =
  ({ post, comment, auth }) =>
  async (dispatch) => {
    const newComment = { ...comment, likes: [...comment.likes, auth.user] };
    const newComments = EditData(post.comments, comment._id, newComment);
    const newPost = { ...post, comments: newComments };

    dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });

    try {
      await putDataAPI(`comment/${comment._id}/like`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
export const unlikeComment =
  ({ post, comment, auth }) =>
  async (dispatch) => {
    const newComment = {
      ...comment,
      likes: DeleteData(comment.likes, auth.user._id),
    };
    const newComments = EditData(post.comments, comment._id, newComment);
    const newPost = { ...post, comments: newComments };

    dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });

    try {
      await putDataAPI(`comment/${comment._id}/unlike`, null, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.NOTIFY,
        payload: { err: err.response.data.msg },
      });
    }
  };
export const deleteComment =
  ({ post, comment, auth }) =>
  async (dispatch) => {
    const deleteArr = [
      ...post.comments.filter((cm) => cm.reply === comment._id),
      comment,
    ];
    const newPost = {
      ...post,
      comments: post.comments.filter(
        (cm) => !deleteArr.find((da) => cm._id === da._id)
      ),
    };
    console.log({ post, comment, auth });

    console.log({ deleteArr, newPost });
    dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });
    try {
      deleteArr.forEach((item) => {
        deleteDataAPI(`comment/${item._id}`, auth.token);
        const msg = {
          id: item._id,
          text: comment.reply
            ? "Đã nhắc đến bạn trong một bình luận !"
            : "Đã bình luận bài viết của bạn !",
          recipients: comment.reply ? [comment.tag._id] : [post.user._id],
          url: `post/${post._id}`,
        };
        return msg;
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
