import { Navigate, Outlet } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useEffect, useState } from "react";
import { checkUsuarios } from "../services/APIServices.js";

const CheckFirstUserRoute = () => {
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

  if (loading) return <div>Cargando...</div>;

  return hasUser ? <Navigate to="/login"/> : <Navigate to="/signup" />;


};

export default CheckFirstUserRoute;
