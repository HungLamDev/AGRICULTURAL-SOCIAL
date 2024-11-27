import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USERS_LOADING, deleteUser, updateUser } from "../../redux/actions/usersAction";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

const UserInfor = () => {
  const user = useSelector((state) => state.users.user) || {};
  const auth = useSelector((state) => state.auth);
  const notify = useSelector((state) => state.globalNotify); // Lấy thông báo từ Redux

  const initState = {
    id: user._id || "",
    role: user.role || "",
    story: user.story || "",
  };

  const dispatch = useDispatch();
  const [userData, setUserData] = useState(initState);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Đóng modal thông tin
  const handleClose = () => {
    dispatch({ type: USERS_LOADING.LOADING_USER, payload: false });
  };

  // Xử lý thay đổi giá trị input
  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Gửi yêu cầu cập nhật role
  const handleUpdateRole = async () => {
    try {
      await dispatch(
        updateUser({
          userData: { id: userData.id, role: userData.role },
          auth,
        })
      );
      window.location.reload(); // Reload trang sau khi cập nhật role thành công
    } catch (error) {
      console.error("Cập nhật role thất bại:", error);
    }
  };

  // Gửi yêu cầu cập nhật story
  const handleUpdateStory = async () => {
    try {
      await dispatch(
        updateUser({
          userData: { id: userData.id, story: userData.story },
          auth,
        })
      );
      window.location.reload(); // Reload trang sau khi cập nhật story thành công
    } catch (error) {
      console.error("Cập nhật story thất bại:", error);
    }
  };

  // Xử lý khi nhấn nút "Cập nhật"
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userData.story !== user.story) {
      handleUpdateStory();
    }
    if (userData.role !== user.role) {
      handleUpdateRole();
    }
  };

  // Mở và đóng modal xóa
  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  // Xác nhận xóa user
  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteUser({ user, auth }));
      setOpenDeleteModal(false);
      window.location.reload(); // Reload sau khi xóa
    } catch (error) {
      console.error("Xóa người dùng thất bại:", error);
    }
  };

  useEffect(() => {
    if (notify?.success) {
      // Hiển thị thông báo thành công
      alert(notify.success);
    } else if (notify?.err) {
      // Hiển thị thông báo lỗi
      alert(notify.err);
    }
  }, [notify]);

  return (
    <div className="infor_user">
      <form onSubmit={handleSubmit}>
        <div className="infor_title">
          <h5 className="heading">Thông tin</h5>
          <span onClick={handleClose}>&times;</span>
        </div>
        <div className="row">
          <img src={user.avatar} alt="avatar_user" className="col-md-3" />
          <fieldset disabled className="col-md-3">
            <div className="mb-3">
              <label htmlFor="usernameInput" className="form-label heading">
                Username
              </label>
              <input
                type="text"
                id="usernameInput"
                className="form-control"
                value={user.username || ""}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="mobileInput" className="form-label heading">
                Điện thoại
              </label>
              <input
                type="text"
                id="mobileInput"
                className="form-control"
                value={user.mobile || ""}
                readOnly
              />
            </div>
          </fieldset>
          <div className="col-md-3 follower_sub">
            <span className="heading">Người theo dõi</span>
            {user.followers?.map((item) => (
              <div key={item._id}>
                <img src={item.avatar} alt="avatar_user" width={30} />
                <small style={{ paddingLeft: "10px" }}>{item.username}</small>
              </div>
            ))}
          </div>
          <div className="col-md-3 follower_sub">
            <span className="heading">Đang theo dõi</span>
            {user.following?.map((item) => (
              <div key={item._id}>
                <img src={item.avatar} alt="avatar_user" width={30} />
                <small style={{ paddingLeft: "10px" }}>{item.username}</small>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 row pt-4">
            <label className="form-label col-md-1 heading">Roles</label>
            <div className="col-md-2 form-check">
              <input
                type="radio" // Sửa từ checkbox thành radio
                className="form-check-input"
                id="expertRoleRadio"
                value="expert"
                checked={userData.role === "expert"}
                onChange={handleChangeValue}
                name="role"
              />
              <label htmlFor="expertRoleRadio">Expert</label>
            </div>
            <div className="col-md-2 form-check">
              <input
                type="radio" // Sửa từ checkbox thành radio
                className="form-check-input"
                id="userRoleRadio"
                value="user"
                checked={userData.role === "user"}
                onChange={handleChangeValue}
                name="role"
              />
              <label htmlFor="userRoleRadio">User</label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="descTextInput" className="form-label heading">
              Warning!
            </label>
            <textarea
              cols={30}
              rows={4}
              id="descTextInput"
              className="form-control"
              value={userData.story}
              onChange={handleChangeValue}
              name="story"
            />
          </div>
        </div>
        <div className="d-flex justify-content-end mt-2">
          <button className="btn btn-success me-2" type="submit">
            Cập nhật
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleOpenDeleteModal}
          >
            Xoá
          </button>
        </div>
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
