import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const CheckFirstUserRoute = ({ children }) => {
  const { store, dispatch } = useGlobalReducer();

  const isFirstUser = store.users.length === 0;

  return isFirstUser ? children : <Navigate to="/signin" />;
};

export default CheckFirstUserRoute;
