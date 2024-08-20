import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouter = () => {
  const firstLogin = localStorage.getItem('firstLogin');
  return firstLogin ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRouter;
