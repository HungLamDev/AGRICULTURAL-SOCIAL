import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  USERS_LOADING,
  deleteUser,
  updateUser,
} from "../../redux/actions/usersAction";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

const UserInfor = () => {
  const user = useSelector((state) => state.users.user);
  const auth = useSelector((state) => state.auth);

  const initState = {
    id: user._id,
    role: user.role,
    story: user.story,
  };

  const dispatch = useDispatch();
  const [userData, setUserData] = useState(initState);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleClose = () => {
    dispatch({ type: USERS_LOADING.LOADING_USER, payload: false });
  };

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ userData, auth });
    dispatch(
      updateUser({
        userData,
        auth,
      })
    );
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  // Hàm xác nhận xóa
  const handleConfirmDelete = () => {
    dispatch(deleteUser({ user, auth }));
    setOpenDeleteModal(false);
    window.location.reload();
  };

  return (
    <div className="infor_user">
      <form onSubmit={handleSubmit}>
        <div className="infor_title">
          <h5 className="heading">Thông tin</h5>
          <span onClick={() => handleClose()}>&times;</span>
        </div>
        {/* disabled username, phone */}
        <div className="row">
          <img src={user.avatar} alt="avatar_user" className="col-md-3" />
          <fieldset disabled className="col-md-3">
            <div className="mb-3">
              <label htmlFor="disabledTextInput" className="form-label heading">
                Username
              </label>
              <input
                type="text"
                id="disabledTextInput"
                className="form-control"
                value={user.username}
                onChange={handleChangeValue}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="disabledTextInput" className="form-label heading">
                Điện thoại
              </label>
              <input
                type="text"
                id="disabledTextInput"
                className="form-control"
                value={user.mobile}
                onChange={handleChangeValue}
              />
            </div>
          </fieldset>
          {/* follower and sub */}
          <div className="col-md-3 follower_sub">
            <span className="heading">Người theo dõi</span>
            {user.followers.map((item) => (
              <div key={item._id}>
                <img src={item.avatar} alt="avatar_user" width={30} />
                <small style={{ paddingLeft: "10px" }}>{item.username}</small>
              </div>
            ))}
          </div>
          <div className="col-md-3 follower_sub">
            <span className="heading">Đang theo dõi</span>
            {user.following.map((item) => (
              <div key={item._id}>
                <img src={item.avatar} alt="avatar_user" width={30} />
                <small style={{ paddingLeft: "10px" }}>{item.username}</small>
              </div>
            ))}
          </div>
        </div>

        <div>
          {/* checkbox roles */}
          <div className="mb-3 row pt-4">
            <label className="form-label col-md-1 heading">Roles </label>
            <div className="col-md-2 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="expertRoleCheckbox"
                value="expert"
                checked={userData.role === "expert"}
                onChange={handleChangeValue}
                name="role"
              />
              <label htmlFor="expertRoleCheckbox">Expert</label>
            </div>
            <div className="col-md-2 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="userRoleCheckbox"
                value="user"
                checked={userData.role === "user"}
                onChange={handleChangeValue}
                name="role"
              />
              <label htmlFor="userRoleCheckbox">User</label>
            </div>
          </div>
          {/* warning */}
          <div className="mb-3">
            <label htmlFor="descTextInput" className="form-label heading">
              Warning !
            </label>
            <textarea
              col={30}
              rows={4}
              type="text"
              id="descTextInput"
              className="form-control"
              value={userData.story}
              onChange={handleChangeValue}
              name="story"
            />
          </div>
        </div>
        <button className="btn btn-success w-100 mt-2" type="submit">
          Cập nhật
        </button>
        <button
          className="btn btn-danger w-100 mt-2"
          onClick={handleOpenDeleteModal}
        >
          Xoá
        </button>
      </form>
      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xóa người dùng"
        content="Bạn có chắc chắn muốn xóa người dùng này?"
      />
    </div>
  );
};

export default UserInfor;
