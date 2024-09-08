import React from "react";
import UserCard from "../UserCard";
import FollowBtn from "./FollowBtn";
import { useSelector } from "react-redux";
const Following = ({ users, setshowFollowing }) => {
  const auth = useSelector((state) => state.auth);
  console.log(users);
  return (
    <div className="follow">
      <div className="follow_box">
        <h5 className="text-center">Following</h5>
        <hr />

        <div className="follow_content">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              setshowFollowing={setshowFollowing}
            >
              {auth.user._id !== user._id && <FollowBtn user={user} />}
            </UserCard>
          ))}
          <div className="close" onClick={() => setshowFollowing(false)}>
            &times;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Following;
