import React from 'react'
import LeftSide from '../../components/message/LeftSide'
import { FaFacebookMessenger } from "react-icons/fa";
const message = () => {
  return (
    <div className="message row m-0">
      <div className="col-md-3 border-right px-2">
        <LeftSide />
      </div>
      <div className="col-md-8 right_side">
        <div className="d-flex justify-content-center align-items-center flex-column h-100">
          <FaFacebookMessenger style={{ fontSize: "5rem" , color: 'blue'}}/>
          <h4>Tin nhắn</h4>
        </div>
      </div>
    </div>
  )
}

export default message
