import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { POSTTYPES } from "./redux/actions/postAction";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import { NOTIFY_TYPES } from "./redux/actions/notifyAction";
import { MESS_TYPES } from "./redux/actions/messageAction";

const SocketClient = () => {
  const auth = useSelector((state) => state.auth);
  const socket = useSelector((state) => state.socket);

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
      
    });

    return () => socket.off("addMessageToClient");
  }, [socket, dispatch]);
};

export default SocketClient;
