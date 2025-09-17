import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkUsuarios } from "../services/APIServices.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const CheckFirstUserRoute = ({ blockIfUsersExist, redirectTo }) => {
  const [loading, setLoading] = useState(true);
  const [hasUser, setHasUser] = useState(false);
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usuarios = await checkUsuarios(); // Devuelve bool
        setHasUser(usuarios);
        
      } catch (error) {
        console.error("Error comprobando usuarios:", error);
        setHasUser(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Cargando...</div>;

  if (blockIfUsersExist === hasUser) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
};

export default CheckFirstUserRoute;