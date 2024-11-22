import React from "react";
import { useSelector } from "react-redux";
import PostCard from "../PostCard";

const Posts = () => {
  const Homepost = useSelector((state) => state.Homepost);
  const theme = useSelector((state) => state.theme);
  return (
    <div className="posts">
      {Homepost.posts.map((post, index) => (
        <PostCard key={post._id} post={post} theme={theme} />
      ))}
    </div>
  );
};

export default Posts;
