import { GLOBALTYPES } from "../actions/globalTypes";
const initialState = {};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.AUTH:
      return {
        ...state, // Giữ các thuộc tính hiện tại của state
        ...action.payload, // Cập nhật state với giá trị mới từ action.payload
      };

    default:
      return state;
  }
};
export default authReducer;
