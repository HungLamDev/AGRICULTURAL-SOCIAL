import React, { useState, useEffect, useRef } from "react";
import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import MsgDisplay from "./MsgDisplay";
import Icons from "../Icons";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { imageShow, videoShow } from "../../utils/mediaShow";
import { imageUpload } from "../../utils/imageUpload";
import {
  addMessage,
  getMessages,
  MESS_TYPES,
} from "../../redux/actions/messageAction";
import loadIcon from "../../images/loading.gif";

const RightSide = () => {
  const auth = useSelector((state) => state.auth);
  const message = useSelector((state) => state.message);
  const theme = useSelector((state) => state.theme);
  const socket = useSelector((state) => state.socket);
  const dispatch = useDispatch();

  const { id } = useParams();

  const [user, setUser] = useState({});
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [loadMedia, setLoadMedia] = useState(false);
  const [page, setPage] = useState(0);

  const refDisplay = useRef();
  const pageEnd = useRef();
  useEffect(() => {
    const newUser = message.users.find((user) => user._id === id);
    if (newUser) {
      setUser(newUser);
    }
  }, [message.users, id]);

  const handleChange = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newMedia = [];

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
      newMedia.push(file);
    });

    if (err) {
      return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } });
    }

    setMedia([...media, ...newMedia]);
  };

  const handleDeleteMedia = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) return;

    setText("");
    setMedia([]);
    setLoadMedia(true);

    let newArr = [];
    if (media.length > 0) {
      newArr = await imageUpload(media);
    }

    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      media: newArr,
      createdAt: new Date().toISOString(),
    };

    setLoadMedia(false);
    await dispatch(addMessage({ msg, auth, socket }));

    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  // realtime
  useEffect(() => {
    if (id) {
      const getMessagesData = async () => {
        dispatch({ type: MESS_TYPES.GET_MESSAGES, payload: { messages: [] } });
        await dispatch(getMessages({ auth, id }));
        setPage(0);
        if (refDisplay.current) {
          refDisplay.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }
      };
      getMessagesData();
    }
  }, [id, dispatch, auth]);

  // loadmore
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );
    observer.observe(pageEnd.current);
  }, [setPage]);

  useEffect(() => {
    if (page > 0 && message.resultData >= (page - 1) * 9) {
      dispatch(getMessages({ auth, id, page }));
    }
  }, [message.resultData, page, id, auth, dispatch]);

  useEffect(() => {
    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [text]);

  return (
    <>
      <div className="message_header rounded-2">
        {user && user._id && (
          <UserCard user={user}>
            <i className="fas fa-trash text-danger" />
          </UserCard>
        )}
      </div>

      <div
        className="chat_container"
        style={{ height: media.length > 0 ? "calc(100% - 180px)" : "" }}
      >
        <div className="chat_display" ref={refDisplay}>
          <button style={{ marginTop: "-25px", opacity: 0 }} ref={pageEnd}>
            Load more
          </button>

          {message.data.map((msg, index) => (
            <div key={index}>
              {msg.sender !== auth.user._id ? (
                <div className="chat_row other_message">
                  <MsgDisplay user={user} msg={msg} theme={theme} />
                </div>
              ) : (
                <div className="chat_row you_message">
                  <MsgDisplay user={auth.user} msg={msg} theme={theme} />
                </div>
              )}
            </div>
          ))}
          {loadMedia && (
            <div className="chat_row you_message">
              <img src={loadIcon} alt="loading" />
            </div>
          )}
        </div>
      </div>

      <div
        className="show_media"
        style={{
          display: media.length > 0 ? "" : "none",
          filter: theme ? "invert(1)" : "invert(0)",
        }}
      >
        {media.map((item, index) => (
          <div key={index} id="file_media">
            {item.type.match(/image/i)
              ? imageShow(URL.createObjectURL(item), theme)
              : videoShow(URL.createObjectURL(item), theme)}
            <span onClick={() => handleDeleteMedia(index)}>&times;</span>
          </div>
        ))}
      </div>

      <form className="chat_input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nhập nội dung bạn muốn nhắn..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            filter: theme ? "invert(1)" : "invert(0)",
            background: theme ? "black" : "",
          }}
        />
        <Icons setContent={setText} content={text} theme={theme} />
        <div className="file_upload">
          <i className="fas fa-image text-danger" />
          <input
            type="file"
            name="file"
            id="file"
            multiple
            accept="image/*,video/*"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="material-icons"
          disabled={!text && media.length === 0}
        >
          send
        </button>
      </form>
    </>
  );
};

export default RightSide;
