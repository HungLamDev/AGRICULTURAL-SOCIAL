import { postDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "./globalTypes";

export const createReport =
  ({ report, auth }) =>
  async (dispatch) => {
    try {
      await postDataAPI("report", report, auth.token);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
