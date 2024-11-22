import React from "react";
import { useSelector } from "react-redux";

const LikeBtn = ({ isLike, handleLike, handleUnLike }) => {
  const theme = useSelector((state) => state.theme);
  return (
    <>
      {isLike ? (
        <span
          className="material-symbols-outlined text-danger"
          style={{ filter: theme ? "invert(1)" : "invert(0)", cursor: 'pointer'}}
          onClick={handleUnLike}
        >
          favorite
        </span>
      ) : (
        <span className="material-symbols-outlined" onClick={handleLike} style={{cursor: "pointer"}}>
          favorite
        </span>
      )}
    </>
  );
};

export default LikeBtn;
