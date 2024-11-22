import Logo from "../images/logo_only.png";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { deleteProduct } from "../redux/actions/productAction";
import { MESS_TYPES, addMessage } from "../redux/actions/messageAction";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const ProductCard = ({ product }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdateProduct = () => {
    dispatch({
      type: GLOBALTYPES.STATUS,
      payload: { ...product, onEditProduct: true },
    });
  };

  const handleDeleteProduct = () => {
    setOpenDeleteModal(true);
  };

  const confirmDeleteProduct = () => {
    dispatch(deleteProduct({ product, auth }));
    navigate(window.location.pathname);
    setOpenDeleteModal(false);
  };

  const handleGetProduct = () => {
    navigate(`/market/${product._id}`);
  };

  const handleMessage = () => {
    dispatch({
      type: MESS_TYPES.ADD_USER,
      payload: { ...product.user, text: "", media: [] },
    });
    navigate(`/message/${product.user._id}`);

    const msg = {
      sender: auth.user._id,
      recipient: product.user._id,
      text: "Tôi muốn biết thêm thông tin về sản phẩm: " + product.productName,
      media: product.img,
      createdAt: new Date().toISOString(),
    };

    dispatch(addMessage({ msg, auth, socket }));
  };

  return (
    <div className="product_card" >
      <div>
        <div className="product_card_header" >
          <img
            src={product.img[0] ? product.img[0].url : Logo}
            alt="product_pic" style={{width: '100%', height: '100%', padding: '10px'}}
          />
          <div className="btn_product px-2">
            {product?.user?._id === auth.user._id ? (
              <div>
                <button
                  className="btn btn-info mb-2 w-50"
                  onClick={handleUpdateProduct}
                >
                  <i className="fas fa-pencil-alt"></i>
                </button>
                <button
                  className="btn btn-danger mb-2 w-50"
                  onClick={handleDeleteProduct}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ) : (
              <button className="btn btn-info mb-2 w-100" onClick={handleMessage}>
                Nhắn với người bán
              </button>
            )}
            <button
              className="btn btn-secondary w-100"
              onClick={handleGetProduct}
            >
              Xem chi tiết
            </button>
          </div>
        </div>
        <div className="product_card_body">
          <div className="product_card_title">{product.productName}</div>
          <div className="product_card_content">
            <div className="product_card_price">{product.price} VND</div>
            <div>{product.typeProduct}</div>
            <div>
              <i className="fas fa-map-marker-alt"></i>
              <small style={{ paddingLeft: "5px" }}>{product.address}</small>
            </div>
            <span className="text-muted">
              {moment(product.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>

      {/* Modal for delete confirmation */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Xóa sản phẩm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sản phẩm này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={confirmDeleteProduct} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductCard;
