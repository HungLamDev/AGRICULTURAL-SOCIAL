import React from 'react'
import Avatar from '../Avatar'
import { videoShow, imageShow } from '../../utils/mediaShow'
const MsgDisplay = ({user,msg,theme}) => {
  return (
    <>
      <div className='chat_title pt-2'>
            <Avatar src={user.avatar} size="medium-avatar"  />
            <span className='pl-1'>
                  {user.username}
            </span>
      </div>
      {
            msg.text && <div className='chat_text' style={{filter: theme ? 'invert(1)' : 'invert(0)'}}> {msg.text} </div>
      }
      {
            msg.media.map((item,index) => (
                  <div key={index} style={{width: '40%', filter: theme ? 'invert(1)' : 'invert(0)'}}>
                        {
                              item.url.match(/video/i)
                              ? videoShow(item.url, theme)
                              : imageShow(item.url, theme)
                        }
                  </div>
            ))
      }
      
      <div className='chat_time p-2'>
            {new Date(msg.createdAt).toLocaleString()}
      </div>
    </>
  )
}

export default MsgDisplay