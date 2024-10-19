import React, { useState } from "react";
import Avatar from "../../Avatar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../../redux/actions/globalTypes";
import { deletePost } from "../../../redux/actions/postAction";
import { BASE_URL } from "../../../utils/config";
import moment from "moment";
import { createReport } from "../../../redux/actions/reportAction";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Snackbar,
} from "@mui/material";

const CardHeader = ({ post }) => {
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);
  const socket = useSelector((state) => state.socket);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [reportText, setReportText] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Xử lý chỉnh sửa bài viết
  const handleEditPost = () => {
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
  };

  // Xử lý mở/đóng modal xóa bài viết
  const handleDeletePost = () => setOpenDeleteModal(true);
  const confirmDeletePost = () => {
    dispatch(deletePost({ post, auth, socket }));
    navigate("/");
    setOpenDeleteModal(false);
  };

  // Xử lý sao chép liên kết
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(`${BASE_URL}/post/${post._id}`)
      .then(() => {
        setSnackbarMessage("Đã sao chép liên kết thành công");
        setOpenSnackbar(true);
      })
      .catch((error) => {
        setSnackbarMessage("Lỗi khi sao chép: " + error);
        setOpenSnackbar(true);
      });
  };

  // Xử lý báo cáo bài viết
  const handleReport = () => setOpenReportModal(true);
  const confirmReport = () => {
    if (reportText) {
      const report = {
        user: auth.user._id,
        related: post._id,
        text: reportText,
        type: "post",
      };
      dispatch(createReport({ report, auth }));
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: "Cảm ơn bạn đã đóng góp!" },
      });
      setOpenReportModal(false);
    }
  };

  return (
    <div className="card_header">
      <div className="d-flex">
        <Avatar src={post.user.avatar} theme={theme} size="big-avatar" />
        <div className="card_name m-2">
          <h6>
            <Link
              to={`user/${post.user._id}`}
              className="text-dark"
              style={{ textDecoration: "none" }}
            >
              {post.user.username}
            </Link>
            {post.user.role === "expert" && (
              <i
                className="fa-solid fa-circle-check text-success"
                style={{ fontSize: "10px", paddingLeft: "5px" }}
              ></i>
            )}
          </h6>
          <p className="m-0 text-muted" style={{ fontSize: "0.7rem" }}>
            {moment(post.createdAt).fromNow()}
          </p>
        </div>
      </div>

      <div className="nav-item dropdown">
        <span
          className="material-icons"
          id="moreLink"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          more_horiz
        </span>
        <div className="dropdown-menu">
          {auth?.user?._id === post?.user?._id && (
            <>
              <div className="dropdown-item" onClick={handleEditPost}>
                <span className="material-symbols-outlined">edit</span> Chỉnh
                sửa bài viết
              </div>
              <div className="dropdown-item" onClick={handleDeletePost}>
                <span className="material-symbols-outlined">delete</span> Xóa
                bài viết
              </div>
            </>
          )}
          <div className="dropdown-item" onClick={handleCopyLink}>
            <span className="material-symbols-outlined">share</span> Sao chép
            liên kết
          </div>
          <div className="dropdown-item" onClick={handleReport}>
            <span className="material-symbols-outlined">report</span> Báo cáo
          </div>
        </div>
      </div>

      {/* Modal Xóa bài viết */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Xóa bài viết</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa bài viết này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={confirmDeletePost} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Báo cáo */}
      <Dialog open={openReportModal} onClose={() => setOpenReportModal(false)}>
        <DialogTitle>Báo cáo bài viết</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do báo cáo"
            type="text"
            fullWidth
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            multiline
            rows={4} // Để có nhiều dòng nhập hơn
            variant="outlined" // Kiểu TextField
            sx={{
              width: "100%", // Chiếm toàn bộ chiều ngang
              "& .MuiInputBase-root": {
                fontSize: "16px", // Kích thước chữ trong trường nhập
                padding: "12px", // Tăng padding
                backgroundColor: "#f9f9f9", // Thêm màu nền nhẹ để nổi bật
                borderRadius: "8px", // Làm góc tròn hơn
                "&.Mui-focused": {
                  borderColor: "#3f51b5", // Đổi màu viền khi tập trung
                  boxShadow: "0 0 5px rgba(63, 81, 181, 0.5)", // Tạo hiệu ứng đổ bóng khi tập trung
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#c4c4c4", // Màu viền mặc định
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3f51b5", // Đổi màu viền khi hover
              },
              "& .MuiInputLabel-root": {
                fontSize: "18px", // Kích thước chữ của label
                color: "#333", // Màu chữ của label
              },
              "& .MuiInputLabel-shrink": {
                fontSize: "16px", // Kích thước chữ khi label thu nhỏ
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReportModal(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={confirmReport} color="primary">
            Gửi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export default CardHeader;
