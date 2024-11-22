import { GLOBALTYPES } from "./globalTypes";
import { imageUpload } from "../../utils/imageUpload";
import {
  deleteDataAPI,
  getDataAPI,
  postDataAPI,
  putDataAPI,
} from "../../utils/fetchData";

export const PRODUCTTYPE = {
  CREATE_PRODUCT: "CREATE_PRODUCT",
  GET_PRODUCTS: "GET_PRODUCTS",
  GET_PRODUCT: "GET_PRODUCT",
  GET_USER_PRODUCTS: "GET_USER_PRODUCTS",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
};

export const createProduct =
  ({
    content,
    price,
    address,
    typeProduct,
    hashtag,
    images,
    productName,
    auth,
  }) =>
  async (dispatch) => {
    let media = [];
    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
      if (images.length > 0) media = await imageUpload(images);
      const res = await postDataAPI(
        "market",
        {
          desc: content,
          price,
          address,
          typeProduct,
          productName,
          hashtag,
          img: media,
        },
        auth.token
      );
      dispatch({
        type: PRODUCTTYPE.CREATE_PRODUCT,
        payload: { ...res.data.newProduct, user: auth.user },
      });
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          success: "Sản phẩm đã được đăng thành công!",
        },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };

export const getProducts =
  ({ auth, category, search }) =>
  async (dispatch) => {
    try {
      let endpoint = "market";

      if (category) {
        endpoint += `/s/category?category=${category}`;
      }

      if (search) {
        endpoint += `/s/search?search=${search}`;
      }

      const res = await getDataAPI(endpoint, auth.token);

      dispatch({
        type: PRODUCTTYPE.GET_PRODUCTS,
        payload: { ...res.data },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };

export const getProduct =
  ({ productDetail, auth, id }) =>
  async (dispatch) => {
    if (productDetail.every((product) => product._id !== id)) {
      try {
        const res = await getDataAPI(`market/${id}`, auth.token);
        dispatch({
          type: PRODUCTTYPE.GET_PRODUCT,
          payload: res.data.product,
        });
      } catch (err) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { err: err.response.data.msg },
        });
      }
    }
  };
export const updateProduct =
  ({
    content,
    price,
    address,
    typeProduct,
    hashtag,
    images,
    productName,
    auth,
    status,
  }) =>
  async (dispatch) => {
    let media = [];

    const newImgUrl = images.filter((img) => !img.url);
    const oldImgUrl = images.filter((img) => img.url);

    try {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
      if (newImgUrl.length > 0) media = await imageUpload(newImgUrl);

      const res = await putDataAPI(
        `market/${status._id}`,
        {
          desc: content,
          price,
          address,
          typeProduct,
          hashtag,
          img: [...oldImgUrl, ...media],
          productName,
          auth,
        },
        auth.token
      );
      dispatch({
        type: PRODUCTTYPE.UPDATE_PRODUCT,
        payload: res.data.newProduct,
      });

      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          success: "Sản phẩm đã được cập nhật thành công!",
        },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };

export const deleteProduct =
  ({ product, auth }) =>
  async (dispatch) => {
    dispatch({ type: PRODUCTTYPE.DELETE_PRODUCT, payload: product });
    try {
      await deleteDataAPI(`market/${product._id}`, auth.token);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          success: "Đã xóa Sản phẩm thành công!",
        },
      });
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response.data.msg },
      });
    }
  };
