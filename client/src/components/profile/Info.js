import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "../Avatar";
import EditProfile from "./EditProfile";
import FollowBtn from "./FollowBtn";
import Followers from "./Followers";
import Following from "./Following";
import { getProfileUsers } from "../../redux/actions/profileAction";

const Info = () => {
  const { id } = useParams();
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);

  const profile = useSelector((state) => state.profile);

  const dispatch = useDispatch();

  const [userData, setUserData] = useState([]);
  const [onEdit, setOnEdit] = useState(false);
  const [showFollowers, setshowFollowers] = useState(false);
  const [showFollowing, setshowFollowing] = useState(false);

  useEffect(() => {
    if (!profile.users) return;

    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const existingUser = profile.users.find((user) => user._id === id);
      if (existingUser) {
        setUserData([existingUser]);
      } else {
        dispatch(getProfileUsers({ users: profile.users, id, auth }));
        const newData = profile.users.filter((user) => user._id === id);
        setUserData(newData);
      }
    }
  }, [id, auth, dispatch, profile.users]);

  return (
    <div className="info">
      {userData.map((user) => (
        <div className="info-container" key={user._id}>
          <Avatar src={user.avatar} theme={theme} size="supper-avatar" />
          <div className="info_content">
            <div className="info_content_title title-content">
              <h2>{user.username}</h2>
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
