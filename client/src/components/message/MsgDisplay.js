import React from 'react';
import Avatar from '../Avatar';
import { videoShow, imageShow } from '../../utils/mediaShow';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMessages } from '../../redux/actions/messageAction';
import Times from './Times';

import { FaPhoneSlash,FaPhone  } from "react-icons/fa6";
import {FaVideo } from 'react-icons/fa';
import { IoVideocamOff } from "react-icons/io5";

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
        {
          user._id === auth.user._id && (<i className='fas fa-trash text-danger' onClick={handleDeleteMessages} />)
        }
        {
          msg.text && (
            <div className='chat_text' style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}>
              {msg.text}
            </div>
            )
        }
        {
          msg.media.map((item, index) => (
            <div key={index} style={{ maxWidth: '300px', filter: theme ? 'invert(1)' : 'invert(0)' }}>
              {item.url.match(/video/i) ? videoShow(item.url, theme) : imageShow(item.url, theme)}
            </div>
          ))
        }
        {
          msg.call && 
          <button className='btn d-flex align-align-items-center py-3'
          style={{background: '#eee', borderRadius: '10px', color: 'black'}}
          >
            <span className='material-icons font-weight-bold mr-1'
            style={{
              fontSize: '2.0rem', color: msg.call.times === 0 ? 'crimson' : 'green',
              filter: theme ? 'invert(1)' : 'invert(0)'
            }}
            >
              {
                msg.call.times === 0 
                ? msg.call.video ? <IoVideocamOff /> : <FaPhoneSlash />
                : msg.call.video ? <FaVideo />  : <FaPhone />
              }
            </span>
            <div className='text_left'>
              <h6>{msg.call.video ? 'Video call' : 'Audio call'} </h6>
              <small>
                {
                  msg.call.times > 0 
                  ? <Times total={msg.call.times}/>
                  : 'Cuộc gọi đã bị huỷ'
                }
              </small>
            </div>
          </button>
        }
      </div>
      <div className='chat_time p-2'>{new Date(msg.createdAt).toLocaleString()}</div>
    </>
  );
};

export default MsgDisplay;
