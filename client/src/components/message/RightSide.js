import React, { useState, useEffect } from 'react'
import UserCard from '../UserCard'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import MsgDisplay from './MsgDisplay'

const RightSide = () => {

      const {auth, message} = useSelector(state => state)
      const dispatch = useDispatch()

      const {id} = useParams()
      const [user, setUser] = useState([])
      const [text, setText] = useState('')

      useEffect(() => {
        const newUser = message.users.find(user => user._id === id)
        if(newUser){
            setUser(newUser)
        }
      }, [message.users, id])
      
      return (
            <>
                  <div className='message_header rounded-2'>
                        <UserCard user={user}>
                              <i className='fas fa-trash text-danger' />
                        </UserCard>
                  </div>

                  <div className='chat_container'>
                        <div className='chat_display'>
                              <div className='chat_row other_message'>
                                    <MsgDisplay user = {user}/>
                              </div>
                              <div className='chat_row you_message'>
                                    <MsgDisplay user = {auth.user}/>
                              </div>
                        </div>

                  </div>
                  <form className='chat_input'>
                        <input type="text" placeholder='Nhập nội dung bạn muốn nhắn...' value={text} onChange={e => setText(e.target.value)}/>
                        <button type='submit' className='material-icons' disabled={text ? false : true}>
                              send
                        </button>
                  </form>

            </>
      )
}

export default RightSide