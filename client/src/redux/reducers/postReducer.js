import { POSTTYPES } from "../actions/postAction";
import { EditData, DeleteData } from "../actions/globalTypes";

const initialState = {
  loading: false,
  posts: [],
  diaries: [],
  detailPost: [],
  result: 0,
  page: 2,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POSTTYPES.CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };
    case POSTTYPES.LOADING_POST:
      return {
        ...state,
        loading: action.payload,
      };
    case POSTTYPES.GET_POSTS:
      console.log(action.payload);
      return {
        ...state,
        posts: action.payload.posts,
        result: action.payload.result,
        page: action.payload.page,
      };
    case POSTTYPES.GET_DIARIES_HOME:
      return {
        ...state,
        diaries: action.payload.diaries,
      };
    case POSTTYPES.UPDATE_POST:
      return {
        ...state,
        posts: EditData(state.posts, action.payload._id, action.payload),
      };
    case POSTTYPES.DELETE_POST:
      return {
        ...state,
        posts: DeleteData(state.posts, action.payload._id),
      };

    default:
      return state;
  }
};

export default postReducer;
