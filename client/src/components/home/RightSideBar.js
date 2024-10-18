import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import FollowBtn from "../profile/FollowBtn";
import { getSuggestions } from "../../redux/actions/suggestionAction";
import UserCardVertical from "../UserCardVertical";
import UserCard from "../UserCard";
const RightSideBar = () => {
  const auth = useSelector((state) => state.auth);
  const suggestions = useSelector((state) => state.suggestions);
  const dispatch = useDispatch();

  return (
    <div className="mt-2">
      <UserCard user={auth.user} />
      <div className="d-flex justify-content-between align-items-center  p-2">
        <h5 className="text-secondary">Đề cử cho bạn</h5>
        <i
          className="fas fa-redo"
          onClick={() => dispatch(getSuggestions(auth.token))}
          style={{ cursor: "pointer" }}
        />
      </div>
      {suggestions.loading ? (
        <p>Đang tải dữ liệu ...</p>
      ) : (
        <div
          className="suggestions"
          style={{ overflow: "auto" }}
        >
          {suggestions.users.slice(0, 5).map((user) => (
            <UserCardVertical key={user._id} user={user}>
              <FollowBtn user={user} />
            </UserCardVertical>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightSideBar;
