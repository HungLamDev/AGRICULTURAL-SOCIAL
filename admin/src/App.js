import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { refreshToken } from "./redux/actions/authAction";

import PageRender from "./customRouter/RoutePage";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";

import Header from "./component/header/Header";
import Load from "./component/Loading";

function App() {
  const auth = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.notify?.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <div className="main">
          {auth && <Header />}
          {loading && <Load />}
          <Routes>
            <Route path="/" element={auth ? <HomePage /> : <LoginPage />} />
            <Route exact path="/:page" element={<PageRender />} />
            <Route exact path="/:page/:id" element={<PageRender />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
