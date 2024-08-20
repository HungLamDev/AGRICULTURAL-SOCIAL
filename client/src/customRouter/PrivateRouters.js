import { Navigate, Outlet } from "react-router-dom";

const PrivateRouter = ({ element: Element, ...rest }) => {
  const firstLogin = localStorage.getItem("firstLogin");

  return firstLogin ? <Element {...rest} /> : <Navigate to="/" />;
};

export default PrivateRouter;
