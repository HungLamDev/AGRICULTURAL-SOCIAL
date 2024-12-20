import React, { useState, useEffect } from "react";
import Avatar from "../../Avatar";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LikeBtn from "../../LikeBtn";
import CommentInput from "../CommentIput"; // Corrected import
import CommentMenu from "./CommentMenu";
import moment from "moment";
import {
  updateComment,
  likeComment,
  unlikeComment,
} from "../../../redux/actions/commentAction";

const CommentCard = ({ comment, post, commentId, children }) => {
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
    setIsLike(false);
    setOnReply(false);
    if (comment.likes.find((like) => like._id === auth?.user?._id)) {
      setIsLike(true);
    }
  }, [auth?.user?._id, comment]);

  const handleUpdate = () => {
    if (comment.content !== content) {
      dispatch(updateComment({ comment, post, content, auth }));
      setOnEdit(false);
    } else {
      setOnEdit(false);
    }
  };

  const handleLike = async () => {
    if (loadLike) return;
    setIsLike(true);

    setLoadLike(true);
    await dispatch(likeComment({ comment, post, auth }));
    setLoadLike(false);
  };
  const handleUnLike = async () => {
    if (loadLike) return;
    setIsLike(false);

    setLoadLike(true);
    await dispatch(unlikeComment({ comment, post, auth }));
    setLoadLike(false);
  };
  const handleReply = () => {
    if (onReply) return setOnReply(false);
    setOnReply({ ...comment, commentId });
  };

  const styleCard = {
    opacity: comment._id ? 1 : 0.5,
    pointerEvents: comment._id ? "inherit" : "none",
  };

  return (
    <div className="comment_card mt-2" style={styleCard}>
      <Link
        to={`user/${comment.user?._id}`}
        className="d-flex text-dark mb-2"
        style={{ textDecoration: "none" }}
      >
        <Avatar src={comment.user?.avatar} size="small-avatar" theme={theme} />
        <h6 className="mx-1 mb-0">{comment.user?.username}</h6>
      </Link>
      <div className="comment_content">
        <div className="flex-fill"
          style={{
            filter: theme ? "invert(1)" : "invert(0)",
            color: theme ? "white" : "black",
          }}
        >
          {onEdit ? (
            <textarea
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <div>
              {comment.tag && (
                <Link
                  to={`user/${comment?.tag?._id}`}
                  style={{ paddingRight: "10px", textDecoration: "none" }}
                >
                  @{comment?.tag?.username}
                </Link>
              )}
              <span>
                {content.length < 100
                  ? content
                  : readMode
                  ? content + ""
                  : content.slice(0, 100) + "..."}
              </span>
              {content.length > 100 && (
                <span
                  className="readMode"
                  onClick={() => setReadMode(!readMode)}
                >
                  {readMode ? "Ẩn bớt" : "Xem thêm"}
                </span>
              )}
            </div>
          )}
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

      <div style={{ cursor: "pointer" }}>
        <small className="text-muted">
          {moment(comment.createdAt).fromNow()}
        </small>
        <small style={{ fontWeight: "bold", margin: "10px" }}>
          {comment.likes.length} Thích
        </small>
        {onEdit ? (
          <>
            <small
              style={{ fontWeight: "bold", margin: "10px" }}
              onClick={handleUpdate}
            >
              Cập nhật
            </small>
            <small
              style={{ fontWeight: "bold", margin: "10px" }}
              onClick={() => setOnEdit(false)}
            >
              Đóng
            </small>
          </>
        ) : (
          <small
            style={{ fontWeight: "bold", margin: "10px" }}
            onClick={handleReply}
          >
            {onReply ? "Đóng" : "Trả lời"}
          </small>
        )}
      </div>
      {onReply && (
        <CommentInput post={post} onReply={onReply} setOnReply={setOnReply}>
          <Link to={`user/${onReply.user?._id}`} className="mr-1">
            <Avatar
              src={onReply.user?.avatar}
              size="small-avatar"
              theme={theme}
            />
          </Link>
        </CommentInput>
      )}

      <div>{children}</div>
    </div>
  );
};

export default CommentCard;
