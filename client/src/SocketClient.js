import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { POSTTYPES } from "./redux/actions/postAction";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import { NOTIFY_TYPES } from "./redux/actions/notifyAction";
import { MESS_TYPES } from "./redux/actions/messageAction";

const SocketClient = () => {
  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);
  const online = useSelector((state) => state.online);
  const call = useSelector((state) => state.call);

  const dispatch = useDispatch();

  //connect user
  useEffect(() => {
    if (socket && socket.emit && auth.user) {
      socket.emit("joinUser", auth.user);
    }
  }, [socket, auth.user]);
  // like and unlike
  useEffect(() => {
    socket.on("likeToClient", (newPost) => {
      dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });
    });
    return () => socket.off("likeToClient");
  }, [dispatch, socket]);

  useEffect(() => {
    socket.on("unlikeToClient", (newPost) => {
      dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });
    });
    return () => socket.off("unlikeToClient");
  }, [dispatch, socket]);
  // Comments
  useEffect(() => {
    socket.on("createCommentToClient", (newPost) => {
      dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });
    });
  });

  useEffect(() => {
    socket.on("deleteCommentToClient", (newPost) => {
      dispatch({ type: POSTTYPES.UPDATE_POST, payload: newPost });
    });
  });
  // Follow
  useEffect(() => {
    socket.on("followToClient", (newUser) => {
      dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
    });

    return () => socket.off("followToClient");
  }, [socket, dispatch, auth]);

  useEffect(() => {
    socket.on("unfollowToClient", (newUser) => {
      dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
    });

    return () => socket.off("unfollowToClient");
  }, [socket, dispatch, auth]);
  // Notification
  useEffect(() => {
    socket.on("createNotifyToClient", (msg) => {
      dispatch({ type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg });
    });

    return () => socket.off("createNotifyToClient");
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on("removeNotifyToClient", (msg) => {
      dispatch({ type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg });
    });

    return () => socket.off("removeNotifyToClient");
  }, [socket, dispatch]);
  // Message 
  useEffect(() => {
    socket.on("addMessageToClient", (msg) => {
      dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})
      dispatch({
        type: MESS_TYPES.ADD_USER, 
        payload: { 
          ...msg.user, 
          text: msg.text, 
          media: msg.media
        }
      })
    });

    return () => socket.off("addMessageToClient");
  }, [socket, dispatch]);
  // check user online // offline
  useEffect(() => {
      socket.emit('checkUserOnline', auth.user)
  },[socket, auth.user])

  useEffect(() => {
      socket.on('checkUserOnlineToMe', data =>{
          data.forEach(item => {
              if(!online.includes(item.id)){
                  dispatch({type: GLOBALTYPES.ONLINE, payload: item.id})
              }
          })
      })

      return () => socket.off('checkUserOnlineToMe')
  },[socket, dispatch,online])

  useEffect(() => {
      socket.on('checkUserOnlineToClient', id =>{
          if(!online.includes(id)){
              dispatch({type: GLOBALTYPES.ONLINE, payload: id})
          }
      })

      return () => socket.off('checkUserOnlineToClient')
  },[socket, dispatch, online])
  // Check User Offline
  useEffect(() => {
      socket.on('CheckUserOffline', id =>{
          dispatch({type: GLOBALTYPES.OFFLINE, payload: id})
      })

      return () => socket.off('CheckUserOffline')
  },[socket, dispatch])

  //call ưser
  useEffect(() => {
    socket.on('callUserToClient', data =>{
      dispatch({type: GLOBALTYPES.CALL, payload: data})
    })
    return () => socket.off('callUserToClient')
  },[socket, dispatch])

  useEffect(() => {
    socket.on('userBusy', data =>{
      dispatch({type: GLOBALTYPES.ALERT, payload: {error: `${call.username} đang bận!`}})
    })
    return () => socket.off('userBusy')
  },[socket, dispatch, call])
  
};
  

export default SocketClient;
