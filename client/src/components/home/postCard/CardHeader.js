import React from "react";
import Avatar from "../../Avatar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../../../redux/actions/globalTypes";
import { deletePost } from "../../../redux/actions/postAction";
import { BASE_URL } from "../../../utils/config";
import moment from "moment";

// import { createReport } from "../../../redux/actions/reportAction";

const CardHeader = ({ post }) => {
  const auth = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state);

  // const socket = useSelector((state) => state.socket);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditPost = () => {
    console.log(post);
    dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
  };
  // const handleDeletePost = () => {
  //   const confirmDelete = window.confirm(
  //     "Bạn có chắc chắn muốn xóa bài viết này?"
  //   );
  //   if (confirmDelete) {
  //     dispatch(deletePost({ post, auth, socket }));
  //     return navigate("/");
  //   }
  // };

  // const handleCopyLink = () => {
  //   navigator.clipboard
  //     .writeText(`${BASE_URL}/post/${post._id}`)
  //     .then(() => {
  //       dispatch({
  //         type: GLOBALTYPES.NOTIFY,
  //         payload: { success: "Đã sao chép liên kết thành công" },
  //       });
  //     })
  //     .catch((error) => {
  //       dispatch({
  //         type: GLOBALTYPES.NOTIFY,
  //         payload: { err: "Lỗi khi sao chép:" + error },
  //       });
  //     });
  // };

  // const handleReport = () => {
  //   const confirmReport = window.prompt("Lý do báo cáo: ");
  //   if (confirmReport) {
  //     const report = {
  //       user: auth.user._id,
  //       related: post._id,
  //       text: confirmReport,
  //       type: "post",
  //     };
  //     dispatch(createReport({ report, auth }));
  //     dispatch({
  //       type: GLOBALTYPES.NOTIFY,
  //       payload: { success: "Cảm ơn bạn đã đóng góp !" },
  //     });
  //   }
  // };

  return (
    <div className="card_header">
      <div className="d-flex">
        <Avatar src={post.user.avatar} theme={theme} size="big-avatar" />

        <div className="card_name m-2">
          <h6>
            <Link
              to={`user/${post.user._id}`}
              className="text-dark"
              style={{ textDecoration: "none" }}
            >
              {post.user.username}
            </Link>
            {post.user.role === "expert" && (
              <i
                className="fa-solid fa-circle-check text-success"
                style={{ fontSize: "10px", paddingLeft: "5px" }}
              ></i>
            )}
          </h6>
          <p className="m-0 text-muted" style={{ fontSize: "0.7rem" }}>
            {moment(post.createdAt).fromNow()}
          </p>
        </div>
      </div>

      <div className="nav-item dropdown">
        <span
          className="material-icons"
          id="moreLink"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          more_horiz
        </span>
        <div className="dropdown-menu">
          {auth?.user?._id === post?.user?._id && (
            <>
              <div className="dropdown-item" onClick={handleEditPost}>
                <span className="material-symbols-outlined">edit</span> Chỉnh
                sửa bài viết
              </div>
              {/* onClick={handleDeletePost} */}
              <div className="dropdown-item">
                <span className="material-symbols-outlined">delete</span> Xóa
                bài viết
              </div>
            </>
          )}
          {/* onClick={handleCopyLink} */}
          <div className="dropdown-item">
            <span className="material-symbols-outlined">share</span> Sao chép
            liên kết
          </div>
          {/* onClick={handleReport} */}
          <div className="dropdown-item">
            <span className="material-symbols-outlined">report</span> Báo cáo
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
