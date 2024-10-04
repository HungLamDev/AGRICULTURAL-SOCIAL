import React, { useEffect, useState } from "react";
import Info from "../../components/profile/Info";
import Posts from "../../components/profile/Posts";
import Saved from "../../components/profile/Saved";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getProfileUsers } from "../../redux/actions/profileAction";
import LoadIcon from "../../images/loading.gif";
import DirayThumb from "../../components/profile/DirayThumb";
import UserProducts from "../../components/profile/UserProduct";
const Profile = () => {
  const profile = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [saveTab, setSaveTab] = useState(false);
  const [diaryTab, setDiaryTab] = useState(false);
  const [postTab, setPostTab] = useState(true);
  const [productTab, setProductTab] = useState(false);

  const handleButtonSaveClick = () => {
    setDiaryTab(false);
    setPostTab(false);
    setSaveTab(true);
    setProductTab(false);
  };

  const handleButtonProductsClick = () => {
    setDiaryTab(false);
    setPostTab(false);
    setSaveTab(false);
    setProductTab(true);
  };

  const handleButtonPostClick = () => {
    setDiaryTab(false);
    setPostTab(true);
    setSaveTab(false);
    setProductTab(false);
  };

  const handleButtonDiaryClick = () => {
    setDiaryTab(true);
    setPostTab(false);
    setSaveTab(false);
    setProductTab(false);
  };

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
          onClick={() => handleButtonPostClick()}
        >
          <i className="fas fa-table"></i>
        </button>
        <button
          className={diaryTab ? "active" : ""}
          onClick={() => handleButtonDiaryClick()}
        >
          <i className="fas fa-book"></i>
        </button>
        <button
          className={productTab ? "active" : ""}
          onClick={() => handleButtonProductsClick()}
        >
          <i className="fas fa-shopping-bag"></i>
        </button>
        {auth.user._id === id && (
          <button
            className={saveTab ? "active" : ""}
            onClick={() => handleButtonSaveClick()}
          >
            <i className="fas fa-bookmark"></i>
          </button>
        )}
      </div>
      {/* <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} /> */}
      {profile.loading ? (
        <i>Đang tải dữ liệu ...</i>
      ) : (
        <>
          {saveTab && <Saved auth={auth} dispatch={dispatch} id={id} />}
          {postTab && (
            <Posts auth={auth} profile={profile} dispatch={dispatch} id={id} />
          )}
          {diaryTab && <DirayThumb auth={auth} />}
          {productTab && <UserProducts id={id} />}
        </>
      )}
    </div>
  );
};

export default Profile;
