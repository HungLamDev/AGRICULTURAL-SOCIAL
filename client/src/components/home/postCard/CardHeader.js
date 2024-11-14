import React, { useState } from "react";
import Avatar from "../../Avatar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../../redux/actions/globalTypes";
import { deletePost } from "../../../redux/actions/postAction";
import { BASE_URL } from "../../../utils/config";
import moment from "moment";
import "moment/locale/vi";

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
  List,
  ListItemButton,
} from "@mui/material";

const CardHeader = ({ post }) => {
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);
  const socket = useSelector((state) => state.socket);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [customReportReason, setCustomReportReason] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Lý do báo cáo mặc định
  const reportOptions = [
    "Nội dung không phù hợp",
    "Lừa đảo",
    "Ngôn ngữ thù địch",
    "Quấy rối",
    "Lý do khác", // Để người dùng nhập tùy chọn riêng
  ];
  moment.locale("vi");
  const handleReport = () => setOpenReportModal(true);

  const confirmReport = () => {
    let finalReason =
      reportReason === "Lý do khác" ? customReportReason : reportReason;

    if (!finalReason.trim()) {
      setSnackbarMessage("Vui lòng chọn hoặc nhập lý do báo cáo!");
      setOpenSnackbar(true);
      return;
    }

    const report = {
      user: auth.user._id,
      related: post._id,
      text: finalReason,
      type: "post",
    };
    dispatch(createReport({ report, auth }));
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: "Cảm ơn bạn đã đóng góp!" },
    });
    setOpenReportModal(false);
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
              <div
                className="dropdown-item"
                onClick={() => {
                  dispatch({
                    type: GLOBALTYPES.STATUS,
                    payload: { ...post, onEdit: true },
                  });
                }}
              >
                <span className="material-symbols-outlined">edit</span> Chỉnh
                sửa bài viết
              </div>
              <div
                className="dropdown-item"
                onClick={() => setOpenDeleteModal(true)}
              >
                <span className="material-symbols-outlined">delete</span> Xóa
                bài viết
              </div>
            </>
          )}
          <div
            className="dropdown-item"
            onClick={() => {
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
            }}
          >
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
          <Button
            onClick={() => {
              dispatch(deletePost({ post, auth, socket }));
              navigate("/");
              setOpenDeleteModal(false);
            }}
            color="primary"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal Báo cáo */}
      <Dialog
        open={openReportModal}
        onClose={() => setOpenReportModal(false)}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>Báo cáo bài viết</DialogTitle>
        <DialogContent>
          <List>
            {reportOptions.map((option, index) => (
              <ListItemButton
                key={index}
                selected={reportReason === option}
                onClick={() => setReportReason(option)}
              >
                {option}
              </ListItemButton>
            ))}
          </List>

          {/* Nếu chọn 'Lý do khác', hiện thêm ô nhập */}
          {reportReason === "Lý do khác" && (
            <TextField
              autoFocus
              margin="dense"
              label="Nhập lý do khác"
              type="text"
              fullWidth
              value={customReportReason}
              onChange={(e) => setCustomReportReason(e.target.value)}
              multiline
              rows={4}
              variant="outlined"
              sx={{
                marginTop: "20px",
              }}
            />
          )}
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
