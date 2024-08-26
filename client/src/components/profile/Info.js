import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '../Avatar';
import { getProfileUsers } from '../../redux/actions/profileAction';

const Info = () => {
  const { id } = useParams();
  const { auth, profile } = useSelector(state => state);
  const dispatch = useDispatch();

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    if (!profile.users) return; 

    if (id === auth.user._id) {
      setUserData([auth.user]);
    } else {
      const existingUser = profile.users.find(user => user._id === id);
      if (existingUser) {
        setUserData([existingUser]);
      } else {
        dispatch(getProfileUsers({ users: profile.users, id, auth }));
      }
    }
  }, [id, auth, dispatch, profile.users]);

  return (
    <div className='info'>
      {userData.map(user => (
        <div className='info-container' key={user._id}>
          <Avatar src={user.avatar} size="supper-avatar" />
          <div className='info_content'>
            <div className='info_content_title'>
              <h2>{user.username}</h2>
              <button className='btn btn-outline-info'>
                Chỉnh sửa thông tin 
              </button>
            </div>
            <div className='follow_btn'>
              <span className='mr-4'>
                {user.followers.length} Followers
              </span>
              <span className='ml-4'>
                {user.following.length} Following
              </span>
            </div>
            <h6>{user.fullname} {user.mobile}</h6>
            <p className='m-0'>{user.address}</p>
            <h6>{user.email}</h6>
            <a href={user.website} target="_blank" rel="noreferrer">
              {user.website}  
            </a>
            <p>{user.story}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Info;
