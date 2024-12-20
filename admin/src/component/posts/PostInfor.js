import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  POSTS_LOADING,
  deletePost,
  updatePost,
} from "../../redux/actions/postsAction";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

const PostInfor = () => {
  const post = useSelector((state) => state.posts.post);
  const auth = useSelector((state) => state.auth);
  const { success, error } = useSelector((state) => state.global || {}); // Lấy success và error từ Redux

  const dispatch = useDispatch();
  const [postData, setPostData] = useState({
    desc: "",
    userId: post.user._id,
    id: post._id,
  });

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Lắng nghe sự thay đổi của success và error
  useEffect(() => {
    if (success) {
      alert(success); // Hiển thị thông báo thành công
    }
    if (error) {
      alert(error); // Hiển thị thông báo lỗi
    }
  }, [success, error]); // Chạy lại khi success hoặc error thay đổi

  const handleClose = () => {
    dispatch({ type: POSTS_LOADING.LOADING_POST, payload: false });
  };

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };

  const handleOpenDeleteModal = () => setOpenDeleteModal(true);
  const handleCloseDeleteModal = () => setOpenDeleteModal(false);

  const handleConfirmDelete = async () => {
    dispatch(deletePost({ post, auth }));
    setOpenDeleteModal(false);
  };

  const imageShow = (src) => {
    return <img src={src} alt="images" style={{ maxHeight: "200px" }} />;
  };

  const videoShow = (src) => {
    return (
      <video controls src={src} alt="images" style={{ maxHeight: "200px" }} />
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updatePost({
        postData,
        auth,
      })
    );
  };

  return (
    <div className="post_infor">
      <div className="post_infor_container">
        <div className="infor_title_post">
          <h5>Chi tiết bài viết</h5>
          <span onClick={() => handleClose()}>&times;</span>
        </div>
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <td>{post?._id}</td>
            </tr>
            <tr>
              <th>Username</th>
              <td>{post.user?.username}</td>
            </tr>
            <tr>
              <th>Desc</th>
              <td>{post?.desc}</td>
            </tr>
            <tr>
              <th>Pic</th>
              <td className="d-flex flex-wrap justify-content-start align-items-center">
                {post.img.map((item, i) => (
                  <div key={i} className="image-container">
                    {item.url && (
                      <>
                        {item.url.match(/video/i)
                          ? videoShow(item.url)
                          : imageShow(item.url)}
                      </>
                    )}
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <th>Hashtag</th>
              <td>{post.hashtag}</td>
            </tr>
            <tr>
              <th>Like</th>
              <td>{post.like.length}</td>
            </tr>
            <tr>
              <th>Cmt</th>
              <td>{post.comments.length}</td>
            </tr>
            <tr>
              <th>Create</th>
              <td>{new Date(post.createdAt).toLocaleString()}</td>
            </tr>
            <tr>
              <th>Update</th>
              <td>{new Date(post.updatedAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <form onSubmit={handleSubmit} className="pt-4">
          <label htmlFor="descTextInput" className="form-label">
            Warning !
          </label>
          <textarea
            col={30}
            rows={4}
            type="text"
            id="descTextInput"
            className="form-control"
            value={postData.desc}
            onChange={handleChangeValue}
            name="desc"
          />
          <div className="d-flex justify-content-end mt-2">
            <div>
              <button className="btn btn-success me-2" type="submit">
                Cập nhật
              </button>
            </div>
            <div>
              <button
                className="btn btn-danger"
                onClick={handleOpenDeleteModal}
                type="button"
              >
                Xoá
              </button>
            </div>
          </div>
        </form>

        <ConfirmDeleteModal
          open={openDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Xóa bài viết"
          content="Bạn có chắc chắn muốn xóa bài viết này?"
        />
      </div>
    </div>
  );
};

export default PostInfor;
