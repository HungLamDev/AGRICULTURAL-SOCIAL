import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { imageShow, videoShow } from "../utils/mediaShow";
import { createPost, updatePost } from "../redux/actions/postAction";
import Icons from "./Icons";
import category from "../data/category.json";
// import Icons from "./Icons";
const StatusModal = () => {
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);
  const status = useSelector((state) => state.status);
  const socket = useSelector((state) => state.socket);

  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [hashtag, setHashtag] = useState("");
  const [address, setAddress] = useState("");
  const [typeProduct, setTypeProduct] = useState("");
  const [productName, setProductName] = useState("");

  const handlleChangeImages = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newImgs = [];

    files.forEach((file) => {
      if (!file) return (err = "File không tồn tại !");
      if (file.size > 1024 * 1024 * 5) {
        return (err = "Dung lượng file quá lớn !");
      }

      return newImgs.push(file);
    });
    if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { err: err } });
    setImages([...images, ...newImgs]);
  };
  const delImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (images.length === 0)
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Vui lòng chọn ảnh hoặc video! " },
      });
    if (status.onEdit) {
      dispatch(updatePost({ content, hashtag, images, auth, status, socket }));
    } else {
      dispatch(createPost({ content, hashtag, images, auth, socket }));
    }
  };
  useEffect(() => {
    if (status.onEdit) {
      setContent(status.desc);
      setImages(status.img);
      setHashtag(status.hashtag);
    }
  }, [status]);
  return (
    <div className="status_modal">
      <form onSubmit={handleSubmit}>
        <div className="status_title">
          <h5 className="m-0">Create Post</h5>
          <span
            onClick={() =>
              dispatch({
                type: GLOBALTYPES.STATUS,
                payload: false,
              })
            }
          >
            &times;
          </span>
        </div>
        <div className="status_container">
          <textarea
            name="content"
            value={content}
            placeholder={`${auth.user.username} ơi, bạn đang nghĩ gì?`}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="show_imgs">
            {images.map((img, index) => (
              <div
                key={index}
                style={{ filter: `${theme ? "invert(1)" : "invert(0)"} ` }}
                id="file_img"
              >
                {img.url ? (
                  <>
                    {img.url.match(/video/i)
                      ? videoShow(img.url)
                      : imageShow(img.url)}
                  </>
                ) : (
                  <>
                    {img.type.match(/video/i)
                      ? videoShow(URL.createObjectURL(img))
                      : imageShow(URL.createObjectURL(img))}
                  </>
                )}

                <span onClick={() => delImage(index)}>&times;</span>
              </div>
            ))}
          </div>
          <div>
            <small>Từ khóa: </small>
            <input
              className="hastag_box"
              type="text"
              name="hashtag"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              placeholder="#caytrong, #channuoi, ..."
            />
          </div>
          <div className="d-flex">
            <div className="flex-fill"></div>
            <Icons setContent={setContent} content={content} />
          </div>
          <div className="input_images">
            <i className="fas fa-camera" />
            <div className="file_upload">
              <i className="fas fa-image" />
              <input
                type="file"
                name="file"
                id="file"
                multiple
                accept="image/*,video/*"
                onChange={handlleChangeImages}
              />
            </div>
          </div>
        </div>
        <div className="status_footer">
          <button className="btn btn-secondary w-100" type="submit">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusModal;
