import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect } from "react";
import { checkUsuarios } from "../services/APIServices.js";

const CheckFirstUserRoute = ({ children }) => {
  const { store, dispatch } = useGlobalReducer();

  // useEffect(() => {
  //   if (store.users.length != 0) return Navigate("/login");

  //   console.log(store.users);
  // }, [store.users]);

  const isFirstUser = checkUsuarios();

  return isFirstUser ? children : <Navigate to="/signin" />;
};

export default CheckFirstUserRoute;
