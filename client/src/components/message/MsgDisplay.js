import React from 'react';
import Avatar from '../Avatar';
import { videoShow, imageShow } from '../../utils/mediaShow';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMessages } from '../../redux/actions/messageAction';

const MsgDisplay = ({ user, msg, theme, data }) => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleDeleteMessages = async () => {
    if (window.confirm('Bạn có chắc muốn xóa tin nhắn này?')) {
      dispatch(deleteMessages({ msg, data, auth }));
    }
  };

  return (
    <>
      <div className='chat_title pt-2'>
        <Avatar src={user.avatar} size="medium-avatar" />
        <span className='pl-1'>{user.username}</span>
      </div>
      <div className='you_content'>
        {user._id === auth.user._id && (
          <i className='fas fa-trash text-danger' onClick={handleDeleteMessages} />
        )}
        {msg.text && (
          <div className='chat_text' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
            {msg.text}
          </div>
        )}
        {msg.media.map((item, index) => (
          <div key={index} style={{ width: '100%', filter: theme ? 'invert(1)' : 'invert(0)' }}>
            {item.url.match(/video/i) ? videoShow(item.url, theme) : imageShow(item.url, theme)}
          </div>
        ))}
      </div>
      <div className='chat_time p-2'>{new Date(msg.createdAt).toLocaleString()}</div>
    </>
  );
};

export default MsgDisplay;
