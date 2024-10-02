import React from "react";

const LikeBtn = ({ isLike, handleLike, handleUnLike }) => {
  return (
    <>
      {isLike ? (
        <span
          className="material-symbols-outlined text-danger p-2"
          onClick={handleUnLike}
        >
          favorite
        </span>
      ) : (
        <span className="material-symbols-outlined p-2" onClick={handleLike}>
          favorite
        </span>
      )}
    </>
  );
};

export default LikeBtn;
