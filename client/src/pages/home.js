import React, { useState } from "react";
import Status from "../components/home/Status";
import Posts from "../components/home/Posts";
import { useSelector } from "react-redux";
import LoadIcon from "../images/loading.gif";
import RightSideBar from "../components/RightSideBar";
const Home = () => {
  const postHome = useSelector((state) => state.Homepost);

  return (
    <div className="home row mx-0">
      <div>
        <Status />
        <RightSideBar />
        {postHome.loading ? (
          <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
        ) : postHome.result === 0 && postHome.posts.length === 0 ? (
          <h2 className="text-center">No Post</h2>
        ) : (
          <Posts />
        )}
      </div>
    </div>
  );
};

export default Home;
