import React from 'react'
import Avatar from '../Avatar'
const MsgDisplay = ({user}) => {
  return (
    <>
      <div className='chat_title'>
            <Avatar src={user.avatar} size="medium-avatar"  />

            <span>
                  {user.username}
            </span>
      </div>
      <div className='chat_text'>
            Nhóm thanh niên chạy xe bóc đầu phóng nhanh (cầm đầu HOÀNG CÔNG TRƯỜNG) đoạn đường 3/2 hẻm 51 hướng về cầu Đầu Sấu.
            Mong các em hoặc phụ huynh nhìn thấy và thay đổi tư duy con em mình. 
            Không có gì hay ho mà còn gây nguy hiểm cho người khác và bản thân mình. 
            Hi vọng admin duyệt bài. Cám ơn ạ.
      </div>
      <div className='chat_time p-2'>
            April 2021
      </div>
    </>
  )
}

export default MsgDisplay