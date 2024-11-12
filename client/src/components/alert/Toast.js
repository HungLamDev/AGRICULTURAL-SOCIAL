import React, { useEffect, useState } from 'react';

const Toast = ({ msg, handleShow, bgColor }) => {
  const [countdown, setCountdown] = useState(5); // Khởi tạo 5 giây

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    const autoClose = setTimeout(() => {
      handleShow();
    }, 5000);

    // Xoá timer khi component bị huỷ
    return () => {
      clearInterval(timer);
      clearTimeout(autoClose);
    };
  }, [handleShow]);

  return (
    <div
      className={`toast show position-fixed text-light ${bgColor}`}
      style={{ top: '5px', right: '5px', minWidth: '200px', zIndex: 50 }}
    >
      <div className={`toast-header text-light ${bgColor}`}>
        <strong className="mr-auto">{msg.title}</strong>
        <span className="ml-2 mb-1 close text-light" style={{ outline: 'none', fontSize: '15px'}} >
          {countdown}s
        </span>
      </div>
      <div className="toast-body">{msg.body}</div>
    </div>
  );
};

export default Toast;
