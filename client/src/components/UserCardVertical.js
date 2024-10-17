import React from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";

const UserCardVertical = ({
  children,
  user,
  border,
  handleClose,
  setShowFollowers,
  setShowSubscribers,
  msg,
}) => {
  const handleCloseAll = () => {
    if (handleClose) handleClose();
    if (setShowFollowers) setShowFollowers(false);
    if (setShowSubscribers) setShowSubscribers(false);
  };

  return (
    <div
      className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}
    >
      <div>
        <Link
          to={`/user/${user._id}`}
          onClick={handleCloseAll}
          className="d-flex align-items-center"
          style={{ textDecoration: "none", color: "#000" }}
        >
          <Avatar src={user.avatar} size="big-avatar" />
          <div className="ml-1" style={{ transform: "translateY(-2px)" }}>
            <small className="d-block">{user.username}</small>
            {user.roles === "expert" && (
              <i
                className="fa-solid fa-circle-check text-success"
                style={{ fontSize: "10px", paddingLeft: "5px" }}
              ></i>
            )}
            <small className="">
              {msg
                ? user.text && (
                    <>
                      <div>
                        {user.text.length > 10
                          ? user.text.slice(0, 10) + "..."
                          : user.text}
                      </div>
                      {user.media?.length > 0 && (
                        <div style={{ paddingLeft: "20px" }}>
                          {user.media.length} <i className="fas fa-image"></i>
                        </div>
                      )}
                    </>
                  )
                : ""}
            </small>
          </div>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default UserCardVertical;
