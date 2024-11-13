import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "./Avatar";
import moment from "moment";
import { isReadNotify, deleteAllNotifies } from "../redux/actions/notifyAction";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Link } from "react-router-dom";

const NotifyModal = () => {
  const auth = useSelector((state) => state.auth);
  const notify = useSelector((state) => state.notifyUser);
  const dispatch = useDispatch();

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleIsRead = (msg) => {
    dispatch(isReadNotify({ msg, auth }));
  };

  const handleReadAdmins = (msg) => {
    if (msg.url === "") {
      setSelectedNotification(msg);
      setOpenDetailsDialog(true);
    } else {
      dispatch(isReadNotify({ msg, auth }));
    }
  };

  const handleDeleteAll = () => {
    const newArr = notify.data.filter((item) => item.isRead === false);
    if (newArr.length === 0) return dispatch(deleteAllNotifies(auth.token));

    if (
      window.confirm(
        `Bạn có ${newArr.length} thông báo chưa đọc. Bạn có muốn xóa tất cả ?`
      )
    ) {
      return dispatch(deleteAllNotifies(auth.token));
    }
  };

  return (
    <>
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
      >
        <DialogTitle>Chi tiết thông báo</DialogTitle>
        <DialogContent>
          {selectedNotification ? (
            <div>
              <strong>{selectedNotification.user.username}</strong>
              <div>{selectedNotification.text}</div>
              <div>{selectedNotification.content}</div>
              <small className="text-muted">
                {moment(selectedNotification.createdAt).fromNow()}
              </small>
            </div>
          ) : (
            <div>Không có thông tin thông báo</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <div className="notifications ">
        <div className="title">Thông báo</div>
        <hr className="mt-0" />
        {notify.data.length === 0 && (
          <div className="icon_notify">
            <i className="fas fa-bell-slash fa-lg"></i>
            <div>Không có thông báo mới !</div>
          </div>
        )}
        <div style={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}>
          {notify.data.map((msg, index) => (
            <div key={index} className="px-2 mb-3">
              <Link
                to={`${msg.url}`}
                className="d-flex text-dark align-items-center"
                style={{ textDecoration: "none" }}
                onClick={() => handleIsRead(msg)}
              >
                <Avatar src={msg.user.avatar} size="big-avatar" />
                <div className="mx-1 flex-fill">
                  <div>
                    <strong style={{ marginRight: "10px" }}>
                      {msg.user.username}
                    </strong>
                    <span>{msg.text}</span>
                  </div>
                  {msg.content && <small>{msg.content.slice(0, 20)}...</small>}
                </div>
                {msg.url === "" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReadAdmins(msg)}
                  >
                    Xem
                  </button>
                )}
                {msg.image && (
                  <div style={{ width: "30px" }}>
                    {msg.image ? (
                      <Avatar src={msg.image} size="medium-avatar" />
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </Link>

              <small className="text-muted d-flex justify-content-between align-items-center px-2">
                {moment(msg.createdAt).fromNow()}
                {!msg.isRead && <i className="fas fa-circle text-primary" />}
              </small>
            </div>
          ))}
        </div>
        <hr className="my-1" />
        <div
          className="text-danger text-center"
          style={{ cursor: "pointer", paddingLeft: "10px" }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      </div>
    </>
  );
};

export default NotifyModal;
