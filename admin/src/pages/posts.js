import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { POSTS_LOADING, getPosts } from "../redux/actions/postsAction";
import PostInfor from "../component/posts/PostInfor";

const PostsPage = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const auth = useSelector((state) => state.auth);
  const loadingPost = useSelector((state) => state.posts.loadingPost);

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleGetPost = (post) => {
    dispatch({ type: POSTS_LOADING.LOADING_POST, payload: true });
    dispatch({ type: POSTS_LOADING.GET_POST, payload: post });
  };

  const handleFilter = (event) => {
    const filterValue = event.target.value.toLowerCase();
    const filtered = posts.filter((post) =>
      (post._id && post._id.toLowerCase().includes(filterValue)) ||
      (post.user?.username && post.user.username.toLowerCase().includes(filterValue)) ||
      (post.desc && post.desc.toLowerCase().includes(filterValue)) ||
      (post.hashtag && post.hashtag.toLowerCase().includes(filterValue))
    );
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  };

  useEffect(() => {
    if (posts.length === 0) dispatch(getPosts({ auth }));
  }, [posts, auth, dispatch]);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  return (
    <div className="posts">
      {loadingPost && <PostInfor />}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm..."
          onChange={handleFilter}
        />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Desc</th>
            <th>Pic</th>
            <th>Hashtag</th>
            <th>Like</th>
            <th>Cmt</th>
            <th>Create</th>
            <th>Update</th>
            <th>Act</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post._id}>
              <td>{post._id}</td>
              <td>{post.user ? post.user.username : "No user"}</td>
              <td>{post.desc ? post.desc.slice(0, 30) : "No description"}...</td>
              <td>{post.img.length}</td>
              <td>{post.hashtag ? post.hashtag.slice(0, 30) : "No hashtag"}...</td>
              <td>{post.like.length}</td>
              <td>{post.comments.length}</td>
              <td>{new Date(post.createdAt).toLocaleString()}</td>
              <td>{new Date(post.updatedAt).toLocaleString()}</td>
              <td onClick={() => handleGetPost(post)}>Xem</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostsPage;
