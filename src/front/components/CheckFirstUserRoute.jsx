import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect } from "react";
import { checkUsuarios } from "../services/APIServices.js";

const CheckFirstUserRoute = ({ children }) => {
  const { store, dispatch } = useGlobalReducer();

  const isFirstUser = checkUsuarios();

  return isFirstUser ? children : <Navigate to="/signin" />;
};

export default CheckFirstUserRoute;
