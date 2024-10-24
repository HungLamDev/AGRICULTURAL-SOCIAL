import React from 'react';

const Loading = () => {
  return (
    <div
      className="position-fixed w-100 h-100 text-center loading"
      style={{ 
        background: "rgba(0, 0, 0, 0.5)",  // Semi-transparent background
        color: "#fff", 
        top: 0, 
        left: 0, 
        zIndex: 9999,  // Higher z-index to stay on top
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center"
      }}
    >
      <div className="spinner">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default Loading;
