import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { checkUsuarios } from "../services/APIServices.js";

const CheckFirstUserRoute = ({ children }) => {
  const { store, dispatch } = useGlobalReducer();
  const [loading, setLoading] = useState(true);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
    const usuarios = await checkUsuarios();
    console.log(usuarios);
    setHasUser(usuarios);
    setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Cargando...</div>; // o un spinner

  return hasUser ? children : <Navigate to="/signin" />;


};

export default CheckFirstUserRoute;
