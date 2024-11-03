import React from "react";
import CardBody from "./home/postCard/CardBody";
import CardFooter from "./home/postCard/CardFooter";
import CardHeader from "./home/postCard/CardHeader";

import CommentInput from "./home/CommentIput";
import Comments from "./home/Comments";

const PostCard = ({ post, theme }) => {
  return (
    <div className="card my-3 d-flex justify-content-center mx-auto" 
    style={{
      maxWidth: "800px",
      width: "100%",
      margin: "0 auto",
    }}> 
    
      <CardHeader post={post} />
      <CardBody post={post}  theme={theme}/>
      <CardFooter post={post} />

      <Comments post={post} />
      <CommentInput post={post} />
    </div>
  );
};

export default PostCard;
