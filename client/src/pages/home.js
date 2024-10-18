import React, { useState } from "react";
import Status from "../components/home/Status";
import Posts from "../components/home/Posts";
import { useSelector } from "react-redux";
import LoadIcon from "../images/loading.gif";
import RightSideBar from "../components/home/RightSideBar";
const Home = () => {
  const postHome = useSelector((state) => state.Homepost);

  return (
    <div
      className="home d-flex justify-content-center mx-auto"
      style={{
        maxWidth: '1000px', 
        width: '100%',     
        margin: '0 auto',   
      }}
    >
      <div className="row" style={{ width: '100%' }}>
        <div className="col-12 col-md-8 mb-3">
          <Status />
          {postHome.loading ? (
            <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
          ) : postHome.result === 0 && postHome.posts.length === 0 ? (
            <h2 className="text-center">No Post</h2>
          ) : (
            <Posts />
          )}
        </div>
        <div className="col-12 col-md-4">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
  

};

export default Home;
