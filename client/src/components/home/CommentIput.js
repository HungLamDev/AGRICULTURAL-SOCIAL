import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createComment } from "../../redux/actions/commentAction";
import Icons from "../Icons";
const CommentIput = ({ children, post, onReply, setOnReply }) => {
  const [content, setContent] = useState("");
  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      if (setOnReply) return setOnReply(false);
      return;
    }
    setContent("");
    const newComment = {
      content,
      likes: [],
      user: auth.user,
      createdAt: new Date().toISOString(),
      reply: onReply && onReply.commentId,
      tag: onReply && onReply.user,
    };
    console.log({ newComment });
    dispatch(createComment({ post, newComment, auth, socket }));
  };
  const dispatch = useDispatch();

  return (
    <form className="card_footer comment_input" onSubmit={handleSubmit}>
      {children}
      <input
        type="text"
        placeholder="Nhập bình luận ..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button type="submit" className="commentBtn">
        Bình luận
      </button>
      <Icons
        setContent={setContent}
        content={content}
        style={{
          border: "none",
          outline: "none",
          background: "var(--bg-color)",
          fontWeight: 600,
          color: "var(--dark-screen)",
          padding: "10px",
        }}
      />
    </form>
  );
};

export default CommentIput;
