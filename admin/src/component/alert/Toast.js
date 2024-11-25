import React, { useEffect } from "react";

const Toast = ({ msg, handleShow, bgColor }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      handleShow();
    }, 5000); // Tự động tắt sau 5 giây

    // Xóa timer khi component bị huỷ
    return () => clearTimeout(timer);
  }, [handleShow]);

  return (
    <div
      className={`toast show position-fixed text-light ${bgColor}`}
      style={{ top: "5px", right: "5px", minWidth: "200px", zIndex: 50 }}
    >
      <div className={`toast-header text-light ${bgColor}`}>
        <strong className="mr-auto">{msg.title}</strong>
        <button
          className="ml-2 mb-1 close text-light"
          style={{
            outline: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
          onClick={handleShow}
        >
          &times;
        </button>
      </div>
      <div className="toast-body">{msg.body}</div>
    </div>
  );
};

export default Toast;
