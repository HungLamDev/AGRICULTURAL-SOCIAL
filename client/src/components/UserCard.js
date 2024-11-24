import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { FaPhoneSlash,FaPhone  } from "react-icons/fa6";
import {FaVideo } from 'react-icons/fa';
import { IoVideocamOff } from "react-icons/io5";

const UserCard = ({ children, user, border, handleClose, setshowFollowers, setshowFollowing, msg }) => {
  const handleCloseALL = async () => {
    if (handleClose) handleClose();
    if (setshowFollowers) setshowFollowers(false);
    if (setshowFollowing) setshowFollowing(false);
  };
  const showMsgPreview = (user) => {
    const MAX_WORDS = 10; // Giới hạn số từ
    if (user.text) {
      const words = user.text.split(" "); // Tách tin nhắn thành mảng từ
      const preview = words.slice(0, MAX_WORDS).join(" "); // Lấy tối đa 10 từ
      return words.length > MAX_WORDS ? `${preview}...` : preview; // Thêm "..." nếu dài hơn
    }
    return "";
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
          <span>
            {user.call.times === 0
              ? user.call.video
                ? <IoVideocamOff />
                : <FaPhoneSlash />
              : user.call.video
              ? <FaVideo />
              : <FaPhone />}
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
            <small style={{ opacity: 0.7 }}>
              {msg ? showMsgPreview(user) : user.fullname}
            </small>

          </div>
        </Link>
      </div>
      {children}
    </div>
  );
};

export default UserCard;
