import React, { useState, useEffect } from "react";
import LikeBtn from "../../LikeBtn";
import ShareModal from "../../ShareModal";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../../utils/config";
import { useSelector, useDispatch } from "react-redux";
import { likePost } from "../../../redux/actions/postAction";
const CardFooter = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);

  const {auth} = useSelector((state) => state);
  const dispatch = useDispatch()

  useEffect(() => {
    if(post.like.find(like => like._id === auth.user._id)){
      setIsLike(true)
    }
  }, [post.likes,auth.user._id])
  

  const handleLike = async () => {
    if(loadLike) return;
    setIsLike(true)
    setLoadLike(true)
    await dispatch(likePost({post, auth}))
    setLoadLike(false)
  }
  const handleUnLike = () => {
    setIsLike(false)
  }
  return (
    <div className="card_footer">
      <div className="card_icon_menu">
        <div>
          <LikeBtn
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
          <Link to={`/post/${post._id}`} className="text-dark">
            <span className="material-symbols-outlined">comment</span>
          </Link>
          <span
            className="material-symbols-outlined"
            onClick={() => setIsShare(!isShare)}
          >
            share
          </span>
        </div>
        {saved ? (
          <span
            className="material-symbols-outlined text-success"
            // onClick={handleUnSavePost}
          >
            bookmark
          </span>
        ) : (
          // onClick={handleSavePost}
          <span className="material-symbols-outlined">bookmark</span>
        )}
      </div>
      <div className="d-flex justify-content-between">
        <h6 style={{ padding: "0 25px", cursor: "pointer" }}>
          {post.like.length} Thích
        </h6>
        <h6 style={{ padding: "0 25px", cursor: "pointer" }}>
          {post.comments.length} Bình luận
        </h6>
      </div>
      {isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} />}
    </div>
  );
};

export default CardFooter;
