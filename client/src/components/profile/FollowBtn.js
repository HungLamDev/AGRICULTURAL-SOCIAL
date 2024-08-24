import React from "react";

const FollowBtn = ({ user }) => {
  console.log({ user });
  return (
    <>
      <button className="btn btn-outline-danger">Bỏ theo dõi</button>

      <button className="btn btn-outline-primary">Theo dõi</button>
    </>
  );
};

export default FollowBtn;
