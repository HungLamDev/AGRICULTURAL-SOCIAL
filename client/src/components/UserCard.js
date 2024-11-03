import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const UserCard = ({children, user, border, handleClose, setshowFollowers, setshowFollowing, msg}) => {
  const handleCloseALL = async () => {
    if (handleClose) handleClose();
    if (setshowFollowers) setshowFollowers(false);
    if (setshowFollowing) setshowFollowing(false);
  };
  const theme = useSelector(state => state)
  return (
    <div
      className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}
    >
      <div>
        <Link
          to={`/user/${user._id}`}
          onClick={handleCloseALL}
          className="d-flex align-items-center"
          style={{ textDecoration: "none", color: "#000" }}
        >
          <Avatar src={user.avatar} size="medium-avatar"/>
          <div className="ml-1" style={{ transform: "translateY(-6px)", paddingTop: '10px'}}>
            <span className="d-block">{user.username}</span>
            
            <small style={{ opacity: 0.7}}>
              {
                msg
                ? <>
                    <div>
                      {user.text}
                    </div>
                    {user.media && user.media.length > 0 && 
                      <div >
                        {user.media.length} <i className="fas fa-images" /> 
                      </div>
                    }
                  </>
                : user.fullname
              
              }
              
              
            </small>
          </div>
        </Link>
      </div>
        {children}
    </div>
  );
};

export default UserCard;
