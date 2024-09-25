import React, { useEffect, useState } from "react";
import Info from "../../components/profile/Info";
import Posts from "../../components/profile/Posts";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getProfileUsers } from "../../redux/actions/profileAction";
import LoadIcon from "../../images/loading.gif";
const Profile = () => {
  const profile = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [saveTab, setSaveTab] = useState(false);
  const [diaryTab, setDiaryTab] = useState(false);
  const [postTab, setPostTab] = useState(true);
  const [productTab, setProductTab] = useState(false);

  const { id } = useParams();
  useEffect(() => {
    if (profile.ids.every((item) => item !== id)) {
      dispatch(getProfileUsers({ users: profile.users, id, auth }));
    }
  }, [auth, dispatch, id, profile.ids, profile.users]);
  return (
    <div className="profile">
      <Info auth={auth} profile={profile} dispatch={dispatch} id={id} />
      <div className="profile_tab">
        <button
          className={postTab ? "active" : ""}
          // onClick={() => handleButtonPostClick()}
        >
          <i className="fas fa-table"></i>
        </button>
        <button
          className={diaryTab ? "active" : ""}
          // onClick={() => handleButtonDiaryClick()}
        >
          <i className="fas fa-book"></i>
        </button>
        <button
          className={productTab ? "active" : ""}
          // onClick={() => handleButtonProductsClick()}
        >
          <i className="fas fa-shopping-bag"></i>
        </button>
        {auth.user._id === id && (
          <button
            className={saveTab ? "active" : ""}
            // onClick={() => handleButtonSaveClick()}
          >
            <i className="fas fa-bookmark"></i>
          </button>
        )}
      </div>
      <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
    </div>
  );
};

export default Profile;
