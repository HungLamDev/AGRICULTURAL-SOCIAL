import React from "react";
import { useSelector } from "react-redux";
import PostCard from "../PostCard";

const Posts = () => {
  const {Homepost,theme} = useSelector((state) => state);
  return (
    <div className="posts">
      {Homepost.posts.map((post, index) => (
        <PostCard key={post._id} post={post} theme={theme}/>
      ))}
    </div>
  );
};

export default Posts;
