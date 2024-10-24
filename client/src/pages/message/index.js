import React from "react";
import LeftSide from "../../components/message/LeftSide";

const Message = () => {
  return (
    <div className="message d-flex">
      <div className="col-md-4 border-right px-2">
        <LeftSide />
      </div>
      <div className="col-md-8 px-2 right_side">
        <div className="d-flex 
            justify-content-center 
            align-items-center 
            flex-column 
            h-100">
          <i className="fa-regular fa-message" style={{ fontSize: "5rem" }}></i>
          <h4>Tin nhắn</h4>
        </div>
      </div>
    </div>
  );
};

export default Message;