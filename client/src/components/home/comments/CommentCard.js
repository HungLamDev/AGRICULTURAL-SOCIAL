import React, { useState, useEffect } from "react";
import Avatar from "../../Avatar";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LikeBtn from "../../LikeBtn";
import CommentInput from "../CommentIput";
import CommentMenu from "./CommentMenu";
import moment from "moment";
const CommentCard = ({ comment, post }) => {
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [readMode, setReadMode] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [onReply, setOnReply] = useState(false);

  useEffect(() => {
    setContent(comment.content);
  }, [auth.user._id, content]);

  const handleLike = async () => {};
  const handleUnLike = async () => {};

  const styleCard = {
    opacity: comment._id ? 1 : 0.5,
    pointerEvent: comment._id ? "inherit" : "none",
  };
  return (
    <div className="comment_card mt-2" style={styleCard}>
      <Link
        to={`user/${comment.user._id}`}
        className="d-flex text-dark mb-2"
        style={{ textDecoration: "none" }}
      >
        <Avatar src={comment.user.avatar} size="small-avatar" theme={theme} />
        <h6 className="mx-1 mb-0">{comment.user.username}</h6>
      </Link>
      <div className="comment_content">
        <div className="flex-fill">
          <div>
            <span>
              {content.length < 100
                ? content
                : readMode
                ? content + ""
                : content.slice(0, 100) + "..."}
            </span>
            {content.length > 100 && (
              <span className="readMode" onClick={() => setReadMode(!readMode)}>
                {readMode ? "Ẩn bớt" : "Xem thêm"}
              </span>
            )}
            <div style={{ cursor: "pointer" }}>
              <small className="text-muted">
                {moment(comment.createdAt).fromNow()}
              </small>
              <small style={{ fontWeight: "bold", margin: "10px" }}>
                {comment.likes.length} Thích
              </small>
              <small
                style={{ fontWeight: "bold", margin: "10px" }}
                //   onClick={handleReply}
              >
                {onReply ? "Đóng" : "Trả lời"}
              </small>
            </div>
          </div>
        </div>
        <LikeBtn
          isLike={isLike}
          handleLike={handleLike}
          handleUnLike={handleUnLike}
        />
        <CommentMenu
          post={post}
          comment={comment}
          auth={auth}
          setOnEdit={setOnEdit}
        />
      </div>
    </div>
  );
};

export default CommentCard;
