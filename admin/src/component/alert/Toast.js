import React, { useEffect, useState } from "react";

const Toast = ({ msg, handleShow, bgColor }) => {
  const [isVisible, setIsVisible] = useState(true); // Trạng thái hiển thị của Toast

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Tự động ẩn Toast sau 5 giây
    }, 5000);

    return () => clearTimeout(timer); // Dọn dẹp timer khi component bị huỷ
  }, []);

  // Hàm xử lý đóng Toast
  const closeToast = () => {
    setIsVisible(false);
    handleShow(); // Gọi handleShow từ Alert.js để thay đổi trạng thái ở đó
  };

  // Nếu Toast không hiển thị, return null
  if (!isVisible) return null;

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
            marginLeft: 'auto',
          }}
          onClick={closeToast}
        >
          &times;
        </button>
      </div>
      <div className="toast-body">{msg.body}</div>
    </div>
  );
};

export default Toast;
