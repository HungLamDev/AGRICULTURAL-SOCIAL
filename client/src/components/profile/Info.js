import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "../Avatar";
import EditProfile from "./EditProfile";
import FollowBtn from "./FollowBtn";
import Followers from "./Followers";
import Following from "./Following";
import Diary from "./Diary";
import { createReport } from "../../redux/actions/reportAction";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import MessageBtn from "./MessageBtn";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Snackbar,
  List,
  ListItemButton,
} from "@mui/material";

const Info = () => {
  const { id } = useParams();
  const auth = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.profile);
  const theme = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  const [userData, setUserData] = useState([]);
  const [onEdit, setOnEdit] = useState(false);
  const [showFollowers, setshowFollowers] = useState(false);
  const [showFollowing, setshowFollowing] = useState(false);
  const [onDiary, setOnDiary] = useState(false);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [customReportReason, setCustomReportReason] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const reportOptions = [
    "Nội dung không phù hợp",
    "Lừa đảo",
    "Ngôn ngữ thù địch",
    "Quấy rối",
    "Lý do khác",
  ];

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const newData = profile.users.filter((user) => user._id === id);
      setUserData(newData);
    }
  }, [auth, dispatch, id, profile.users]);

  const handleReport = () => setOpenReportModal(true);

  const confirmReport = () => {
    const finalReason =
      reportReason === "Lý do khác" ? customReportReason : reportReason;

    if (!finalReason.trim()) {
      setSnackbarMessage("Vui lòng chọn hoặc nhập lý do báo cáo!");
      setOpenSnackbar(true);
      return;
    }

    const report = {
      user: auth.user._id,
      related: id,
      text: finalReason,
      type: "user",
    };
    dispatch(createReport({ report, auth }));
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: "Cảm ơn bạn đã đóng góp!" },
    });
    setOpenReportModal(false);
  };

  return (
    <div className="info">
      {userData.map((user) => (
        <div className="info-container" key={user._id}>
          <Avatar src={user.avatar} size="supper-avatar" theme={theme} />
          <div className="info_content">
            <div className="info_content_title title-content">
              <h2 style={{ fontWeight: "bold"}}>
                {user.username}
                {user.role === "expert" && (
                  <i
                    className="fa-solid fa-circle-check text-success"
                    style={{ fontSize: "20px", paddingLeft: "10px" }}
                  ></i>
                )}
              </h2>
            </div>
            <div className="sub_follower">
              <span className="mr-4 followers" onClick={() => setshowFollowers(true)}>
                {user.followers.length} Người theo dõi
              </span>
              <span className="ml-4 following"  onClick={() => setshowFollowing(true)}>
                {user.following.length} Đang theo dõi
              </span>
            </div>

            <p className="m-0" style={{padding:'10px 0 10px'}}>{user.address}</p>
            {user.story && (
              <p className="m-0 warning-text pt-2">{user.story}</p>
            )}

            {user._id === auth.user._id ? (
              <div className="d-flex mt-2" >
                {" "}
                <button
                  className="btn btn-outline-info"
                  style={{
                    padding: "10px 10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => setOnEdit(true)}
                >
                  <i
                    className="fas fa-user-edit"
                    style={{ marginRight: "5px" }}
                  ></i>
                  Chỉnh sửa thông tin
                </button>
                <button
                  className="btn btn-success mx-2"
                  style={{
                    padding: "5px 10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => setOnDiary(true)}
                >
                  <i className="fas fa-book" style={{ marginRight: "5px" }}></i>
                  Diary
                </button>
              </div>
            ) : (
              <div className="d-flex info-buttons ">
                <FollowBtn user={user} />
                <MessageBtn user={user} />
                <button
                  className="btn btn-warning"
                  style={{ marginLeft: "5px" }}
                  onClick={handleReport}
                >
                  !
                </button>
              </div>
            )}
          </div>

          {onEdit && <EditProfile user={user} setOnEdit={setOnEdit} />}
          {onDiary && (
            <Diary setOnDiary={setOnDiary} profile={profile} id={id} />
          )}
          {showFollowers && (
            <Followers
              users={user.followers}
              setshowFollowers={setshowFollowers}
            />
          )}
          {showFollowing && (
            <Following
              users={user.following}
              setshowFollowing={setshowFollowing}
            />
          )}
        </div>
      ))}

      {/* Modal Báo cáo */}
      <Dialog
        open={openReportModal}
        onClose={() => setOpenReportModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Báo cáo người dùng</DialogTitle>
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

export default Info;
