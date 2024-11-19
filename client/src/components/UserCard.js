import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserCard = ({ children, user, border, handleClose, setshowFollowers, setshowFollowing, msg }) => {
  const handleCloseALL = async () => {
    if (handleClose) handleClose();
    if (setshowFollowers) setshowFollowers(false);
    if (setshowFollowing) setshowFollowing(false);
  };

  const showMsg = (user) => {
    return (
      <>
        <div>{user.text}</div>
        {user.media && user.media.length > 0 && (
          <div>
            {user.media.length} <i className="fas fa-images" />
          </div>
        )}
        {user.call && (
          <span className="material-icons">
            {user.call.times === 0
              ? user.call.video
                ? "videocam_off"
                : "phone_disabled"
              : user.call.video
              ? "video_camera_front"
              : "call"}
          </span>
        )}
      </>
    );
  };

  return (
    <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
      <div>
        <Link
          to={`/user/${user._id}`}
          onClick={handleCloseALL}
          className="d-flex align-items-center"
          style={{ textDecoration: "none", color: "#000" }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <Avatar src={user.avatar} size="medium-avatar" />
            {user.online ? (
              <i
                className="fa-solid fa-circle"
                style={{
                  position: "absolute", 
                  top: "0px", 
                  right: "0px",
                  color: "#009933", 
                  fontSize: "10px",
                }}
              ></i>
            ) : (
              <></>
            )}
          </div>

          <div className="ml-1" style={{ transform: "translateY(-6px)", paddingTop: "10px" }}>
            <span className="d-block">{user.username}</span>
            <small style={{ opacity: 0.7 }}>{msg ? showMsg(user) : user.fullname}</small>
          </div>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default UserCard;
