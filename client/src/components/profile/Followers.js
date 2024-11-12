import React from "react";
import UserCard from "../UserCard";
import FollowBtn from "./FollowBtn";
import { useSelector } from "react-redux";
const Followers = ({ users, setshowFollowers }) => {
  const auth = useSelector((state) => state.auth);
  return (
    <div className="follow">
      <div className="follow_box">
        <h5 className="text-center">Người theo dõi</h5>
        <hr />

        <div className="follow_content">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              setShowFollowers={setshowFollowers}
            >
              {auth.user._id !== user._id && <FollowBtn user={user} />}
            </UserCard>
          ))}
          <div className="close" onClick={() => setshowFollowers(false)}>
            &times;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Followers;
