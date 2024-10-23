import React, { useEffect } from "react";
import Status from "../components/home/Status";
import Posts from "../components/home/Posts";
import { useSelector } from "react-redux";
import LoadIcon from "../images/loading.gif";
import RightSideBar from "../components/home/RightSideBar";
let scroll = 0;
const Home = () => {
  const postHome = useSelector((state) => state.Homepost);
  window.addEventListener("scroll", () => {
    if (window.location.pathname === "/") {
      scroll = window.pageYOffset;
      return scroll;
    }
  });

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: scroll, behavior: "smooth" });
    }, 100);
  }, []);

  return (
    <div
      className="home row d-flex justify-content-center mx-auto"
      style={{
        maxWidth: "1300px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <div className="home row" style={{ width: "100%" }}>
        <div className=" col-md-8 mb-3">
          <Status />
          {postHome.loading ? (
            <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
          ) : postHome.result === 0 && postHome.posts.length === 0 ? (
            <h2 className="text-center">Không có bài viết nào !</h2>
          ) : (
            <Posts />
          )}
        </div>
        <div className=" col-md-4">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
};

export default Home;
