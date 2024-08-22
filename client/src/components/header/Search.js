import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import UserCard from '../UserCard';
import { IoIosSearch } from "react-icons/io";
import loadIcon from '../../images/loading.gif';

const Search = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(false);

  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    try {
      setLoad(true);
      const res = await getDataAPI(`search?username=${search}`, auth.token);
      if (res.data.users.length === 0) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { error: 'Người dùng không tồn tại!' }
        });
      }
      setUsers(res.data.users);
      setLoad(false);
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.msg || 'An error occurred' },
      });
    }
  };

  const handleClose = () => {
    setSearch('');
    setUsers([]);
  };

  return (
    <form className='search_form' onSubmit={handleSearch}>
      <input
        type="text"
        name="search"
        value={search}
        id="search"
        title="Enter to Search"
        onChange={e => setSearch(e.target.value.toLowerCase().replace(/ /g, ''))}
      />
      {users.length === 0 && (
        <div className='search_icon' style={{ opacity: search ? 0 : 0.3 }}>
          <span className='material-icons'>search</span>
          <span>search</span>
        </div>
      )}
      {users.length > 0 && (
        <div
          className='close_search'
          style={{ opacity: 1 }}
          onClick={handleClose}
        >
          &times;
        </div>
      )}
      <button
        className='submit'
        type='submit'
        disabled={!search || load}
        style={{ display: users.length === 0 ? 'block' : 'none', opacity: search ? 1 : 1 }}
      >
        <IoIosSearch />
      </button>

      {load && <img className='loading' src={loadIcon} alt='loading' />}
      <div className="users">
          {
              search && users.map(user => (
                  <UserCard 
                  key={user._id} 
                  user={user} 
                  border="border"
                  handleClose={handleClose} 
                  />
              ))
          }
      </div>
    </form>
  );
};

export default Search;
