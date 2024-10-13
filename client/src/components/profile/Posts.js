import React, { useState, useEffect } from "react";
import PostThumb from "./PostThumb";
import { useSelector } from "react-redux";
const Post = ({ auth, id, dispatch, profile }) => {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(4);
  const theme = useSelector((state) => state.theme);
  useEffect(() => {
    const foundData = profile.posts.find((data) => data._id === id);

    if (foundData) {
      setPosts(foundData.posts);
      setResult(foundData.result);
    }
  }, [id, profile.posts]);

  return (
    <div>
      <PostThumb posts={posts} result={result} theme={theme} />
    </div>
  );
};

export default Post;
