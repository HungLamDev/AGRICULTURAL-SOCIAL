import React, { useState, useEffect } from "react";
import CommentDisplay from "./comments/CommentDisplay";
const Comments = ({ post }) => {
  return (
    <div className="comments">
      {post.comments.map((comment, index) => (
        <CommentDisplay key={comment._id} post={post} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
