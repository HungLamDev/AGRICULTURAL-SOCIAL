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

const App = () => {
  const auth = useSelector((state) => state.auth);
  const status = useSelector((state) => state.status);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refrechToken());
  }, [dispatch]);
  useEffect(() => {
    if (auth.token) {
      dispatch(getPosts(auth.token));
      dispatch(getSuggestions(auth.token));
    }
  }, [dispatch, auth.token]);
  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className="App">
        <div className="main">
          {auth.token && <Header />}
          {status && <StatusModal />}
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
};

export default App;
