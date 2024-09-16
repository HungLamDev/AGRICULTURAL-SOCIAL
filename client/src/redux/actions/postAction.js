import { GLOBALTYPES } from "./globalTypes";
import { imageUpload } from "../../utils/imageUpload";
import { postDataAPI } from "../../utils/fetchData";

export const POSTTYPES = {
  CREATE_POST: "CREATE_POST",
};
export const createPost =
  ({ content, hashtag, images, auth }) =>
  async (dispatch) => {
    let media = [];
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
    try {
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
