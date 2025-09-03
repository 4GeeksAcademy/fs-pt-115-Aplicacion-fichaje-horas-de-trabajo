import React, { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import { Login } from "../components/Login.jsx";
import { Perfilnew } from "../components/Perfilnew.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";






export const PerfilNew = () => {
  // Access the global state and dispatch function using the useGlobalReducer hook.
  const { store, dispatch } = useGlobalReducer()

  return(
    <Perfilnew />

  )
}