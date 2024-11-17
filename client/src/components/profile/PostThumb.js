import React from "react";
import { Link } from "react-router-dom";
const PostThumb = ({ posts, result, theme }) => {
  if (result === 0) return <h5 className="p-4">Chưa có bài viết !</h5>;

  return (
    <div className="post_thumb">
      {posts.map((post) => (
        <Link
          key={post._id}
          to={`/post/${post._id}`}
          style={{ textDecoration: "none" }}
        >
          <div className="post_thumb_display">
            {Array.isArray(post.img) &&
            post.img.length > 0 &&
            post.img[0]?.url ? (
              post.img[0].url.includes("video") ? (
                <video
                  controls
                  src={post.img[0].url}
                  alt={post.img[0].url}
                  style={{ filter: `${theme ? "invert(1)" : "invert(0)"} ` }}
                />
              ) : (
                <img
                  src={post.img[0].url}
                  alt={post.img[0].url}
                  style={{ filter: `${theme ? "invert(1)" : "invert(0)"} ` }}
                />
              )
            ) : (
              <div className="p-4">{post.desc}</div>
            )}
            <div className="post_thumb_menu">
              <i className="fa-solid fa-heart">{post.like.length}</i>
              <i className="fa-solid fa-comment">{post.comments.length}</i>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostThumb;
