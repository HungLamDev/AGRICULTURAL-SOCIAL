import React, { useState, useEffect, useRef } from "react";
import UserCard from "../UserCard";
import { useSelector, useDispatch } from "react-redux";
import { getDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import { useNavigate } from "react-router-dom";
import {
  MESS_TYPES,
  getConversations,
} from "../../redux/actions/messageAction";

const LeftSide = () => {
  const auth = useSelector((state) => state.auth);
  const message = useSelector((state) => state.message);
  const online = useSelector((state) => state.online);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pageEnd = useRef();
  const [page, setPage] = useState(0);

  const [searchUsers, setSearchUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loadData, setLoadData] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: "Vui lòng nhập từ khóa tìm kiếm!" },
      });
      return;
    }

    try {
      setLoadData(true);
      const res = await getDataAPI(`search?search=${search}`, auth);
      const result = res.data;

      if (result.users.length === 0 && result.posts.length === 0) {
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { err: "Không tìm thấy!" },
        });
      } else {
        setSearchUsers(result.users);
      }
    } catch (err) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { err: err.response?.statusText || "Đã xảy ra lỗi!" },
      });
    } finally {
      setLoadData(false);
    }
  };

  const handleAddUser = (user) => {
    setSearch("");
    setSearchUsers([]);
    dispatch({
      type: MESS_TYPES.MARK_MESSAGE_READ,
      payload: user._id, // Đánh dấu đã đọc tin nhắn
    });
    dispatch({
      type: MESS_TYPES.ADD_USER,
      payload: { ...user, text: "", media: [] },
    });
    return navigate(`/message/${user._id}`);
  };

  useEffect(() => {
    if (message.firstLoad) return;
    dispatch(getConversations({ auth }));
  }, [dispatch, auth, message.firstLoad]);

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
    if (message.resultUsers >= (page - 1) * 9 && page > 1) {
      dispatch(getConversations({ auth, page }));
    }
  }, [message.resultData, page, auth, dispatch, message.resultUsers]);

  // check user online offline
  useEffect(() => {
    if (message.firstLoad) {
      dispatch({ type: MESS_TYPES.CHECK_ONLINE, payload: online });
    }
  }, [online, message.firstLoad, dispatch]);

  return (
    <>
      <form className="message_header_search" onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          placeholder="Tìm kiếm ..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" style={{ display: "none" }}>
          Tìm
        </button>
      </form>
      <div className="message_list">
        {searchUsers.length !== 0 ? (
          searchUsers.map((user) => (
            <div
              key={user._id}
              className="message_user"
              onClick={() => handleAddUser(user)}
            >
              <UserCard user={user} msg={true} />
            </div>
          ))
        ) : (
          <>
            {message.users
              .slice()
              .sort((a, b) => {
                const timeA = a.lastMessageTime
                  ? new Date(a.lastMessageTime).getTime()
                  : 0;
                const timeB = b.lastMessageTime
                  ? new Date(b.lastMessageTime).getTime()
                  : 0;
                return timeB - timeA; // Sắp xếp giảm dần theo thời gian
              })
              .map((user) => (
                <div
                  key={user._id}
                  className="message_user"
                  onClick={() => handleAddUser(user)}
                >
                  <UserCard user={user} msg={true}>
                    {message.newMessages[user._id] && (
                      <span className="new-message-indicator">
                        Tin nhắn mới
                      </span>
                    )}
                  </UserCard>
                </div>
              ))}
            <button ref={pageEnd} style={{ opacity: 0 }}>
              Load more
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default LeftSide;
