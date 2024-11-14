import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { USERS_LOADING, getUsers } from "../redux/actions/usersAction";
import UserInfor from "../component/users/UserInfor";

const UsersPage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const auth = useSelector((state) => state.auth);
  const loadingUser = useSelector((state) => state.users.loadingUser);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFilter = (event) => {
    const filterValue = event.target.value.toLowerCase();
    const filteredUsers = users.filter((user) =>
      ["_id", "username", "phoneNumber", "role"].some(
        (key) =>
          user[key] &&
          user[key].toString().toLowerCase().includes(filterValue)
      )
    );
    setFilteredUsers(filteredUsers);
    setCurrentPage(1); 
  };

  const handleGetUser = (user) => {
    dispatch({ type: USERS_LOADING.LOADING_USER, payload: true });
    dispatch({ type: USERS_LOADING.GET_USER, payload: user });
  };

  useEffect(() => {
    if (users.length === 0) dispatch(getUsers({ auth }));
  }, [users.length, dispatch, auth]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const sortedUsers = filteredUsers.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="users">
      {loadingUser && <UserInfor />}
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
            <th>Phone Number</th>
            <th>Fol</th>
            <th>Sub</th>
            <th>Saved</th>
            <th>Roles</th>
            <th>Create</th>
            <th>Update</th>
            <th>Act</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.mobile}</td>
              <td>{user.followers.length}</td>
              <td>{user.following.length}</td>
              <td>{user.saved.length}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>{new Date(user.updatedAt).toLocaleString()}</td>
              <td onClick={() => handleGetUser(user)}>Xem</td>
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersPage;