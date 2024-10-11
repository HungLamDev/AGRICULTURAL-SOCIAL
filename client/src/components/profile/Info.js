import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "../Avatar";
import EditProfile from "./EditProfile";
import FollowBtn from "./FollowBtn";
import Followers from "./Followers";
import Following from "./Following";
import { getProfileUsers } from "../../redux/actions/profileAction";

import { GLOBALTYPES } from "../../redux/actions/globalTypes";

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

  useEffect(() => {
    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const newData = profile.users.filter((user) => user._id === id);
      console.log("ID for comparison:", id);
      console.log({ newData });
      setUserData(newData);
    }
  }, [auth, dispatch, id, profile.users]);
  useEffect(() => {
    if (showFollowers || showFollowing || onEdit) {
      dispatch({ type: GLOBALTYPES.MODAl, payload: true });
    } else {
      dispatch({ type: GLOBALTYPES.MODAl, payload: false });
    }
  }, [showFollowers, showFollowing, onEdit, dispatch]);
  return (
    <div className="info">
      {userData.map((user) => (
        <div className="info-container" key={user._id}>
          <Avatar src={user.avatar} size="supper-avatar" theme={theme} />
          <div className="info_content">
            <div className="info_content_title title-content">
              <h2 style={{ fontWeight: "bold" }}>{user.username}</h2>
              {user._id === auth.user._id ? (
                <button
                  className="btn btn-outline-info"
                  onClick={() => setOnEdit(true)}
                >
                  Chỉnh sửa thông tin
                </button>
              ) : (
                <FollowBtn user={user} />
              )}
            </div>
            <div className="follow_btn">
              <span className="mr-4" onClick={() => setshowFollowers(true)}>
                {user.followers.length} Followers
              </span>
              <span className="ml-4" onClick={() => setshowFollowing(true)}>
                {user.following.length} Following
              </span>
            </div>
            <h6>
              {user.fullname} {user.mobile}
            </h6>
            <p className="m-0">{user.address}</p>
            <h6>{user.email}</h6>
            <a href={user.website} target="_blank" rel="noreferrer">
              {user.website}
            </a>
            <p>{user.story}</p>
          </div>
          {onEdit && <EditProfile setOnEdit={setOnEdit} />}
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
    </div>
  );
};

export default Info;
