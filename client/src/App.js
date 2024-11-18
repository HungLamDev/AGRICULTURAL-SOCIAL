import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageRender from "../src/customRouter/PageRender";
import PrivateRouter from "./customRouter/PrivateRouter";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Alert from "./components/alert/Alert";
import Header from "./components/header/Header";
import StatusModal from "./components/StatusModal";
import { useDispatch, useSelector } from "react-redux";
import { refrechToken } from "./redux/actions/authAction";
import { getPosts } from "./redux/actions/postAction";
import { getSuggestions } from "./redux/actions/suggestionAction";
import { getNotifies } from "./redux/actions/notifyAction";
import CallModal from "./components/message/CallModal";

import io from "socket.io-client";
import SocketClient from "./SocketClient";
import { GLOBALTYPES } from "./redux/actions/globalTypes";

import Peer from "peerjs";

function App() {
  const auth = useSelector((state) => state.auth);
  const status = useSelector((state) => state.status);
  const call = useSelector((state) => state.call);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refrechToken());
  }, [dispatch]);

  useEffect(() => {
    const socket = io(
      process.env.REACT_APP_API_BASE_URL || "http://localhost:8000"
    );
    socket.on("receiveMessage", (message) => {
      console.log("Received message:", message);
    });
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
    return () => socket.close();
  }, [dispatch]);

  useEffect(() => {
    // console.log("useEffect 3 triggered");
    if (auth.token) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
      dispatch(getNotifies(auth.token));
    }
  }, [dispatch, auth.token]);

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      host: "/",
      port: 3001,
      secure: true,
    });
    console.log("Socket URL:", (process.env.REACT_APP_SOCKET_URL || "").trim());
    console.log("PeerJS Host:", (process.env.REACT_APP_PEER_HOST || "").trim());
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer });
  }, [dispatch]);

  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className="App">
        <div className="main">
          {auth.token && <Header />}
          {status && <StatusModal />}
          {auth.token && <SocketClient />}
          {call && <CallModal />}
          <Routes>
            <Route path="/" element={auth.token ? <Home /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRouter />}>
              <Route path="/:page" element={<PageRender />} />
              <Route path="/:page/:id" element={<PageRender />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
