import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { imageShow, videoShow } from "../utils/mediaShow";
import { createPost, updatePost } from "../redux/actions/postAction";
import Icons from "./Icons";
import category from "../data/category.json";
import { createProduct, updateProduct } from "../redux/actions/productAction";


const StatusModal = () => {
  const auth = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme);
  const status = useSelector((state) => state.status);
  const socket = useSelector((state) => state.socket);

  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [hashtag, setHashtag] = useState("");
  const [address, setAddress] = useState("");
  const [typeProduct, setTypeProduct] = useState("");
  const [productName, setProductName] = useState("");

  const [stream, setStream] = useState(false)
  const videoRef = useRef()
  const refCanvas = useRef()
  const [tracks, setTracks] = useState('')

  const handlleChangeImages = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newImgs = [];

    files.forEach((file) => {
      if (!file) {
        err = "File không tồn tại!";
        return;
      }
      if (file.size > 1024 * 1024 * 5) {
        // 5MB size limit
        err = "Dung lượng file quá lớn!";
        return;
      }
      newImgs.push(file);
    });
    console.log(newImgs);

    if (err) {
      return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    }

    setImages([...images, ...newImgs]);
  };

  const delImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };
  //camera
  const handleStream =  () => {
    setStream(true)
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
            navigator.mediaDevices.getUserMedia({video: true})
            .then(mediaStream => {
                videoRef.current.srcObject = mediaStream
                videoRef.current.play()

                const track = mediaStream.getTracks()
                setTracks(track[0])
            }).catch(err => console.log(err))
    }
  }
  const handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;
  
    refCanvas.current.width = width;
    refCanvas.current.height = height;
  
    const ctx = refCanvas.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    const URL = refCanvas.current.toDataURL();
    
    setImages([...images, {camera: URL}])
  };
  
  const handleStopStream = () => {
    if (tracks) {
      tracks.stop();
      setStream(false);
    }
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
    } else if (status.onMarket) {
      dispatch(
        createProduct({
          content,
          price,
          address,
          typeProduct,
          hashtag,
          images,
          productName,
          auth,
        })
      );
    } else if (status.onEditProduct) {
      dispatch(
        updateProduct({
          content,
          price,
          address,
          typeProduct,
          hashtag,
          images,
          productName,
          auth,
          status,
        })
      );
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
    if (status.onEditProduct) {
      setContent(status.desc);
      setPrice(status.price);
      setAddress(status.address);
      setTypeProduct(status.typeProduct);
      setHashtag(status.hashtag);
      setImages(status.img);
      setProductName(status.productName);
    }
  }, [status]);

  return (
    <div className="status_modal">
      <form onSubmit={handleSubmit}>
        <div className="status_title">
          <h5 className="m-0 ">
            {status.onEdit
              ? "Cập nhật bài viết"
              : status.onMarket
              ? "Tạo sản phẩm mới"
              : status.onEditProduct
              ? "Cập nhật sản phẩm"
              : "Tạo bài viết mới"}
          </h5>
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
            placeholder={
              status.onMarket
                ? "Giới thiệu sản phẩm của bạn !"
                : `${auth.user.username}, Bạn đang nghĩ gì ?`
            }
            onChange={(e) => setContent(e.target.value)}
          />
          {(status.onMarket || status.onEditProduct) && (
            <>
              <div className="pb-2">
                <small>Tên SP: </small>
                <input
                  className="hastag_box"
                  type="text"
                  name="price"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Nhập tên sản phẩm ..."
                />
              </div>
              <div className="pb-2">
                <small>Giá (VNĐ): </small>
                <input
                  className="hastag_box"
                  type="text"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Nhập giá bán ..."
                />
              </div>
              <div className="pb-2">
                <small>Phân loại: </small>
                <select
                  className="hastag_box"
                  name="address"
                  value={typeProduct}
                  onChange={(e) => setTypeProduct(e.target.value)}
                >
                  <option value="">Chọn một phân loại</option>
                  {category.category.map((item, index) => (
                    <option key={index} value={item.label}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pb-2">
                <small>Địa chỉ: </small>
                <select
                  className="hastag_box"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                >
                  <option value="">Tỉnh/Thành phố ...</option>
                  {category.city.map((item, index) => (
                    <option key={index} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="show_imgs">
            {images.map((img, index) => (
              <div key={index} id="file_img">
              {
                  img.camera ? imageShow(img.camera, theme)
                  : img.url
                      ?<>
                          {
                              img.url.match(/video/i)
                              ? videoShow(img.url, theme) 
                              : imageShow(img.url, theme)
                          }
                      </>
                      :<>
                          {
                              img.type.match(/video/i)
                              ? videoShow(URL.createObjectURL(img), theme) 
                              : imageShow(URL.createObjectURL(img), theme)
                          }
                      </>
              }
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
          {
            stream && 
              <div className="stream">
                <video autoPlay muted ref={videoRef} width='100%' height='100%'
                style={{ filter: `${theme ? "invert(1)" : "invert(0)"} ` }}/>
                <span>
                  &times;
                </span>
                <canvas ref={refCanvas} />
              </div>
          }
          <div className="input_images">
          {stream ? (
                      <>
                        <i className="fas fa-camera" onClick={handleCapture} />
                        <span className="material-symbols-outlined" style={{fontSize:'40px', color: 'red'}} onClick={handleStopStream}>
                          cancel_presentation
                        </span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-camera" onClick={handleStream} />
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
                      </>
                    )}
          </div>
        </div>
        <div className="status_footer">
          <button className="btn btn-secondary w-100" type="submit">
            Đăng bài
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusModal;
