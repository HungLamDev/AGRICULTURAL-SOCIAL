import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import UserCard from "../UserCard";
import { Link } from "react-router-dom";

const Search = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadData, setLoadData] = useState(false);
  const theme = useSelector((state) => state?.theme);
  const auth = useSelector((state) => state.auth?.token);

  const dispatch = useDispatch();

  const handleClose = () => {
    setSearch("");
    setUsers([]);
    setPosts([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    if (!search.trim()) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: "Vui lòng nhập từ khóa tìm kiếm!" },
      });
      return;
    }

    try {
      setLoadData(true);
      await getDataAPI(`search?search=${search}`, auth).then((res) => {
        const result = res.data;
        if (result.users.length === 0 && result.posts.length === 0) {
          console.log("No users or posts found, dispatching alert...");
          dispatch({
            type: GLOBALTYPES.ALERT,
            payload: { err: "Không tìm thấy!" },
          });
        } else {
          setUsers(result.users);
          setPosts(result.posts);
        }
      });

      setLoadData(false);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response?.statusText || "Đã xảy ra lỗi!" },
      });
      setLoadData(false);
    }
  };

  return (
    <form className="search_box" onSubmit={handleSearch} 
    style={{
      filter: theme ? 'invert(1)' : 'none', 
    }}
    >
      <input
        type="text"
        name="search"
        value={search}
        id="search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="search_icon" style={{ opacity: search ? 0 : 0.5 }}>
        <span className="material-icons">search</span>
        <span>Tìm kiếm ...</span>
      </div>
      {!loadData && (
        <div className="close_search" onClick={handleClose}>
          &times;
        </div>
      )}
      {loadData && (
        <div className="d-flex align-items-center loading_icon">
          <div
            className="spinner-border ms-auto"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      )}

      <button type="submit" style={{ display: "none"}}> 
        Tìm Kiếm
      </button>
      <div className="search_result">
        <div className="users">
          {search &&
            users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                boder="boder"
                handleClose={handleClose}
                theme={theme}
              />
            ))}
        </div>
        <div className="posts">
          {search &&
            posts.map((post) => (
              <Link
                to={`post/${post._id}`}
                key={post._id}
                style={{ textDecoration: "none", color: "#000" }}
                onClick={() => handleClose()}
              >
                <div
                  style={{
                    padding: "10px",
                    borderTop: "1px solid #ccc",
                    fontSize: "0.9rem",
                  }}
                >
                  {post.desc.slice(0, 70)} ...
                </div>
              </Link>
            ))}
        </div>
      </div>
    </form>
  );
};

export default Search;
