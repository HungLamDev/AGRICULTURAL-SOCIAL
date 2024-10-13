import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserCard = ({
  children,
  user,
  border,
  handleClose,
  setshowFollowers,
  setshowFollowing,
  theme,
}) => {
  const handleCloseALL = async () => {
    if (handleClose) handleClose();
    if (setshowFollowers) setshowFollowers(false);
    if (setshowFollowing) setshowFollowing(false);
  };
  return (
    <div
      className={`d-flex p-2 align-items-center justify-content-between ${border}`}
    >
      <div>
        <Link
          to={`/user/${user._id}`}
          onClick={handleCloseALL}
          className="d-flex align-items-center"
          style={{ textDecoration: "none", color: "#000" }}
        >
          <Avatar src={user.avatar} size="big-avatar" theme={theme} />
          <div className="ml-1" style={{ transform: "translateY(-6px)" }}>
            <span className="d-block">{user.username}</span>
            <small style={{ opacity: 0.7 }}>{user.fullname}</small>
          </div>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default UserCard;
