import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import MsgDisplay from "./MsgDisplay";
import Icons from "../Icons";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { imageShow, videoShow } from "../../utils/mediaShow";
import { imageUpload } from "../../utils/imageUpload";
import {
  addMessage,
  getMessages,
  loadMoreMessages,
  deleteConversation,
} from "../../redux/actions/messageAction";
import loadIcon from "../../images/loading.gif";
import ting from '../audio/happy-pop-3-185288.mp3';
import { IoIosSend } from "react-icons/io";

const RightSide = () => {
  const auth = useSelector((state) => state.auth);
  const message = useSelector((state) => state.message);
  const theme = useSelector((state) => state.theme);
  const socket = useSelector((state) => state.socket);
  const peer = useSelector((state) => state.peer);


  const dispatch = useDispatch();

  const { id } = useParams();
  const refDisplay = useRef();
  const pageEnd = useRef();

  const [user, setUser] = useState({});
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [loadMedia, setLoadMedia] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigation = useNavigate();

  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(0);

  useEffect(() => {
    const newData = message.data.find((item) => item._id === id);
    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
    }
  }, [message.data, id]);

  useEffect(() => {
    if (id && message.users.length > 0) {
      setTimeout(() => {
        refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 50);

      const newUser = message.users.find((user) => user._id === id);
      if (newUser) {
        setUser(newUser);
      }
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
  
    // Phát âm thanh khi gửi tin nhắn
    const audio = new Audio(ting);
    audio.play();
  
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
  
    // Gửi tin nhắn qua Redux action
    await dispatch(addMessage({ msg, auth, socket }));
  
    // Gửi thông báo qua socket
    socket.emit("sendMessage", {
      sender: auth.user._id,
      recipient: id,
      text,
      media: newArr,
    });
  
    if (refDisplay.current) {
      refDisplay.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  // send tiếng tb tin nhắn 
  useEffect(() => {
    socket.on("sendMessage", (data) => {
      // Hiển thị thông báo khi nhận tin nhắn mới
      if (auth.user._id !== data.sender) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: {
            success: `Bạn nhận được tin nhắn mới từ ${data.sender}`,
          },
        });
      }
    });
  
    return () => socket.off("sendMessage");
  }, [socket, auth.user._id, dispatch]);
  
  
  // realtime
  useEffect(() => {
    const getMessagesData = async () => {
      if (message.data.every((item) => item._id !== id)) {
        await dispatch(getMessages({ auth, id }));
        setTimeout(() => {
          refDisplay.current.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 50);
      }
    };
    getMessagesData();
  }, [id, dispatch, auth, message.data]);

  // loadmore
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoadMore((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, [setIsLoadMore]);

  useEffect(() => {
    if (isLoadMore > 1) {
      if (result >= page * 9) {
        dispatch(loadMoreMessages({ auth, id, page: page + 1 }));
        setIsLoadMore(1);
      }
    }
    // eslint-disable-next-line
  }, [isLoadMore]);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteModal(false);
  };
  const handleConfirmDeleteConversation = () => {
    dispatch(deleteConversation({ auth, id }));
    setOpenDeleteModal(false);
    navigation("/message");
  };
  // call
  const caller = ({ video }) => {
    const { _id, avatar, username} = user;

    const msg = {
      sender: auth.user._id,
      recipient: _id,
      avatar,
      username,
      video,
    };
    dispatch({ type: GLOBALTYPES.CALL, payload: msg });
  };
  const callUser = ({ video }) => {
    const { _id, avatar, username } = auth.user;
    const msg = {
      sender: _id,
      recipient: user._id,
      avatar,
      username,
      video,
    };
    if (peer.open) msg.peerId = peer._id;
    socket.emit("callUser", msg);
  };
  const handleAudiocall = () => {
    caller({ video: false });
    callUser({ video: false });
  };

  const handleVideoCall = () => {
    caller({ video: true });
    callUser({ video: true });
  }; 
  
  return (
    <>
      <div className="message_header rounded-2" style={{ cursor: "pointer" }}>
        {user && user._id && (
          <UserCard user={user}>
            <div>
              <i
                className="fas fa-phone-alt call_audio"
                onClick={handleAudiocall}
                title="Bắt đầu gọi hội thoại"
              />
              <i
                className="fas fa-video mx-3 call_video"
                onClick={handleVideoCall}
                title="Bắt đầu gọi video"
              />
              <i
                className="fas fa-trash text-danger delete_message"
                onClick={handleOpenDeleteDialog}
                title="Xóa đoạn hội thoại"
              />
            </div>
          </UserCard>
        )}
      </div>
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xóa đoạn hội thoại</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa đoạn hội thoại này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDeleteConversation} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <div
        className="chat_container"
        style={{ height: media.length > 0 ? "calc(100% - 180px)" : "" }}
      >
        <div className="chat_display" ref={refDisplay}>
          <button style={{ marginTop: "-25px", opacity: 0 }} ref={pageEnd}>
            Load more
          </button>

          {data.map((msg, index) => (
            <div key={index}>
              {msg.sender !== auth.user._id ? (
                <div className="chat_row other_message">
                  <MsgDisplay user={user} msg={msg} theme={theme} />
                </div>
              ) : (
                <div className="chat_row you_message">
                  <MsgDisplay
                    user={auth.user}
                    msg={msg}
                    theme={theme}
                    data={data}
                  />
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
          className=""
          disabled={!text && media.length === 0}
          style={{background: 'white', fontSize: '20px', color: 'green', paddingBottom: '8px', cursor:'pointer'}}
        >
          <IoIosSend/>
        </button>
      </form>
    </>
  );
};

export default RightSide;
