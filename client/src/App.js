import React, { useEffect }from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageRender from './PageRender';
import Home from './pages/home';
import Login from './pages/login';
import Alert from './components/alert/Alert'
import Header from './components/alert/Header';
import { useDispatch, useSelector } from 'react-redux';
import { refrechToken } from './redux/actions/authAction';
const App = () => {
  const {auth} = useSelector(state => state);
  const dispacth = useDispatch()
  useEffect(() => {
    dispacth(refrechToken())
  }, [dispacth])
  // useEffect(() => {
  //   console.log('Current auth token:', auth.token);
  // }, [auth.token]);
  return (
    <Router>
      <Alert />
      <input type="checkbox" id="theme" />
      <div className="App">
        <div className="main">
          {auth.token && <Header />}
          <Routes>
            <Route path="/" element={auth.token ? <Home /> : <Login />} />
            <Route path="/:page" element={<PageRender />} />
            <Route path="/:page/:id" element={<PageRender />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
