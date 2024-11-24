import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createComment } from "../../redux/actions/commentAction";
import Icons from "../Icons";


const CommentInput = ({ children, post, onReply, setOnReply }) => {
  const [content, setContent] = useState("");
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);
  const socket = useSelector((state) => state.socket);
  const dispatch = useDispatch();

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
    dispatch(createComment({ post, newComment, auth, socket }));
    if (setOnReply) return setOnReply(false);
  };

  return (
    <form
      className={`comment_form ${theme ? "dark_mode" : "light_mode"}`}
      onSubmit={handleSubmit}
    >
      {children}

      <div className="comment_row">
        <Icons setContent={setContent} content={content} theme={theme} />
        <input
          type="text"
          className="comment_input"
          placeholder="Nhập bình luận ..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="comment_button"
        >
          Bình luận
        </button>
      </div>
    </form>
  );
};

export default CommentInput;
