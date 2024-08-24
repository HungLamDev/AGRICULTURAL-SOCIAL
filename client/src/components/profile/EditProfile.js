import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkImage } from "../../utils/imageUpload";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { updateUserProfile } from "../../redux/actions/profileAction";

const EditProfile = ({ setOnEdit }) => {
  const initState = {
    fullname: "",
    mobile: "",
    address: " ",
    website: "",
    story: "",
    gender: "",
  };
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(initState);
  const { fullname, mobile, address, website, story, gender } = userData;
  const [avatar, setAvatar] = useState("");

  const { auth } = useSelector((state) => state.auth);
  const currentUser = useSelector((state) => state.auth?.user);

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    const err = checkImage(file);
    if (err)
      return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    setAvatar(file);
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  useEffect(() => {
    setUserData(currentUser);
  }, [currentUser]);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateUserProfile({
        userData,
        avatar,
        auth,
      })
    );
    console.log(userData);
  };

  return (
    <div className="edit_profile">
      <button
        className="btn btn-danger btn_close"
        onClick={() => setOnEdit(false)}
      >
        Close
      </button>
      <form onSubmit={handleSubmit}>
        <div className="info_profilePicture">
          <img
            src={avatar ? URL.createObjectURL(avatar) : currentUser.avatar}
            alt="profilePicture"
            height={200}
            width={200}
          />
          <span>
            <i className="fas fa-camera"></i>
            <p>Chỉnh sửa</p>
            <input
              type="file"
              name="file"
              id="file_up"
              accept="image/*"
              onChange={changeAvatar}
            />
          </span>
        </div>
        <div className="form-group my-2">
          <label htmlFor="username">Họ và Tên</label>
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              id="fullname"
              name="fullname"
              value={fullname}
              onChange={handleInput}
            />
            <small
              className="text-danger position-absolute"
              style={{
                top: "50%",
                right: "5px",
                transform: "translateY(-50%)",
              }}
            >
              {fullname.length}/25
            </small>
          </div>
        </div>
        <div className="form-group my-2">
          <label htmlFor="mobile">Số điện thoại</label>
          <input
            type="number"
            name="mobile"
            value={mobile}
            className="form-control"
            onChange={handleInput}
          />
        </div>
        <div className="form-group my-2">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            name="website"
            value={website}
            className="form-control"
            onChange={handleInput}
          />
        </div>
        <div className="form-group my-2">
          <div className="position-relative">
            <label htmlFor="story">Thông tin</label>
            <textarea
              type="text"
              name="story"
              value={story}
              cols={30}
              rows={4}
              className="form-control"
              onChange={handleInput}
            />
            <small
              className="text-danger position-absolute"
              style={{
                top: "90%",
                right: "5px",
                transform: "translateY(-50%)",
              }}
            >
              {story.length}/200
            </small>
          </div>
        </div>
        <label htmlFor="gender">Giới Tính</label>
        <div className="input-group-prepend px-0 mb-4">
          <select
            name="gender"
            id="gender"
            className="custom-select text-capitalize"
            onChange={handleInput}
          >
            <option value="male">Nam</option>
            <option value="fermal">Nữ</option>
            <option value="orther">Khác</option>
          </select>
        </div>
        <button className="btn btn-info w-100 mt-2" type="submit">
          Lưu
        </button>
      </form>
    </div>
  );
};

export default EditProfile;