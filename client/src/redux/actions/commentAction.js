import { GLOBALTYPES } from "./globalTypes";
import { POSTTYPES } from "./postAction";
import { postDataAPI } from "../../utils/fetchData";
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
