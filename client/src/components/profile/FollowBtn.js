import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { follow, unfollow } from "../../redux/actions/profileAction";

const FollowBtn = ({ user }) => {
  const [followed, setFollowed] = useState(false);
  const auth = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.profile);
  const socket = useSelector((state) => state.socket);

  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (auth.user && Array.isArray(auth.user.following)) {
      setFollowed(
        auth.user.following.find((item) => item._id === user._id) !== undefined
      );
    }
    return () => setFollowed(false);
  }, [auth.user.following, user._id]);
  const handleFollow = async () => {
    if (load) return;
    setFollowed(true);
    setLoad(true);
    await dispatch(follow({ users: profile.users, user, auth, socket }));
    setLoad(false);
  };
  const handleUnFollow = async () => {
    if (load) return;
    setFollowed(false);
    setLoad(true);
    await dispatch(unfollow({ users: profile.users, user, auth, socket }));
    setLoad(false);
  };

  return (
    <>
      {followed ? (
        <button className="btn btn-outline-danger  " onClick={handleUnFollow}>
          Bỏ theo dõi
        </button>
      ) : (
        <button className="btn btn-outline-primary" onClick={handleFollow}>
          Theo dõi
        </button>
      )}
    </>
  );
};

export default FollowBtn;
